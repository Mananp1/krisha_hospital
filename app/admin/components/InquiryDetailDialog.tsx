'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon, RotateCcwIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { EditInquiryDialog } from './EditInquiryDialog';
import { Field } from './Field';
import { resolveInquiry, unresolveInquiry, deleteInquiry } from '@/app/admin/actions';
import { formatTimestampLong } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ContactInquiry } from '@/types/database';

interface InquiryDetailDialogProps {
  inquiry: ContactInquiry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InquiryDetailDialog({
  inquiry, open, onOpenChange,
}: InquiryDetailDialogProps) {
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
    <>
      <Dialog open={open} onOpenChange={(v) => { setError(''); onOpenChange(v); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Inquiry from {inquiry.name}</DialogTitle>
            <p className="text-[12px] text-text-muted mt-0.5">
              Received {formatTimestampLong(inquiry.created_at)}
            </p>
          </DialogHeader>

          <div className="mt-1 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <StatusBadge status={inquiry.is_resolved ? 'resolved' : 'unresolved'} />
              </Field>
              <Field label="Phone">
                <a href={`tel:${inquiry.phone}`} className="text-[13px] text-primary hover:underline">
                  {inquiry.phone}
                </a>
              </Field>
              {inquiry.email && (
                <Field label="Email">
                  <span className="text-[13px] text-text-base break-all">{inquiry.email}</span>
                </Field>
              )}
              {inquiry.resolved_at && (
                <Field label="Resolved">
                  <span className="text-[13px] text-text-base">
                    {formatTimestampLong(inquiry.resolved_at)}
                  </span>
                </Field>
              )}
            </div>

            <Field label="Message">
              <div className="bg-surface-subtle border border-border-muted rounded-xl px-4 py-3 text-[13px] text-text-base leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </div>
            </Field>

            <ContactActions phone={inquiry.phone} size="md" />

            {error && (
              <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleToggle}
                disabled={isPending}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-[13px] font-semibold transition-colors disabled:opacity-60',
                  inquiry.is_resolved
                    ? 'border-border-muted text-text-base hover:bg-surface-subtle'
                    : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50',
                )}
              >
                {inquiry.is_resolved ? <RotateCcwIcon size={14} /> : <CheckIcon size={14} />}
                {inquiry.is_resolved ? 'Reopen' : 'Resolve'}
              </button>

              <button
                onClick={() => { setEditing(true); onOpenChange(false); }}
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base hover:bg-surface-subtle transition-colors disabled:opacity-60"
              >
                <PencilIcon size={14} />
                Edit
              </button>

              <ConfirmDelete
                title="Delete this inquiry?"
                description={`The inquiry from ${inquiry.name} will be permanently removed. This cannot be undone.`}
                onConfirm={() => deleteInquiry(inquiry.id)}
                onDeleted={() => { onOpenChange(false); router.refresh(); }}
                trigger={
                  <button
                    disabled={isPending}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-300 text-[13px] font-semibold text-red-700 hover:bg-red-50 transition-colors disabled:opacity-60"
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

      <EditInquiryDialog open={editing} onOpenChange={setEditing} inquiry={inquiry} />
    </>
  );
}
