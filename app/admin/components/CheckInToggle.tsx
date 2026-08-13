'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, XIcon, CircleDashedIcon } from 'lucide-react';
import { AttendanceBadge } from './AttendanceBadge';
import { PILL_BASE } from './Pill';
import { setAppointmentCheckIn } from '@/app/admin/actions';
import { attendanceOf, canCheckIn } from '@/lib/attendance';
import { formatTimestampLong } from '@/lib/format';
import { notifyError } from '@/lib/notify';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/types/database';

interface CheckInToggleProps {
  appointment: Appointment;
  /**
   * Today in the clinic's timezone, resolved on the server and passed down, so
   * the server render and its hydration cannot disagree across midnight.
   */
  today: string;
  /** 'full' adds the check-in time and an explanatory line, for dialogs. */
  variant?: 'compact' | 'full';
  className?: string;
}

/**
 * The same chip as `AttendanceBadge`, rendered as a button — it shares `Pill`'s
 * geometry so the Attendance column lines up whether a row shows a control or a
 * plain badge. Only the hover state is added on top.
 *
 * "Mark arrived" is the empty state, so it is drawn as an outline rather than a
 * filled tone: nothing has been recorded yet, and a filled chip would read as a
 * status the appointment already has.
 */
const buttonTones = {
  arrived:  'bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100',
  no_show:  'bg-rose-50    text-rose-700    ring-rose-200    hover:bg-rose-100',
  awaiting: 'bg-transparent text-text-muted ring-border-muted hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200',
} as const;

/**
 * Records whether the patient actually turned up.
 *
 * One control, not two: there is no "mark as no-show" button because a no-show
 * is simply an appointment whose day passed without a check-in. That means the
 * button clears itself overnight — anyone not ticked off by the end of their
 * appointment day reads as a no-show from then on, and can still be ticked off
 * retroactively if the desk got busy.
 */
export function CheckInToggle({
  appointment, today, variant = 'compact', className,
}: CheckInToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const state = attendanceOf(appointment, today);
  const arrived = state === 'arrived';

  // Cancelled bookings and future dates have nothing to record yet, so they
  // show the state without offering a control.
  if (!canCheckIn(appointment, today)) {
    return <AttendanceBadge state={state} className={className} />;
  }

  function handleToggle(event: React.MouseEvent) {
    // Table rows open the detail dialog on click; this button is its own action.
    event.stopPropagation();

    startTransition(async () => {
      try {
        await setAppointmentCheckIn(appointment.id, !arrived);
        router.refresh();
      } catch (err) {
        // Reported as a toast: this button lives in a table cell with no room
        // for a sentence, and an error rendered here reflowed the whole row.
        notifyError(err, 'Could not update attendance');
      }
    });
  }

  const Icon = arrived ? CheckIcon : state === 'no_show' ? XIcon : CircleDashedIcon;
  const label = arrived ? 'Arrived' : state === 'no_show' ? 'No-show' : 'Mark arrived';
  const title = arrived
    ? 'Patient arrived — click to undo'
    : state === 'no_show'
      ? 'Did not attend. Click if they did come after all.'
      : 'Mark this patient as arrived';

  return (
    <div className={cn('inline-flex flex-col items-start gap-1', className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={arrived}
        aria-label={`${label} — ${appointment.patient_name}`}
        title={title}
        className={cn(
          PILL_BASE,
          'transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait',
          buttonTones[arrived ? 'arrived' : state === 'no_show' ? 'no_show' : 'awaiting'],
          // The dialog has room for a proper target; a table cell does not.
          variant === 'full' && 'h-7 px-2.5 text-[12px]',
        )}
      >
        <Icon size={variant === 'full' ? 13 : 11} strokeWidth={2.5} className="shrink-0" />
        {label}
      </button>

      {variant === 'full' && (
        <p className="text-[11px] text-text-muted leading-relaxed">
          {arrived && appointment.checked_in_at
            ? `Checked in ${formatTimestampLong(appointment.checked_in_at)}.`
            : state === 'no_show'
              ? 'The appointment day passed with no check-in, so this counts as a no-show. Worth a call.'
              : 'Tick this when the patient walks in. Left unticked, it becomes a no-show once today is over.'}
        </p>
      )}
    </div>
  );
}
