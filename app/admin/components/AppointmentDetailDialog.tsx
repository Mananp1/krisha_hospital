'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import { CheckInToggle } from './CheckInToggle';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { Field } from './Field';
import { updateAppointmentStatus, deleteAppointment } from '@/app/admin/actions';
import { notifyError } from '@/lib/notify';
import { formatDate, formatDateLong, formatTime, formatTimestampLong } from '@/lib/format';
import type { Appointment, AppointmentStatus } from '@/types/database';
import { btnDanger, btnOutline } from './controls';
import { cn } from '@/lib/utils';

interface AppointmentDetailDialogProps {
  appointment: Appointment;
  /** Today in the clinic's timezone — attendance is derived against it. */
  today: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Raised to the parent, which owns the edit dialog. This one is mounted only
   * while an appointment is selected, so a dialog rendered here would be
   * unmounted by the same close that opens it.
   */
  onEdit: () => void;
}

export function AppointmentDetailDialog({
  appointment, today, open, onOpenChange, onEdit,
}: AppointmentDetailDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: AppointmentStatus) {
    startTransition(async () => {
      try {
        await updateAppointmentStatus(appointment.id, status);
        router.refresh();
      } catch (err) {
        notifyError(err, 'Could not update status');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[16px]">{appointment.patient_name}</DialogTitle>
          <p className="text-[12px] text-text-muted mt-0.5">
            {formatDateLong(appointment.appointment_date)} · {formatTime(appointment.appointment_time)}
          </p>
        </DialogHeader>

        <div className="mt-1 flex flex-col gap-4">
          <Field label="Contact">
            <p className="text-[13px] text-text-base">{appointment.phone}</p>
            {appointment.email && (
              <p className="text-[12px] text-text-muted mt-0.5 break-all">{appointment.email}</p>
            )}
            <ContactActions phone={appointment.phone} className="mt-2" />
          </Field>

          <Field label="Symptoms / Notes">
            {appointment.message ? (
              <p className="text-[13px] text-text-base leading-relaxed whitespace-pre-wrap bg-surface-subtle border border-border-muted rounded-xl px-3 py-2.5">
                {appointment.message}
              </p>
            ) : (
              <p className="text-[13px] text-text-muted italic">No notes provided</p>
            )}
          </Field>

          <Field label="Status">
            <div className="flex items-center gap-3">
              <StatusBadge status={appointment.status} />
              <Select
                value={appointment.status}
                onValueChange={(v) => handleStatusChange(v as AppointmentStatus)}
                disabled={isPending}
              >
                <SelectTrigger className="w-36 text-[12px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {appointment.override_opd && (
              <p className="text-[11px] text-amber-700 mt-1.5">
                Scheduled outside OPD hours (emergency / phone reschedule).
              </p>
            )}
          </Field>

          <Field label="Attendance">
            <CheckInToggle appointment={appointment} today={today} variant="full" />
          </Field>

          <Field label="Booked on">
            <p className="text-[13px] text-text-base">
              {formatTimestampLong(appointment.created_at)}
            </p>
          </Field>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              disabled={isPending}
              className={cn(btnOutline, 'flex-1')}
            >
              <PencilIcon size={14} />
              Edit
            </button>

            <ConfirmDelete
              title="Delete this appointment?"
              description={`${appointment.patient_name}'s appointment on ${formatDate(appointment.appointment_date)} at ${formatTime(appointment.appointment_time)} will be permanently removed. This cannot be undone.`}
              onConfirm={() => deleteAppointment(appointment.id)}
              onDeleted={() => { onOpenChange(false); router.refresh(); }}
              trigger={
                <button
                  disabled={isPending}
                  className={cn(btnDanger, 'flex-1 w-full')}
                >
                  <Trash2Icon size={14} />
                  Delete
                </button>
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
