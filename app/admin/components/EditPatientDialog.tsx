'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { updatePatient } from '@/app/admin/actions';

const schema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter at least 10 digits'),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full px-3 py-2 text-[13px] bg-surface border border-border-muted rounded-xl text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors';

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneDigits: string;
  name: string;
  phone: string;
  /** How many appointments the change will touch, shown as a warning. */
  total: number;
}

/**
 * Edits a patient's name and phone across all of their appointments. Kept as a
 * dialog rather than a screen so it can be opened from a list row.
 */
export function EditPatientDialog({
  open, onOpenChange, phoneDigits, name, phone, total,
}: EditPatientDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { patient_name: name, phone },
  });

  useEffect(() => {
    if (open) reset({ patient_name: name, phone });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(data: FormValues) {
    setError('');
    startTransition(async () => {
      try {
        await updatePatient(phoneDigits, data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save');
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setError(''); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[16px]">Edit Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">
              Patient Name *
            </label>
            <input {...register('patient_name')} className={inputClass} />
            {errors.patient_name && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.patient_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">
              Phone *
            </label>
            <input {...register('phone')} type="tel" className={inputClass} />
            {errors.phone && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.phone.message}</p>
            )}
          </div>

          <p className="px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800 leading-relaxed">
            This updates all {total} appointment{total === 1 ? '' : 's'} for this
            patient. Changing the phone number moves their entire history to the
            new number.
          </p>

          {error && (
            <p className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-[12px] text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
