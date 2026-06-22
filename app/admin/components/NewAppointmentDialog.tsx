'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { createAppointmentByAdmin } from '@/app/admin/actions';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

function formatSlot(slot: string) {
  const [h, m] = slot.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const schema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter at least 10 digits'),
  email: z.union([z.string().email('Invalid email address'), z.literal('')]),
  appointment_date: z.string().min(1, 'Select a date'),
  appointment_time: z.string().min(1, 'Select a time slot'),
  message: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  'w-full px-3 py-2 text-[13px] bg-surface border border-border-muted rounded-xl text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors';

export function NewAppointmentDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patient_name: '',
      phone: '',
      email: '',
      appointment_date: todayStr(),
      appointment_time: '',
      message: '',
      status: 'pending',
    },
  });

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      await createAppointmentByAdmin({
        patient_name: data.patient_name,
        phone: data.phone,
        email: data.email || null,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time + ':00',
        message: data.message || null,
        status: data.status,
      });
      reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-3 bg-surface border border-border-muted rounded-2xl px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group w-full text-left">
          <div className="w-9 h-9 rounded-xl bg-primary-50 group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors">
            <PlusIcon size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-base">New Appointment</p>
            <p className="text-[11px] text-text-muted">Book for a patient</p>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[16px]">New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 flex flex-col gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-1">Patient Name *</label>
            <input {...register('patient_name')} placeholder="Full name" className={inputClass} />
            {errors.patient_name && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.patient_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1">Phone *</label>
              <input {...register('phone')} type="tel" placeholder="Phone number" className={inputClass} />
              {errors.phone && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1">Email</label>
              <input {...register('email')} type="email" placeholder="Optional" className={inputClass} />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1">Date *</label>
              <input
                {...register('appointment_date')}
                type="date"
                className={inputClass}
              />
              {errors.appointment_date && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.appointment_date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-1">Time *</label>
              <Controller
                name="appointment_time"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="text-[13px] w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((slot) => (
                        <SelectItem key={slot} value={slot}>{formatSlot(slot)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.appointment_time && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.appointment_time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-1">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="text-[13px] w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-1">Symptoms / Notes</label>
            <textarea
              {...register('message')}
              rows={3}
              placeholder="Reason for visit, symptoms..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isPending ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}