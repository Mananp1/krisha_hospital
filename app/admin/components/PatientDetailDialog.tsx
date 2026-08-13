'use client';

import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon, CalendarPlusIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { AttendanceBadge } from './AttendanceBadge';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { Field } from './Field';
import { deletePatient } from '@/app/admin/actions';
import { formatDate, formatTime } from '@/lib/format';
import { attendanceOf } from '@/lib/attendance';
import type { PatientRow } from './PatientTable';
import { btnDanger, btnOutline, btnPrimary } from './controls';
import { cn } from '@/lib/utils';

interface PatientDetailDialogProps {
  patient: PatientRow;
  /** Today in the clinic's timezone — attendance is derived against it. */
  today: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Hand-offs to the next dialog. They are raised to the parent rather than
   * owned here because this component is mounted conditionally on the selected
   * patient: closing it to make way for the next dialog also unmounts anything
   * it renders, so a dialog owned here would be destroyed in the same render it
   * was opened in — which is exactly what stopped "Book another appointment"
   * from ever appearing.
   */
  onEdit: () => void;
  onBookAgain: () => void;
}

export function PatientDetailDialog({
  patient, today, open, onOpenChange, onEdit, onBookAgain,
}: PatientDetailDialogProps) {
  const router = useRouter();

  const history = [...patient.appointments].sort((a, b) =>
    `${b.appointment_date}${b.appointment_time}`.localeCompare(
      `${a.appointment_date}${a.appointment_time}`),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Only the history scrolls. Scrolling the whole dialog pushed the header
          and the actions off-screen for a patient with a long history, so who
          you were looking at and what you could do about it both disappeared as
          soon as you started reading. The column below pins both and gives the
          leftover height to the list. */}
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col gap-4">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-[16px]">{patient.name}</DialogTitle>
          <p className="text-[12px] text-text-muted mt-0.5">{patient.phone}</p>
        </DialogHeader>

        <div className="flex flex-col gap-4 min-h-0 flex-1">
          <Field label="Contact" className="shrink-0">
            {patient.email && (
              <p className="text-[12px] text-text-muted mb-2 break-all">{patient.email}</p>
            )}
            <ContactActions phone={patient.phone} />
          </Field>

          <Field label="Summary" className="shrink-0">
            {/* Six boxes of numbers was six things to read before getting to
                the history. Three figures answer what the desk actually asks —
                how many visits, how many kept, how many missed — and the
                booking split, which only ever adds up to the total, drops to a
                caption underneath. */}
            <div className="rounded-lg bg-surface-subtle ring-1 ring-inset ring-border-muted">
              <div className="grid grid-cols-3 divide-x divide-border-muted">
                {[
                  { label: 'Appointments', value: patient.total,   cls: 'text-text-base' },
                  { label: 'Attended',     value: patient.arrived, cls: 'text-emerald-700' },
                  { label: 'Missed',       value: patient.noShow,
                    cls: patient.noShow > 0 ? 'text-rose-700' : 'text-text-muted' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="px-2 py-3 text-center">
                    <p className={`text-[20px] font-bold leading-none tabular-nums ${cls}`}>{value}</p>
                    <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mt-1.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <p className="border-t border-border-muted px-3 py-2 text-[11px] text-text-muted text-center tabular-nums">
                {patient.confirmed} confirmed · {patient.pending} pending · {patient.cancelled} cancelled
              </p>
            </div>
          </Field>

          {/* min-h-0 is what lets this shrink below its content height; without
              it the list would stretch the dialog instead of scrolling. */}
          <Field label="Appointment history" className="flex flex-col min-h-0 flex-1">
            <div className="flex flex-col gap-2 overflow-y-auto min-h-0 pr-1 -mr-1">
              {history.map((appt) => {
                const attendance = attendanceOf(appt, today);
                return (
                <div
                  key={appt.id}
                  className="flex items-start justify-between gap-3 bg-surface-subtle ring-1 ring-inset ring-border-muted rounded-lg px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-text-base">
                      {formatDate(appt.appointment_date)}
                    </p>
                    <p className="text-[12px] text-text-muted mt-0.5">
                      {formatTime(appt.appointment_time)}
                    </p>
                    {appt.message && (
                      <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed">
                        {appt.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={appt.status} />
                    {/* "Confirmed · Upcoming" says the same thing twice, so
                        attendance only appears once it is worth reporting. */}
                    {attendance !== 'upcoming' && <AttendanceBadge state={attendance} />}
                  </div>
                </div>
                );
              })}
            </div>
          </Field>

          <button
            onClick={onBookAgain}
            className={cn(btnPrimary, 'shrink-0 w-full')}
          >
            <CalendarPlusIcon size={14} />
            Book another appointment
          </button>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onEdit}
              className={cn(btnOutline, 'flex-1')}
            >
              <PencilIcon size={14} />
              Edit patient
            </button>

            <ConfirmDelete
              title={`Delete ${patient.name}?`}
              description={`All ${patient.total} appointment${patient.total === 1 ? '' : 's'} for ${patient.phone} will be permanently removed. Patients are derived from appointments, so this erases their entire record. This cannot be undone.`}
              confirmLabel="Delete patient"
              onConfirm={() => deletePatient(patient.phoneDigits)}
              onDeleted={() => { onOpenChange(false); router.refresh(); }}
              trigger={
                <button className={cn(btnDanger, 'flex-1 w-full')}>
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
