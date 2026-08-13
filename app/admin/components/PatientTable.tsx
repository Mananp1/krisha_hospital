'use client';

import { useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, Trash2Icon, PencilIcon } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { TablePagination } from './TablePagination';
import { ContactActions } from './ContactActions';
import { ConfirmDelete } from './ConfirmDelete';
import { EditPatientDialog } from './EditPatientDialog';
import { PatientDetailDialog } from './PatientDetailDialog';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { Pill } from './Pill';
import { deletePatient } from '@/app/admin/actions';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/format';
import type { Appointment } from '@/types/database';
import { iconButton, iconButtonDanger } from './controls';

export interface PatientRow {
  phone: string;
  /** Grouping key — `phone` stripped to digits. Used for delete matching. */
  phoneDigits: string;
  name: string;
  email: string | null;
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  /** Visits the patient turned up for. */
  arrived: number;
  /** Past appointments they never checked in for — the callback signal. */
  noShow: number;
  lastDate: string;
  lastTime: string;
  appointments: Appointment[];
}

type SortCol = 'name' | 'total' | 'last';
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

export function PatientTable({
  patients, total, today,
}: {
  patients: PatientRow[];
  total: number;
  /** Today in the clinic's timezone, from the server — attendance depends on it. */
  today: string;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const [bookingKey, setBookingKey] = useState<string | null>(null);

  // Held by key so a refresh after an edit re-feeds the open dialog.
  const editing = patients.find((p) => p.phoneDigits === editingKey) ?? null;
  const detail  = patients.find((p) => p.phoneDigits === detailKey) ?? null;
  const booking = patients.find((p) => p.phoneDigits === bookingKey) ?? null;

  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const sortCol  = (searchParams.get('sortCol') as SortCol) ?? 'last';
  const sortDir  = (searchParams.get('sortDir') as SortDir) ?? 'desc';
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

  if (patients.length === 0 && page === 1) {
    return (
      <div className="text-center py-16 text-text-muted text-[14px]">
        No patients found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="Patient"      col="name"  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} className="pl-5" />
                <TableHead>Phone</TableHead>
                <SortHead label="Appointments" col="total" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <SortHead label="Last Visit"   col="last"  sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                <TableHead className="w-px whitespace-nowrap pr-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                  <TableRow
                    key={patient.phoneDigits}
                    onClick={() => setDetailKey(patient.phoneDigits)}
                    className="cursor-pointer hover:bg-surface-subtle transition-colors"
                  >
                    <TableCell className="pl-5">
                      <p className="text-[13px] font-semibold text-text-base">{patient.name}</p>
                      {patient.email && (
                        <p className="text-[11px] text-text-muted mt-0.5">{patient.email}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                      {patient.phone}
                    </TableCell>
                    {/* A separate "Breakdown" column of four counts was more
                        noise than signal — three of them only ever restate the
                        total. The total keeps its column, and the one figure
                        the desk acts on rides along with it. The full split is
                        a click away in the patient's record. */}
                    <TableCell>
                      <span className="text-[13px] font-semibold text-text-base tabular-nums">
                        {patient.total}
                      </span>
                      {patient.noShow > 0 && (
                        <Pill
                          tone="danger"
                          className="ml-2"
                          title={`${patient.noShow} appointment${patient.noShow === 1 ? '' : 's'} missed`}
                        >
                          {patient.noShow} missed
                        </Pill>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                      {formatDate(patient.lastDate)}
                      <span className="block text-[12px]">{formatTime(patient.lastTime)}</span>
                    </TableCell>
                    <TableCell className="pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <ContactActions phone={patient.phone} />
                        <button
                          onClick={() => setEditingKey(patient.phoneDigits)}
                          title="Edit patient"
                          className={iconButton}
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <ConfirmDelete
                          title={`Delete ${patient.name}?`}
                          description={`All ${patient.total} appointment${patient.total === 1 ? '' : 's'} for ${patient.phone} will be permanently removed. Patients are derived from appointments, so this erases their entire record. This cannot be undone.`}
                          confirmLabel="Delete patient"
                          onConfirm={() => deletePatient(patient.phoneDigits)}
                          trigger={
                            <button
                              title="Delete patient"
                              className={iconButtonDanger}
                            >
                              <Trash2Icon className="w-3.5 h-3.5" />
                            </button>
                          }
                        />
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
        <PatientDetailDialog
          patient={detail}
          today={today}
          open
          onOpenChange={(v) => { if (!v) setDetailKey(null); }}
          // The detail dialog closes as the next one opens, so the two never
          // stack. Both are owned here rather than by the detail dialog: it is
          // mounted only while a patient is selected, so anything it rendered
          // would be unmounted by the very close that hands over to it.
          onEdit={() => { setEditingKey(detail.phoneDigits); setDetailKey(null); }}
          onBookAgain={() => { setBookingKey(detail.phoneDigits); setDetailKey(null); }}
        />
      )}

      {editing && (
        <EditPatientDialog
          open
          onOpenChange={(v) => { if (!v) setEditingKey(null); }}
          phoneDigits={editing.phoneDigits}
          name={editing.name}
          phone={editing.phone}
          total={editing.total}
        />
      )}

      {booking && (
        <NewAppointmentDialog
          open
          onOpenChange={(v) => { if (!v) setBookingKey(null); }}
          // Name, phone and email come across so a returning patient's details
          // are not retyped — the whole point of booking from their record.
          defaultPatient={{
            patient_name: booking.name,
            phone: booking.phone,
            email: booking.email,
          }}
          onCreated={() => { setBookingKey(null); router.refresh(); }}
        />
      )}
    </>
  );
}
