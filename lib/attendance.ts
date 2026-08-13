/**
 * Did the patient turn up?
 *
 * Only the positive fact is stored — `appointments.checked_in_at`, set when the
 * desk marks someone as arrived. Every other state is derived here from that
 * column, the appointment date and the booking status.
 *
 * Deriving rather than storing is what makes the day "un-check itself": an
 * appointment that is still unchecked once its date has passed *is* a no-show,
 * so at midnight the whole of the previous day flips over on its own, with no
 * scheduled job to run and nothing that can go stale if the appointment is
 * later edited. See docs/schema-v6.md for the full reasoning.
 */

import type { AppointmentStatus } from '@/types/database';

export type AttendanceState =
  /** Booking was cancelled — attendance does not apply. */
  | 'cancelled'
  /** The desk recorded the patient walking in. */
  | 'arrived'
  /** The day has passed and nobody recorded an arrival. */
  | 'no_show'
  /** Today, still expected. */
  | 'awaiting'
  /** A future appointment. */
  | 'upcoming';

/** The fields attendance is derived from — anything carrying them will do. */
export interface AttendanceSource {
  appointment_date: string;
  status: AppointmentStatus;
  checked_in_at: string | null;
}

/**
 * `today` is passed in rather than read from the clock so that a server render
 * and its hydration cannot disagree across midnight. Callers get it from
 * `todayInClinic()`.
 */
export function attendanceOf(appt: AttendanceSource, today: string): AttendanceState {
  if (appt.status === 'cancelled') return 'cancelled';
  if (appt.checked_in_at) return 'arrived';
  if (appt.appointment_date < today) return 'no_show';
  if (appt.appointment_date === today) return 'awaiting';
  return 'upcoming';
}

/**
 * Whether the desk may record an arrival for this appointment.
 *
 * Past appointments stay checkable — on a busy day arrivals get marked after
 * the fact — but a future one does not, since nobody has walked in yet. The
 * server action enforces the same rule; this only keeps the UI honest.
 */
export function canCheckIn(appt: AttendanceSource, today: string): boolean {
  return appt.status !== 'cancelled' && appt.appointment_date <= today;
}

export const ATTENDANCE_LABELS: Record<AttendanceState, string> = {
  cancelled: 'Cancelled',
  arrived:   'Arrived',
  no_show:   'No-show',
  awaiting:  'Awaiting',
  upcoming:  'Upcoming',
};
