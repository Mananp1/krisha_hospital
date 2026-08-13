'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { CheckInToggle } from './CheckInToggle';
import { ContactActions } from './ContactActions';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { TablePagination } from './TablePagination';
import { formatTime } from '@/lib/format';
import type { Appointment } from '@/types/database';

const PAGE_SIZE = 10;

interface TodayPatientsTableProps {
  /** Today's appointments, already ordered by time slot. */
  appointments: Appointment[];
  /** Today in the clinic's timezone — attendance is derived against it. */
  today: string;
}

/**
 * Who is coming in today, in slot order — the list the front desk works from.
 *
 * It carries the check-in control rather than only linking to the appointments
 * page, because marking arrivals is the thing this list exists for: the desk
 * can work the whole morning from the dashboard without navigating away.
 *
 * Paging is local state rather than URL parameters, unlike the full list views.
 * A single day is a bounded, small set, so it is fetched whole and sliced here —
 * which keeps paging instant and leaves the dashboard's query string free for
 * the slot panel's `slotDate`.
 */
export function TodayPatientsTable({ appointments, today }: TodayPatientsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Held by id, not by value, so a refresh after a check-in feeds new props
  // straight into the open dialog instead of leaving it stale.
  const detail  = appointments.find((a) => a.id === detailId) ?? null;
  const editing = appointments.find((a) => a.id === editingId) ?? null;

  const total = appointments.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // A check-in never changes the row count, but a delete does — clamp so the
  // last page cannot strand the reader on an empty slice.
  const safePage = Math.min(page, totalPages);
  const from = (safePage - 1) * pageSize;
  const visible = appointments.slice(from, from + pageSize);

  if (total === 0) {
    return (
      <p className="text-center text-[13px] text-text-muted py-10">
        Nobody is booked in today.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5 w-[92px]">Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="whitespace-nowrap">Attendance</TableHead>
                <TableHead className="w-px whitespace-nowrap pr-5">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((appt) => (
                <TableRow
                  key={appt.id}
                  onClick={() => setDetailId(appt.id)}
                  className="cursor-pointer hover:bg-surface-subtle transition-colors"
                >
                  <TableCell className="pl-5 text-[13px] font-semibold text-text-base tabular-nums whitespace-nowrap">
                    {formatTime(appt.appointment_time)}
                  </TableCell>
                  <TableCell className="text-[13px] font-medium text-text-base">
                    {appt.patient_name}
                  </TableCell>
                  <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                    {appt.phone}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={appt.status} />
                  </TableCell>
                  <TableCell>
                    <CheckInToggle appointment={appt} today={today} />
                  </TableCell>
                  <TableCell className="pr-5" onClick={(e) => e.stopPropagation()}>
                    <ContactActions phone={appt.phone} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TablePagination
        total={total}
        page={safePage}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
      />

      {detail && (
        <AppointmentDetailDialog
          appointment={detail}
          today={today}
          open
          onOpenChange={(v) => { if (!v) setDetailId(null); }}
          onEdit={() => { setEditingId(detail.id); setDetailId(null); }}
        />
      )}

      {editing && (
        <NewAppointmentDialog
          appointment={editing}
          open
          onOpenChange={(v) => { if (!v) setEditingId(null); }}
          onCreated={() => { setEditingId(null); router.refresh(); }}
        />
      )}
    </>
  );
}
