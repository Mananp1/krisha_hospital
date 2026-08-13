import { CheckIcon, XIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import { Pill, type PillTone } from './Pill';
import { ATTENDANCE_LABELS, type AttendanceState } from '@/lib/attendance';

/**
 * Whether the patient turned up. Sits alongside `StatusBadge`, which answers a
 * different question — that one is about the booking, this one about the visit.
 *
 * Each state carries an icon as well as a tone, so the two stay tellable apart
 * where they appear side by side.
 */
type ShownState = Exclude<AttendanceState, 'cancelled'>;

const tones: Record<ShownState, PillTone> = {
  arrived:  'success',
  no_show:  'danger',
  awaiting: 'info',
  upcoming: 'neutral',
};

const icons: Record<ShownState, typeof CheckIcon> = {
  arrived:  CheckIcon,
  no_show:  XIcon,
  awaiting: ClockIcon,
  upcoming: CalendarIcon,
};

export function AttendanceBadge({
  state,
  className,
}: {
  state: AttendanceState;
  className?: string;
}) {
  // A cancelled booking has no attendance to report, and StatusBadge already
  // says so — a second chip repeating it would only add noise.
  if (state === 'cancelled') return null;

  const Icon = icons[state];

  return (
    <Pill tone={tones[state]} className={className}>
      <Icon size={11} strokeWidth={2.5} className="shrink-0" />
      {ATTENDANCE_LABELS[state]}
    </Pill>
  );
}
