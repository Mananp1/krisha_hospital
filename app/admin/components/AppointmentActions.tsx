'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ConfirmDelete } from './ConfirmDelete';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { updateAppointmentStatus, deleteAppointment } from '@/app/admin/actions';
import { formatDate, formatTime } from '@/lib/format';
import type { Appointment, AppointmentStatus } from '@/types/database';

/** Status control plus edit/delete for the appointment detail screen. */
export function AppointmentActions({ appointment }: { appointment: Appointment }) {
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={appointment.status}
          onValueChange={(v) => handleStatusChange(v as AppointmentStatus)}
          disabled={isPending}
        >
          <SelectTrigger className="w-36 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => setEditing(true)}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors disabled:opacity-60"
        >
          <PencilIcon size={14} />
          Edit
        </button>

        <ConfirmDelete
          title="Delete this appointment?"
          description={`${appointment.patient_name}'s appointment on ${formatDate(appointment.appointment_date)} at ${formatTime(appointment.appointment_time)} will be permanently removed. This cannot be undone.`}
          onConfirm={() => deleteAppointment(appointment.id)}
          onDeleted={() => router.push('/admin/appointments')}
          trigger={
            <button
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              <Trash2Icon size={14} />
              Delete
            </button>
          }
        />
      </div>

      {error && (
        <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
          {error}
        </p>
      )}

      <NewAppointmentDialog
        appointment={appointment}
        open={editing}
        onOpenChange={setEditing}
        onCreated={() => { setEditing(false); router.refresh(); }}
      />
    </div>
  );
}
