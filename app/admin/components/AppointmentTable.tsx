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
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell className="text-[13px]">
                <span className="font-medium text-text-base">{formatDate(appt.appointment_date)}</span>
                <span className="block text-text-muted">{formatTime(appt.appointment_time)}</span>
              </TableCell>
              <TableCell className="font-medium text-text-base text-[13px]">
                {appt.patient_name}
              </TableCell>
              <TableCell>
                <a
                  href={`tel:${appt.phone}`}
                  className="text-[13px] text-primary hover:underline"
                >
                  {appt.phone}
                </a>
              </TableCell>
              <TableCell className="text-[13px] text-text-muted max-w-[200px]">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}