import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types/database';

type BadgeStatus = AppointmentStatus | 'resolved' | 'unresolved';

const styles: Record<BadgeStatus, string> = {
  pending:    'bg-amber-50   text-amber-700   border border-amber-200',
  confirmed:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled:  'bg-red-50     text-red-600     border border-red-200',
  resolved:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  unresolved: 'bg-orange-50  text-orange-700  border border-orange-200',
};

const labels: Record<BadgeStatus, string> = {
  pending:    'Pending',
  confirmed:  'Confirmed',
  cancelled:  'Cancelled',
  resolved:   'Resolved',
  unresolved: 'Unresolved',
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}