'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { Field } from './Field';
import { updateAppointmentStatus, deleteAppointment } from '@/app/admin/actions';
import { formatDate, formatDateLong, formatTime, formatTimestampLong } from '@/lib/format';
import type { Appointment, AppointmentStatus } from '@/types/database';

interface AppointmentDetailDialogProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentDetailDialog({
  appointment, open, onOpenChange,
}: AppointmentDetailDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  function handleStatusChange(status: AppointmentStatus) {
    setError('');
    startTransition(async () => {
      try {
        await updateAppointmentStatus(appointment.id, status);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update status');
      }
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => { setError(''); onOpenChange(v); }}>
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

            <Field label="Booked on">
              <p className="text-[13px] text-text-base">
                {formatTimestampLong(appointment.created_at)}
              </p>
            </Field>

            {error && (
              <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors disabled:opacity-60"
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
                    className="flex-1 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-300 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-60"
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

      {/* Sibling, not nested — the detail dialog closes so the two never stack. */}
      <NewAppointmentDialog
        appointment={appointment}
        open={editing}
        onOpenChange={(v) => { setEditing(v); if (v) onOpenChange(false); }}
        onCreated={() => { setEditing(false); router.refresh(); }}
      />
    </>
  );
}
