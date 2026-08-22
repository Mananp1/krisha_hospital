'use server';

/**
 * Submission handlers for the two public, patient-facing forms.
 *
 * ## Why these exist
 *
 * Both forms used to call their Supabase RPC straight from the browser. That
 * worked, but left nowhere to send email from — `RESEND_API_KEY` must never
 * reach a client bundle. Routing the submit through here adds the one
 * server-side step the notification needs.
 *
 * Doing the insert *and* the email in the same place is deliberate. An
 * email-only endpoint would be a public POST that accepts message content from
 * whoever calls it, so anyone could flood the clinic with appointment
 * notifications matching no real row, and the doctor would chase bookings that
 * do not exist. Here the email is composed from data the database just accepted
 * and keyed to the row id it returned, so a notification cannot be forged.
 *
 * ## What this does not change
 *
 * The Supabase client below is the ordinary **publishable/anon** one, not the
 * service-role client used across `app/admin`. Same `security definer`
 * functions, same `grant execute … to anon`, same in-database validation
 * (docs/schema-v3.md). Only the machine placing the call has moved.
 *
 * ## Scope
 *
 * Patient-initiated actions only. Everything staff do — creating, editing,
 * cancelling or deleting appointments, checking patients in, resolving
 * enquiries — lives in `app/admin/actions.ts` and sends no email.
 */

import { after } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { sendAdminEmail } from '@/lib/email/resend';
import {
  appointmentNotificationEmail,
  inquiryNotificationEmail,
} from '@/lib/email/templates';
import {
  appointmentSubmissionSchema,
  inquirySchema,
  HONEYPOT_FIELD,
  type AppointmentSubmission,
  type InquiryFormData,
} from '@/lib/schemas/public-forms';
import { checkRateLimit } from '@/lib/rate-limit';

export type SubmitResult = { ok: true } | { ok: false; message: string };

/** Shown for anything the database did not phrase for a patient itself. */
const GENERIC_ERROR =
  'Something went wrong. Please try again or call us directly.';

/**
 * `submit_appointment` and `submit_inquiry` raise this for rules a patient can
 * act on — slot full, outside OPD hours, date in the past. Those messages are
 * written for patients and are passed through verbatim; every other code is
 * unexpected and gets the generic text, so a raw Postgres error can never reach
 * the browser. Same rule the forms applied before this moved server-side.
 */
const PATIENT_FACING_ERROR = '22023';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Best-effort caller identity for throttling.
 *
 * Behind Vercel `x-forwarded-for` is set; locally it usually is not, so every
 * caller collapses onto the `unknown` bucket. That is fine for a speed bump —
 * and it is what makes the throttle observable in local testing.
 */
async function callerKey(scope: string): Promise<string> {
  const headerList = await headers();

  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip')?.trim() ||
    'unknown';

  return `${scope}:${ip}`;
}

function throttleMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `Too many submissions from this device. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}, or call us directly.`;
}

/**
 * Whether the decoy field was filled.
 *
 * Callers report success without writing anything when this trips, so a bot
 * gets no signal that it was spotted. The field is off-screen, `aria-hidden`
 * and removed from the tab order, so a person cannot reach it.
 */
function isBot(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

// ── Appointments ────────────────────────────────────────────────────────────

/**
 * Books an appointment from the public form and notifies the clinic.
 *
 * The parameter type documents the expected shape for callers; it is not a
 * guarantee. A server action is a public POST endpoint, so the `safeParse`
 * below is what actually decides whether anything is written.
 */
export async function submitAppointment(
  input: AppointmentSubmission,
): Promise<SubmitResult> {
  if (isBot(input?.[HONEYPOT_FIELD])) return { ok: true };

  const limit = checkRateLimit(
    await callerKey('appointment'),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.allowed) {
    return { ok: false, message: throttleMessage(limit.retryAfterSeconds) };
  }

  const parsed = appointmentSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR,
    };
  }

  const { patient_name, phone, email, appointment_date, appointment_time, message } =
    parsed.data;

  const supabase = await createClient();

  const { data: appointmentId, error } = await supabase.rpc('submit_appointment', {
    p_patient_name: patient_name,
    p_phone: phone,
    p_email: email || null,
    p_date: appointment_date,
    p_time: `${appointment_time}:00`,
    p_message: message || null,
  });

  if (error) {
    if (error.code === PATIENT_FACING_ERROR) {
      return { ok: false, message: error.message };
    }

    console.error('[public form] submit_appointment failed', error.code, error.message);
    return { ok: false, message: GENERIC_ERROR };
  }

  // The function returns the new row's id. No id means no row, so there is
  // nothing to announce.
  if (!appointmentId) return { ok: true };

  // Runs once the patient already has their confirmation screen, so a slow or
  // failing Resend call cannot delay the response or turn a booking that was
  // committed into an error the patient sees.
  after(async () => {
    await sendAdminEmail(
      appointmentNotificationEmail({
        patientName: patient_name,
        phone,
        email,
        date: appointment_date,
        time: appointment_time,
        message,
      }),
    );
  });

  return { ok: true };
}

// ── Contact inquiries ───────────────────────────────────────────────────────

/** Records a contact-form enquiry and notifies the clinic. */
export async function submitInquiry(input: InquiryFormData): Promise<SubmitResult> {
  if (isBot(input?.[HONEYPOT_FIELD])) return { ok: true };

  const limit = checkRateLimit(
    await callerKey('inquiry'),
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.allowed) {
    return { ok: false, message: throttleMessage(limit.retryAfterSeconds) };
  }

  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? GENERIC_ERROR,
    };
  }

  const { name, phone, email, message } = parsed.data;

  const supabase = await createClient();

  const { data: inquiryId, error } = await supabase.rpc('submit_inquiry', {
    p_name: name,
    p_phone: phone,
    p_email: email || null,
    p_message: message,
  });

  if (error) {
    if (error.code === PATIENT_FACING_ERROR) {
      return { ok: false, message: error.message };
    }

    console.error('[public form] submit_inquiry failed', error.code, error.message);
    return { ok: false, message: GENERIC_ERROR };
  }

  if (!inquiryId) return { ok: true };

  after(async () => {
    await sendAdminEmail(inquiryNotificationEmail({ name, phone, email, message }));
  });

  return { ok: true };
}
