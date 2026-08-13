import { Pill, type PillTone } from './Pill';
import type { AppointmentStatus } from '@/types/database';

type BadgeStatus = AppointmentStatus | 'resolved' | 'unresolved';

/**
 * Cancelled is `neutral` rather than red: it is a settled, deliberate outcome
 * with nothing left to do. Red is kept for the states that need chasing — see
 * `AttendanceBadge`, where a no-show earns it.
 */
const tones: Record<BadgeStatus, PillTone> = {
  pending:    'warning',
  confirmed:  'success',
  cancelled:  'neutral',
  resolved:   'success',
  unresolved: 'warning',
};

const labels: Record<BadgeStatus, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  cancelled:  'Cancelled',
  resolved:   'Resolved',
  unresolved: 'Unresolved',
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return <Pill tone={tones[status]}>{labels[status]}</Pill>;
}
