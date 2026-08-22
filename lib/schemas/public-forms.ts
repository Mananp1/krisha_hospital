/**
 * Validation for the two public, patient-facing forms.
 *
 * Extracted from the form components so the browser and the server action
 * validate against the same rules. The browser copy is for UX — the server
 * copy is the one that decides whether a write is attempted, since anything
 * arriving at a server action is just an HTTP POST and may never have been
 * near the form.
 *
 * Three layers guard these writes, and each exists for a reason:
 *   1. these schemas          — readable, field-level messages
 *   2. `submit_appointment` /
 *      `submit_inquiry`       — authoritative; owns the clock, slot capacity
 *                               and OPD hours (docs/schema-v3.md)
 *   3. table check constraints — backstop if a function is ever bypassed
 */

import { z } from 'zod';
import { isSlotWithinOpdHours, isSlotInPast, parseLocalDate } from '@/lib/opd-hours';

/**
 * Name of the decoy input rendered off-screen in both forms. Bots that fill
 * every field trip it; people never see it. Kept here so the markup and the
 * server check cannot drift apart.
 */
export const HONEYPOT_FIELD = 'website';

// ── Shared fields ───────────────────────────────────────────────────────────
// Messages are reproduced from the original inline schemas so the wording
// patients see is unchanged.

const nameField = z.string().min(2, 'Name must be at least 2 characters');

const phoneField = z
  .string()
  .min(10, 'Enter a valid phone number')
  .regex(/^[\d\s\-+]{10,}$/, 'Enter a valid phone number');

/** Optional throughout — an empty string is a legitimate "not given". */
const emailField = z.union([
  z.string().email('Enter a valid email address'),
  z.literal(''),
]);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

// ── Appointment ─────────────────────────────────────────────────────────────

/**
 * Browser-side schema. `appointment_date` is a `Date` because it is bound to
 * the shadcn Calendar, and the past-slot rule needs the viewer's clock to grey
 * out slots that have already gone by today.
 */
export const appointmentFormSchema = z
  .object({
    patient_name: nameField,
    phone: phoneField,
    email: emailField,
    appointment_date: z.date({
      error: (issue) =>
        issue.input === undefined ? 'Please select a date' : 'Invalid date',
    }),
    appointment_time: z.string().min(1, 'Please select a time slot'),
    message: z.string().optional(),
    [HONEYPOT_FIELD]: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.appointment_time || !data.appointment_date) return;

    if (!isSlotWithinOpdHours(data.appointment_time, data.appointment_date)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select a slot within OPD hours',
        path: ['appointment_time'],
      });
      return;
    }

    if (isSlotInPast(data.appointment_time, data.appointment_date)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select a future time slot',
        path: ['appointment_time'],
      });
    }
  });

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

/**
 * What actually crosses the wire to the server action — plain strings, since
 * that is all a form POST can carry.
 *
 * Note what is *not* re-checked here: whether the slot has passed. Doing that
 * would mean reading a clock, and a Vercel server runs in UTC, which rolls over
 * at 05:30 IST (see `lib/format.ts`). `submit_appointment` already compares
 * against the database clock and phrases the rejection for a patient, so the
 * temporal call is left to the one layer that can make it correctly.
 */
export const appointmentSubmissionSchema = z
  .object({
    patient_name: nameField,
    phone: phoneField,
    email: emailField,
    appointment_date: z.string().regex(DATE_PATTERN, 'Please select a date'),
    appointment_time: z.string().regex(TIME_PATTERN, 'Please select a time slot'),
    message: z.string().optional(),
    [HONEYPOT_FIELD]: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const date = parseLocalDate(data.appointment_date);

    if (!date) {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid date',
        path: ['appointment_date'],
      });
      return;
    }

    if (!isSlotWithinOpdHours(data.appointment_time, date)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select a slot within OPD hours',
        path: ['appointment_time'],
      });
    }
  });

export type AppointmentSubmission = z.infer<typeof appointmentSubmissionSchema>;

// ── Contact inquiry ─────────────────────────────────────────────────────────

/**
 * One schema for both sides: an inquiry carries no date, so there is nothing
 * clock- or Calendar-dependent to split apart. The honeypot is optional so the
 * same shape validates the form state and the action payload.
 */
export const inquirySchema = z.object({
  name: nameField,
  phone: phoneField,
  email: emailField,
  message: z.string().min(10, 'Message must be at least 10 characters'),
  [HONEYPOT_FIELD]: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
