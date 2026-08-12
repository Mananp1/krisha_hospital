'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, RotateCcwIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import { ConfirmDelete } from './ConfirmDelete';
import { EditInquiryDialog } from './EditInquiryDialog';
import { resolveInquiry, unresolveInquiry, deleteInquiry } from '@/app/admin/actions';
import { cn } from '@/lib/utils';
import type { ContactInquiry } from '@/types/database';

/** Resolve toggle plus delete for the inquiry detail screen. */
export function InquiryActions({ inquiry }: { inquiry: ContactInquiry }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  function handleToggle() {
    setError('');
    startTransition(async () => {
      try {
        if (inquiry.is_resolved) {
          await unresolveInquiry(inquiry.id);
        } else {
          await resolveInquiry(inquiry.id);
        }
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update');
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[13px] font-semibold transition-colors disabled:opacity-60',
            inquiry.is_resolved
              ? 'border-border-muted text-text-base hover:bg-surface-subtle'
              : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50',
          )}
        >
          {inquiry.is_resolved ? <RotateCcwIcon size={14} /> : <CheckIcon size={14} />}
          {inquiry.is_resolved ? 'Reopen' : 'Mark Resolved'}
        </button>

        <button
          onClick={() => setEditing(true)}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors disabled:opacity-60"
        >
          <PencilIcon size={14} />
          Edit
        </button>

        <ConfirmDelete
          title="Delete this inquiry?"
          description={`The inquiry from ${inquiry.name} will be permanently removed. This cannot be undone.`}
          onConfirm={() => deleteInquiry(inquiry.id)}
          onDeleted={() => router.push('/admin/inquiries')}
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

      <EditInquiryDialog open={editing} onOpenChange={setEditing} inquiry={inquiry} />
    </div>
  );
}
