'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { updateInquiry } from '@/app/admin/actions';
import { notifyError } from '@/lib/notify';
import type { ContactInquiry } from '@/types/database';
import { btnPrimary, inputClass } from './controls';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter at least 10 digits'),
  email: z.union([z.string().email('Invalid email address'), z.literal('')]),
  message: z.string().min(1, 'Message cannot be empty'),
});

type FormValues = z.infer<typeof schema>;

interface EditInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiry: ContactInquiry;
}

/** Corrects details taken down over the phone — misheard name, mistyped number. */
export function EditInquiryDialog({ open, onOpenChange, inquiry }: EditInquiryDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const values: FormValues = {
    name: inquiry.name,
    phone: inquiry.phone,
    email: inquiry.email ?? '',
    message: inquiry.message,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: values });

  useEffect(() => {
    if (open) reset(values);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      try {
        await updateInquiry(inquiry.id, { ...data, email: data.email || null });
      } catch (err) {
        notifyError(err, 'Could not save');
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[16px]">Edit Inquiry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Name *</label>
            <input {...register('name')} className={inputClass} />
            {errors.name && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Phone *</label>
              <input {...register('phone')} type="tel" className={inputClass} />
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Email</label>
              <input {...register('email')} type="email" placeholder="Optional" className={inputClass} />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Message *</label>
            <textarea {...register('message')} rows={4} className={`${inputClass} resize-none`} />
            {errors.message && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(btnPrimary, 'w-full')}
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
