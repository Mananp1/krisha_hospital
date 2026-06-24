
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

const MAX_PER_SLOT = 5;

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

const schema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').regex(/^[\d\s\-+]{10,}$/, 'Enter a valid phone number'),
  email: z.union([z.string().email('Enter a valid email address'), z.literal('')]),
  appointment_date: z.date({
    error: (issue) =>
      issue.input === undefined ? 'Please select a date' : 'Invalid date',
  }),
  appointment_time: z.string().min(1, 'Please select a time slot'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors';
const labelClass = 'text-[13px] font-semibold text-text-base';
const errorClass = 'text-[12px] text-destructive';

export default function AppointmentForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [slotState, setSlotState] = useState<{ date: string | null; counts: Record<string, number> }>({ date: null, counts: {} });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedDate = useWatch({ control, name: 'appointment_date' });

  useEffect(() => {
    if (!selectedDate) return;

    let cancelled = false;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'confirmed']);

      if (cancelled) return;

      const counts: Record<string, number> = {};
      data?.forEach(({ appointment_time }) => {
        const slot = (appointment_time as string).slice(0, 5);
        counts[slot] = (counts[slot] ?? 0) + 1;
      });
      setSlotState({ date: dateStr, counts });
    })();

    return () => { cancelled = true; };
  }, [selectedDate]);

  async function onSubmit(data: FormData) {
    setStatus('loading');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.from('appointments').insert({
      patient_name: data.patient_name,
      phone: data.phone,
      email: data.email || null,
      appointment_date: format(data.appointment_date, 'yyyy-MM-dd'),
      appointment_time: data.appointment_time + ':00',
      message: data.message || null,
      status: 'pending',
    });

    if (error) {
      setErrorMsg('Something went wrong. Please try again or call us directly.');
      setStatus('error');
      return;
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-[20px] font-bold text-text-base">Appointment Requested!</h3>
        <p className="text-[14px] text-text-muted max-w-[320px] leading-[23px]">
          Your appointment request has been received. Our team will confirm your slot within 24 hours.
        </p>
        <button
          onClick={() => { reset(); setStatus('idle'); setSlotState({ date: null, counts: {} }); }}
          className="mt-2 text-[13px] font-semibold text-primary hover:opacity-70 transition-opacity"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const bookedCounts = slotState.date === selectedDateStr ? slotState.counts : {};
  const fetchingSlots = !!selectedDate && slotState.date !== selectedDateStr;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="patient_name">
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            id="patient_name"
            type="text"
            placeholder="e.g. Priya Shah"
            {...register('patient_name')}
            className={inputClass}
          />
          {errors.patient_name && (
            <p className={errorClass}>{errors.patient_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="phone">
            Phone Number <span className="text-secondary">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className={inputClass}
          />
          {errors.phone && (
            <p className={errorClass}>{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className={inputClass}
        />
        {errors.email && (
          <p className={errorClass}>{errors.email.message}</p>
        )}
      </div>

      {/* Date + Time grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Date picker */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Preferred Date <span className="text-secondary">*</span>
          </label>
          <div className="border border-border-muted rounded-xl overflow-hidden bg-surface">
            <Controller
              name="appointment_date"
              control={control}
              render={({ field }) => (
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < today || date.getDay() === 0}
                  className="w-full"
                />
              )}
            />
          </div>
          {errors.appointment_date && (
            <p className={errorClass}>{errors.appointment_date.message}</p>
          )}
        </div>

        {/* Time slot grid */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className={labelClass}>
              Preferred Time <span className="text-secondary">*</span>
            </label>
            {fetchingSlots && (
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Checking availability…
              </span>
            )}
          </div>

          {!selectedDate && (
            <p className="text-[12px] text-text-muted py-2">
              Select a date to see available time slots.
            </p>
          )}

          <Controller
            name="appointment_time"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const count = bookedCounts[slot] ?? 0;
                  const isFull = count >= MAX_PER_SLOT;
                  const isSelected = field.value === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isFull}
                      onClick={() => field.onChange(slot)}
                      className={cn(
                        'flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[12px] font-semibold transition-all',
                        isSelected
                          ? 'bg-secondary border-secondary text-text-inverse shadow-sm'
                          : isFull
                            ? 'bg-surface-muted border-border-muted text-text-muted opacity-50 cursor-not-allowed'
                            : 'bg-surface border-border-muted text-text-base hover:border-primary hover:text-primary hover:bg-primary-50 cursor-pointer',
                      )}
                    >
                      {formatTimeDisplay(slot)}
                      {isFull && (
                        <span className="text-[10px] font-normal mt-0.5">Full</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />

          {errors.appointment_time && (
            <p className={errorClass}>{errors.appointment_time.message}</p>
          )}
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            OPD hours: Mon–Sat, 9:00 AM – 7:30 PM. Sundays unavailable.
          </p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="message">
          Symptoms / Reason for Visit (Optional)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Briefly describe your concern, symptoms, or reason for booking."
          {...register('message')}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === 'error' && (
        <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[13px] text-destructive">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </>
        ) : 'Request Appointment'}
      </button>

      <p className="text-[12px] text-text-muted text-center leading-[18px]">
        Our team will confirm your appointment within 24 hours.{' '}
        For urgent care, call{' '}
        <a href="tel:+917862950676" className="text-primary font-semibold">+91 78629 50676</a>.
      </p>
    </form>
  );
}