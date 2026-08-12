
'use client';

import { useState, useEffect } from 'react';
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isToday, setHours, setMinutes, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import {
  OPD_HOURS_LABEL,
  formatTimeDisplay,
  getSlotGroupsForDate,
  isSlotWithinOpdHours,
} from '@/lib/opd-hours';

/**
 * Used until the configured capacity arrives from the database, and if that read
 * fails. The authoritative cap lives in `clinic_settings.max_per_slot` and is
 * re-checked by `submit_appointment`, so a stale value here can only mislead the
 * "Full" badge — it can never let an over-capacity booking through.
 */
const FALLBACK_MAX_PER_SLOT = 5;

function isSlotInPast(slot: string, selectedDate: Date): boolean {
  if (!isToday(selectedDate)) return false;

  const [h, m] = slot.split(':').map(Number);
  const slotDateTime = setMinutes(setHours(startOfDay(selectedDate), h), m);

  return slotDateTime <= new Date();
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
}).superRefine((data, ctx) => {
  if (!data.appointment_time || !data.appointment_date) return;

  if (!isSlotWithinOpdHours(data.appointment_time, data.appointment_date)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Please select a slot within OPD hours',
      path: ['appointment_time'],
    });
    return;
  }

  if (isSlotInPast(data.appointment_time, data.appointment_date)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Please select a future time slot',
      path: ['appointment_time'],
    });
  }
});

type FormData = z.infer<typeof schema>;
type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors';
const labelClass = 'text-[13px] font-semibold text-text-base';
const errorClass = 'text-[12px] text-destructive';

export default function AppointmentForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [slotState, setSlotState] = useState<{ date: string | null; counts: Record<string, number> }>({ date: null, counts: {} });
  const [maxPerSlot, setMaxPerSlot] = useState(FALLBACK_MAX_PER_SLOT);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const selectedDate = useWatch({ control, name: 'appointment_date' });
  const selectedTime = useWatch({ control, name: 'appointment_time' });

  // Capacity is set by the admin, so it is read at runtime rather than baked in
  // at build time. Failure is non-fatal: the fallback only affects the "Full"
  // badge, and submit_appointment enforces the real cap.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clinic_settings')
        .select('max_per_slot')
        .eq('id', true)
        .maybeSingle();

      if (!cancelled && data?.max_per_slot) setMaxPerSlot(data.max_per_slot);
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    // Switching days can strand a slot that no longer exists (e.g. an evening
    // slot carried over to a Sunday) or has since passed.
    if (
      !isSlotWithinOpdHours(selectedTime, selectedDate) ||
      isSlotInPast(selectedTime, selectedDate)
    ) {
      setValue('appointment_time', '');
    }
  }, [selectedDate, selectedTime, setValue]);

  useEffect(() => {
    if (!selectedDate) return;

    let cancelled = false;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    (async () => {
      const supabase = createClient();

      // Aggregate counts only — anon has no read access to appointment rows, so
      // this goes through a security-definer function that exposes no patient data.
      const { data } = await supabase.rpc('get_slot_counts', { target_date: dateStr });

      if (cancelled) return;

      const counts: Record<string, number> = {};
      (data as { slot: string; booked: number }[] | null)?.forEach(({ slot, booked }) => {
        counts[slot.slice(0, 5)] = Number(booked);
      });
      setSlotState({ date: dateStr, counts });
    })();

    return () => { cancelled = true; };
  }, [selectedDate]);

  async function onSubmit(data: FormData) {
    setStatus('loading');
    setErrorMsg('');

    const supabase = createClient();

    // Public writes go through a security-definer function; anon has no direct
    // insert grant. It re-validates the slot and enforces per-slot capacity.
    const { error } = await supabase.rpc('submit_appointment', {
      p_patient_name: data.patient_name,
      p_phone: data.phone,
      p_email: data.email || null,
      p_date: format(data.appointment_date, 'yyyy-MM-dd'),
      p_time: data.appointment_time + ':00',
      p_message: data.message || null,
    });

    if (error) {
      // The function raises 22023 for validation failures it can phrase for a
      // patient; anything else is unexpected and gets the generic fallback.
      setErrorMsg(
        error.code === '22023'
          ? error.message
          : 'Something went wrong. Please try again or call us directly.',
      );
      setStatus('error');
      return;
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center">
          <CheckIcon size={28} />
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

  // Slots depend on the weekday: Mon–Sat run a morning and an evening window,
  // Sunday is morning only.
  const slotGroups = selectedDate ? getSlotGroupsForDate(selectedDate) : [];
  const allSlotsUnavailable =
    !fetchingSlots &&
    slotGroups.every((group) =>
      group.slots.every(
        (slot) =>
          (bookedCounts[slot] ?? 0) >= maxPerSlot ||
          (selectedDate ? isSlotInPast(slot, selectedDate) : false),
      ),
    );

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
                  disabled={(date) => date < today}
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
                <LoaderCircleIcon className="animate-spin h-3 w-3" />
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
              <div className="flex flex-col gap-3">
                {slotGroups.map((group) => (
                  <div key={group.label} className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                      {group.label}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {group.slots.map((slot) => {
                        const count = bookedCounts[slot] ?? 0;
                        const isFull = count >= maxPerSlot;
                        const isPast = selectedDate ? isSlotInPast(slot, selectedDate) : false;
                        const isUnavailable = isFull || isPast;
                        const isSelected = field.value === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isUnavailable}
                            aria-pressed={isSelected}
                            onClick={() => field.onChange(slot)}
                            className={cn(
                              'flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-[12px] font-semibold transition-all',
                              isSelected
                                ? 'bg-secondary border-secondary text-text-inverse shadow-sm'
                                : isUnavailable
                                  ? 'bg-surface-muted border-border-muted text-text-muted opacity-50 cursor-not-allowed'
                                  : 'bg-surface border-border-muted text-text-base hover:border-primary hover:text-primary hover:bg-primary-50 cursor-pointer',
                            )}
                          >
                            {formatTimeDisplay(slot)}
                            {isFull && (
                              <span className="text-[10px] font-normal mt-0.5">Full</span>
                            )}
                            {!isFull && isPast && (
                              <span className="text-[10px] font-normal mt-0.5">Past</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {selectedDate && allSlotsUnavailable && (
                  <p className="text-[12px] text-text-muted py-1">
                    No slots left for this date. Please pick another day.
                  </p>
                )}
              </div>
            )}
          />

          {errors.appointment_time && (
            <p className={errorClass}>{errors.appointment_time.message}</p>
          )}
          <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
            {OPD_HOURS_LABEL}
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
            <LoaderCircleIcon className="animate-spin h-4 w-4" />
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