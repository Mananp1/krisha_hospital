'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { createAppointmentByAdmin, updateAppointment } from '@/app/admin/actions';
import { notifyError } from '@/lib/notify';
import {
  OPD_HOURS_LABEL,
  formatTimeDisplay,
  getSlotsForDateString,
} from '@/lib/opd-hours';
import { PatientPhoneField } from './PatientPhoneField';
import type { Appointment, PatientMatch } from '@/types/database';
import { btnPrimary, inputClass, textareaClass } from './controls';
import { cn } from '@/lib/utils';

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
  override_opd: z.boolean(),
}).superRefine((data, ctx) => {
  if (!data.appointment_date || !data.appointment_time) return;

  // With the override on, any time is allowed — that is the point of it.
  if (data.override_opd) {
    if (!/^\d{2}:\d{2}$/.test(data.appointment_time)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a time as HH:MM',
        path: ['appointment_time'],
      });
    }
    return;
  }

  if (!getSlotsForDateString(data.appointment_date).includes(data.appointment_time)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Slot is outside OPD hours for that day',
      path: ['appointment_time'],
    });
  }
});

type FormValues = z.infer<typeof schema>;

interface NewAppointmentDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultDate?: string;
  defaultTime?: string;
  onCreated?: () => void;
  /** When provided the dialog edits this appointment instead of creating one. */
  appointment?: Appointment | null;
  /** Prefills the patient for a returning-patient booking ("Book again"). */
  defaultPatient?: { patient_name: string; phone: string; email: string | null } | null;
}

/** Blank form values, or the values of the appointment being edited. */
function formValuesFor(
  appointment: Appointment | null | undefined,
  defaultDate: string | undefined,
  defaultTime: string | undefined,
  defaultPatient?: { patient_name: string; phone: string; email: string | null } | null,
): FormValues {
  if (appointment) {
    return {
      patient_name: appointment.patient_name,
      phone: appointment.phone,
      email: appointment.email ?? '',
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time.slice(0, 5),
      message: appointment.message ?? '',
      status: appointment.status,
      override_opd: appointment.override_opd,
    };
  }

  return {
    patient_name: defaultPatient?.patient_name ?? '',
    phone: defaultPatient?.phone ?? '',
    email: defaultPatient?.email ?? '',
    appointment_date: defaultDate ?? todayStr(),
    appointment_time: defaultTime ?? '',
    message: '',
    // An admin booking one in is the confirmation — "pending" only means a
    // request came in through the public form and nobody has acted on it yet.
    status: 'confirmed',
    override_opd: false,
  };
}

