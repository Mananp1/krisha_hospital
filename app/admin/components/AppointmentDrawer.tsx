'use client';

import { useTransition } from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from './StatusBadge';
import { updateAppointmentStatus } from '@/app/admin/actions';
import type { Appointment, AppointmentStatus } from '@/types/database';

function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[m - 1]} ${y}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatReceived(iso: string) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
}

interface AppointmentDrawerProps {
  appointment: Appointment | null;
  onClose: () => void;
}

const fieldLabelClass = 'text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1';
const fieldValueClass = 'text-[13px] text-text-base';

export function AppointmentDrawer({ appointment, onClose }: AppointmentDrawerProps) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: AppointmentStatus) {
    if (!appointment) return;
    startTransition(async () => {
      await updateAppointmentStatus(appointment.id, status);
    });
  }

  const digits = appointment ? cleanPhone(appointment.phone) : '';
  const waNumber = digits.startsWith('91') ? digits : `91${digits}`;

  return (
    <Sheet open={!!appointment} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full sm:w-[400px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-5 border-b border-border-muted">
          <SheetTitle className="text-[17px] font-bold text-text-base">
            {appointment?.patient_name}
          </SheetTitle>
          {appointment && (
            <p className="text-[12px] text-text-muted mt-0.5">
              {formatDate(appointment.appointment_date)} · {formatTime(appointment.appointment_time)}
            </p>
          )}
        </SheetHeader>

        {appointment && (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
            {/* Contact */}
            <div>
              <p className={fieldLabelClass}>Contact</p>
              <p className={fieldValueClass}>{appointment.phone}</p>
              {appointment.email && (
                <p className="text-[12px] text-text-muted mt-0.5">{appointment.email}</p>
              )}
              <div className="flex gap-2 mt-2.5">
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[12px] font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`tel:${appointment.phone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary text-[12px] font-semibold hover:bg-primary/10 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Call
                </a>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <p className={fieldLabelClass}>Symptoms / Notes</p>
              {appointment.message ? (
                <p className="text-[13px] text-text-base leading-relaxed whitespace-pre-wrap bg-surface-subtle border border-border-muted rounded-xl px-3 py-2.5">
                  {appointment.message}
                </p>
              ) : (
                <p className="text-[13px] text-text-muted italic">No notes provided</p>
              )}
            </div>

            {/* Status */}
            <div>
              <p className={fieldLabelClass}>Status</p>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge status={appointment.status} />
                <Select
                  value={appointment.status}
                  onValueChange={(v) => handleStatusChange(v as AppointmentStatus)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-36 text-[12px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Booked on */}
            <div>
              <p className={fieldLabelClass}>Booked on</p>
              <p className={fieldValueClass}>{formatReceived(appointment.created_at)}</p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}