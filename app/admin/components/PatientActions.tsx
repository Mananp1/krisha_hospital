'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { ConfirmDelete } from './ConfirmDelete';
import { EditPatientDialog } from './EditPatientDialog';
import { deletePatient } from '@/app/admin/actions';

interface PatientActionsProps {
  name: string;
  phone: string;
  phoneDigits: string;
  total: number;
}

/** Edit + delete for the patient detail screen. */
export function PatientActions({ name, phone, phoneDigits, total }: PatientActionsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors"
      >
        <PencilIcon size={14} />
        Edit patient
      </button>

      <ConfirmDelete
        title={`Delete ${name}?`}
        description={`All ${total} appointment${total === 1 ? '' : 's'} for ${phone} will be permanently removed. Patients are derived from appointments, so this erases their entire record. This cannot be undone.`}
        confirmLabel="Delete patient"
        onConfirm={() => deletePatient(phoneDigits)}
        onDeleted={() => router.push('/admin/patients')}
        trigger={
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors">
            <Trash2Icon size={14} />
            Delete
          </button>
        }
      />

      <EditPatientDialog
        open={editing}
        onOpenChange={setEditing}
        phoneDigits={phoneDigits}
        name={name}
        phone={phone}
        total={total}
      />
    </div>
  );
}
