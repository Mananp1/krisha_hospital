/**
 * Outbound email for the clinic.
 *
 * Server-only: `RESEND_API_KEY` carries no `NEXT_PUBLIC_` prefix, so importing
 * this from a Client Component is a build error rather than a leaked key.
 *
 * Nothing here throws. A notification is a side effect of a booking, never a
 * precondition for one — if Resend is unreachable the patient's appointment is
 * already committed to the database and they must still see it succeed. Callers
 * get a boolean they are free to ignore.
 */

import { Resend } from 'resend';
import { CONTACT_EMAIL } from '@/lib/site-config';
import type { NotificationEmail } from './templates';

/**
 * Resend's shared test sender. It only delivers to the address the Resend
 * account is registered under, so mail to the clinic will bounce until
 * `krishawomenshospital.com` is verified at https://resend.com/domains and
 * `RESEND_FROM_EMAIL` is pointed at an address on it.
 */
const FALLBACK_FROM = "Krisha Women's Hospital <onboarding@resend.dev>";

/** Treats an unset and a blank env var the same way. */
function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

/**
 * Built per call rather than at module scope: constructing the client eagerly
 * would run at import time, before the caller can decide whether email is even
 * configured, and would make a missing key an error on a route that may never
 * send anything.
 */
function client(): Resend | null {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return null;

  return new Resend(apiKey);
}

/**
 * Sends one notification to the clinic.
 *
 * @returns whether the message was accepted by Resend.
 */
export async function sendAdminEmail(email: NotificationEmail): Promise<boolean> {
  const resend = client();

  if (!resend) {
    console.error('[email] RESEND_API_KEY is not set — notification not sent');
    return false;
  }

  const to = env('ADMIN_NOTIFICATION_EMAIL') ?? CONTACT_EMAIL;

  try {
    const { error } = await resend.emails.send({
      from: env('RESEND_FROM_EMAIL') ?? FALLBACK_FROM,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
    });

    if (error) {
      // Name and message only. The rejection reason is about the transport —
      // sender domain, quota, malformed recipient — and logging the payload
      // would put patient details into the platform log.
      console.error('[email] Resend rejected the message', error.name, error.message);
      return false;
    }

    return true;
  } catch (cause) {
    console.error(
      '[email] send failed',
      cause instanceof Error ? cause.message : 'unknown error',
    );
    return false;
  }
}
