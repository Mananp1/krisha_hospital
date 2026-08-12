'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
 * Shared confirmation gate for destructive admin actions. Surfaces the server
 * action's error inline instead of failing silently, since these actions throw
 * when the caller is not an admin.
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
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      try {
        await onConfirm();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete');
        return;
      }
      setOpen(false);
      onDeleted?.();
    });
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => { setOpen(v); if (v) setError(''); }}
    >
      <span onClick={() => setOpen(true)}>{trigger}</span>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[16px]">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px]">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
            {error}
          </p>
        )}

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
