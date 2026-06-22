'use client';

import { useTransition } from 'react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
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

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export function AppointmentTable({ appointments }: { appointments: Appointment[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: AppointmentStatus) {
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
    });
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted text-[14px]">
        No appointments found.
      </div>
    );
  }

  return (
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date &amp; Time</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Symptoms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => {
            const digits = cleanPhone(appt.phone);
            const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
            const waUrl = `https://wa.me/${waNumber}`;

            return (
              <TableRow key={appt.id}>
                <TableCell className="text-[13px]">
                  <span className="font-medium text-text-base">{formatDate(appt.appointment_date)}</span>
                  <span className="block text-text-muted">{formatTime(appt.appointment_time)}</span>
                </TableCell>
                <TableCell className="font-medium text-text-base text-[13px]">
                  {appt.patient_name}
                </TableCell>
                <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                  {appt.phone}
                </TableCell>
                <TableCell className="text-[13px] text-text-muted max-w-[180px]">
                  <span className="block truncate">
                    {appt.message ?? <span className="italic">—</span>}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={appt.status} />
                </TableCell>
                <TableCell>
                  <Select
                    value={appt.status}
                    onValueChange={(val) =>
                      handleStatusChange(appt.id, val as AppointmentStatus)
                    }
                  >
                    <SelectTrigger size="sm" className="w-36 text-[12px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="WhatsApp"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      {/* WhatsApp icon via SVG */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <a
                      href={`tel:${appt.phone}`}
                      title="Call"
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}