export function NewAppointmentDialog({
  open: controlledOpen,
  onOpenChange: onControlledChange,
  defaultDate,
  defaultTime,
  onCreated,
  appointment,
  defaultPatient,
}: NewAppointmentDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = !!appointment;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function setOpen(v: boolean) {
    if (isControlled) {
      onControlledChange?.(v);
    } else {
      setInternalOpen(v);
    }
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formValuesFor(appointment, defaultDate, defaultTime, defaultPatient),
  });

  const selectedDate = useWatch({ control, name: 'appointment_date' });
  const selectedTime = useWatch({ control, name: 'appointment_time' });
  const override     = useWatch({ control, name: 'override_opd' });

  // Slots follow the weekday's OPD windows, so a date change can strand a slot.
  // On a new booking the slots already gone today are dropped too — an admin
  // books forward, and an appointment cannot be made for a time that has passed.
  // Editing keeps every slot, so an existing past appointment stays correctable.
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const slots = getSlotsForDateString(selectedDate);
    if (isEdit || selectedDate !== todayStr()) return slots;

    const now = new Date();
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return slots.filter((s) => {
      const [hh, mm] = s.split(':').map(Number);
      return hh * 60 + mm > minutesNow;
    });
  }, [selectedDate, isEdit]);

  useEffect(() => {
    if (override) return;
    if (selectedTime && !availableSlots.includes(selectedTime)) {
      setValue('appointment_time', '');
    }
  }, [override, selectedTime, availableSlots, setValue]);

  // When the dialog opens (controlled from calendar or an edit button), reset the
  // form to the clicked date/time or to the appointment being edited.
  useEffect(() => {
    if (open) {
      reset(formValuesFor(appointment, defaultDate, defaultTime, defaultPatient));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** Fills name and email when an existing patient is picked from the lookup. */
  function handlePatientSelected(match: PatientMatch) {
    setValue('patient_name', match.patient_name, { shouldValidate: true });
    setValue('email', match.email ?? '', { shouldValidate: true });
  }

  function onSubmit(data: FormValues) {
    const payload = {
      patient_name: data.patient_name,
      phone: data.phone,
      email: data.email || null,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time + ':00',
      message: data.message || null,
      status: data.status,
      // Only sent when it matters: when the emergency flag is being set, or
      // cleared from an appointment that had it. Omitting it otherwise keeps
      // ordinary bookings working before docs/schema-v4.md has been run, since
      // the column does not exist until then.
      ...(data.override_opd || appointment?.override_opd
        ? { override_opd: data.override_opd }
        : {}),
    };

    startTransition(async () => {
      try {
        if (appointment) {
          await updateAppointment(appointment.id, payload);
        } else {
          await createAppointmentByAdmin(payload);
        }
      } catch (err) {
        notifyError(err, 'Something went wrong');
        return;
      }

      reset();
      setOpen(false);
      onCreated?.();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <button className="flex items-center gap-3 bg-surface border border-border-muted rounded-lg px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group w-full text-left">
            <div className="w-9 h-9 rounded-xl bg-primary-50 group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors">
              <PlusIcon size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-base">New Appointment</p>
              <p className="text-[11px] text-text-muted">Book for a patient</p>
            </div>
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[16px]">
            {isEdit ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-1 flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Patient Name *</label>
            <input {...register('patient_name')} placeholder="Full name" className={inputClass} />
            {errors.patient_name && (
              <p className="text-[11px] text-red-500 mt-0.5">{errors.patient_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Phone *</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PatientPhoneField
                    id="phone"
                    value={field.value}
                    onChange={field.onChange}
                    onPatientSelected={handlePatientSelected}
                    // Opened from a patient's record, or editing their
                    // appointment: the patient is already known, so the number
                    // it arrives with is never looked up.
                    identified={appointment?.phone ?? defaultPatient?.phone}
                    className={inputClass}
                  />
                )}
              />
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Date *</label>
              <input
                {...register('appointment_date')}
                type="date"
                min={isEdit ? undefined : todayStr()}
                className={inputClass}
              />
              {errors.appointment_date && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.appointment_date.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Time *</label>
              {override ? (
                <input
                  {...register('appointment_time')}
                  type="time"
                  step={300}
                  className={inputClass}
                />
              ) : (
                <Controller
                  name="appointment_time"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={availableSlots.length === 0}
                    >
                      <SelectTrigger className="text-[13px] w-full">
                        <SelectValue
                          placeholder={
                            availableSlots.length ? 'Select'
                              : !selectedDate ? 'Pick a date'
                                : 'No slots left'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>{formatTimeDisplay(slot)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              )}
              {errors.appointment_time && (
                <p className="text-[11px] text-red-500 mt-0.5">{errors.appointment_time.message}</p>
              )}
            </div>
          </div>

          <label className="flex items-start gap-2.5 -mt-1 px-3 py-2.5 rounded-xl border border-border-muted bg-surface-subtle cursor-pointer">
            <input
              {...register('override_opd')}
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-amber-600 cursor-pointer"
            />
            <span className="text-[12px] leading-relaxed">
              <span className="font-semibold text-text-base">
                Emergency / rescheduled by phone
              </span>
              <span className="block text-text-muted mt-0.5">
                {override
                  ? 'Any time can be entered, including outside OPD hours. Use for times agreed directly with the patient.'
                  : OPD_HOURS_LABEL}
              </span>
            </span>
          </label>

          {/* Status is an edit-time concern only. A booking the clinic enters by
              hand is already confirmed, and cancelling something in the middle of
              creating it is not a real action. */}
          {isEdit && (
            <div>
              <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Status</label>
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
          )}

          <div>
            <label className="block text-[12px] font-semibold text-text-muted mb-0.5">Symptoms / Notes</label>
            <textarea
              {...register('message')}
              rows={2}
              placeholder="Reason for visit, symptoms..."
              className={`${textareaClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(btnPrimary, 'w-full')}
          >
            {isPending
              ? (isEdit ? 'Saving...' : 'Booking...')
              : (isEdit ? 'Save Changes' : 'Book Appointment')}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}