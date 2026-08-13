'use client';

import { useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PencilIcon } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { CheckInToggle } from './CheckInToggle';
import { ContactActions } from './ContactActions';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { TablePagination } from './TablePagination';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/format';
import type { Appointment } from '@/types/database';
import { iconButton } from './controls';

type SortCol = 'date' | 'name' | 'status';
type SortDir = 'asc' | 'desc';

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDownIcon size={12} className="text-text-muted shrink-0" />;
  if (dir === 'asc') return <ChevronUpIcon size={12} className="text-primary shrink-0" />;
  return <ChevronDownIcon size={12} className="text-primary shrink-0" />;
}

function SortHead({
  label, col, sortCol, sortDir, onSort, className,
}: {
  label: string; col: SortCol; sortCol: SortCol; sortDir: SortDir;
  onSort: (c: SortCol) => void; className?: string;
}) {
  return (
    <TableHead
      className={cn('cursor-pointer select-none whitespace-nowrap', className)}
      onClick={() => onSort(col)}
    >
      <span className="inline-flex items-center gap-1 hover:text-text-base transition-colors">
        {label}
        <SortIcon active={sortCol === col} dir={sortDir} />
      </span>
    </TableHead>
  );
}

export function AppointmentTable({
  appointments,
  total,
  today,
}: {
  appointments: Appointment[];
  total: number;
  /** Today in the clinic's timezone, from the server — attendance depends on it. */
  today: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Held by id, not by value, so a router.refresh() after an edit flows new
  // props straight into the open dialog instead of leaving it stale.
  const editing = appointments.find((a) => a.id === editingId) ?? null;
  const detail  = appointments.find((a) => a.id === detailId) ?? null;

  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortCol  = (searchParams.get('sortCol') as SortCol)  ?? 'date';
  const sortDir  = (searchParams.get('sortDir') as SortDir)  ?? 'desc';
  const page     = parsePage(searchParams.get('page'));
  const pageSize = parsePageSize(searchParams.get('pageSize'));

  const navigate = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v); else params.delete(k);
      });
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  function handleSort(col: SortCol) {
    navigate({
      sortCol: col,
      sortDir: col === sortCol && sortDir === 'desc' ? 'asc' : 'desc',
      page: '1',
    });
  }

  if (appointments.length === 0 && page === 1) {
    return (
      <div className="text-center py-16 text-text-muted text-[14px]">
        No appointments found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="Date & Time" col="date" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} className="pl-5" />
                <SortHead label="Patient"     col="name" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <TableHead>Phone</TableHead>
                <TableHead>Symptoms</TableHead>
                <SortHead label="Status" col="status" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="whitespace-nowrap">Attendance</TableHead>
                <TableHead className="w-px whitespace-nowrap pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    onClick={() => setDetailId(appt.id)}
                    className="cursor-pointer hover:bg-surface-subtle transition-colors"
                  >
                    <TableCell className="text-[13px] pl-5">
                      <span className="font-medium text-text-base">{formatDate(appt.appointment_date)}</span>
                      <span className="block text-text-muted">{formatTime(appt.appointment_time)}</span>
                    </TableCell>
                    <TableCell className="font-medium text-[13px]">
                      <span className="text-text-base">{appt.patient_name}</span>
                    </TableCell>
                    <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                      {appt.phone}
                    </TableCell>
                    <TableCell className="text-[13px] text-text-muted max-w-[160px]">
                      <span className="block truncate">
                        {appt.message ?? <span className="italic">—</span>}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appt.status} />
                    </TableCell>
                    <TableCell>
                      <CheckInToggle appointment={appt} today={today} />
                    </TableCell>
                    <TableCell className="pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <ContactActions phone={appt.phone} />
                        <button
                          onClick={() => setEditingId(appt.id)}
                          title="Edit appointment"
                          className={iconButton}
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TablePagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => navigate({ page: String(p) })}
        onPageSizeChange={(s) => navigate({ pageSize: String(s), page: '1' })}
      />

      {detail && (
        <AppointmentDetailDialog
          appointment={detail}
          today={today}
          open
          onOpenChange={(v) => { if (!v) setDetailId(null); }}
          // Hands over to the edit dialog below, which is owned here so that
          // closing the detail view cannot take the editor down with it.
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
