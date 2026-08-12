'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon, CalendarPlusIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { EditPatientDialog } from './EditPatientDialog';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { Field } from './Field';
import { deletePatient } from '@/app/admin/actions';
import { formatDate, formatTime } from '@/lib/format';
import type { PatientRow } from './PatientTable';

interface PatientDetailDialogProps {
  patient: PatientRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailDialog({
  patient, open, onOpenChange,
}: PatientDetailDialogProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [booking, setBooking] = useState(false);

  const history = [...patient.appointments].sort((a, b) =>
    `${b.appointment_date}${b.appointment_time}`.localeCompare(
      `${a.appointment_date}${a.appointment_time}`),
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[16px]">{patient.name}</DialogTitle>
            <p className="text-[12px] text-text-muted mt-0.5">{patient.phone}</p>
          </DialogHeader>

          <div className="mt-1 flex flex-col gap-4">
            <Field label="Contact">
              {patient.email && (
                <p className="text-[12px] text-text-muted mb-2 break-all">{patient.email}</p>
              )}
              <ContactActions phone={patient.phone} />
            </Field>

            <Field label="Summary">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Total',     value: patient.total,     cls: 'bg-primary-50 text-primary' },
                  { label: 'Confirmed', value: patient.confirmed, cls: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Pending',   value: patient.pending,   cls: 'bg-amber-50 text-amber-700' },
                  { label: 'Cancelled', value: patient.cancelled, cls: 'bg-red-50 text-red-700' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className={`rounded-xl px-2 py-2.5 text-center ${cls}`}>
                    <p className="text-[18px] font-bold leading-none">{value}</p>
                    <p className="text-[10px] font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </Field>

            <Field label="Appointment history">
              <div className="flex flex-col gap-2">
                {history.map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-start justify-between gap-3 bg-surface-subtle border border-border-muted rounded-xl px-3.5 py-3"
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
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </Field>

            <button
              onClick={() => { setBooking(true); onOpenChange(false); }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              <CalendarPlusIcon size={14} />
              Book another appointment
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => { setEditing(true); onOpenChange(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors"
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
                  <button className="flex-1 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-300 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors">
                    <Trash2Icon size={14} />
                    Delete
                  </button>
                }
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <NewAppointmentDialog
        open={booking}
        onOpenChange={setBooking}
        defaultPatient={{
          patient_name: patient.name,
          phone: patient.phone,
          email: patient.email,
        }}
        onCreated={() => { setBooking(false); router.refresh(); }}
      />

      <EditPatientDialog
        open={editing}
        onOpenChange={setEditing}
        phoneDigits={patient.phoneDigits}
        name={patient.name}
        phone={patient.phone}
        total={patient.total}
      />
    </>
  );
}
