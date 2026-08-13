'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { notifyError } from '@/lib/notify';

interface ConfirmDeleteProps {
  /** The clickable element that opens the confirmation. */
  trigger: React.ReactNode;
  title: string;
  /** What exactly will be removed — deletes here are permanent. */
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onDeleted?: () => void;
}

/**
 * Shared confirmation gate for destructive admin actions. A failure is reported
 * rather than swallowed — these actions throw when the caller is not an admin —
 * and the dialog stays open so the delete can be retried.
 */
export function ConfirmDelete({
  trigger,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  onDeleted,
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await onConfirm();
      } catch (err) {
        notifyError(err, 'Could not delete');
        return;
      }
      setOpen(false);
      onDeleted?.();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[16px]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleConfirm(); }}
            disabled={isPending}
            className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600"
          >
            {isPending ? 'Deleting…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
