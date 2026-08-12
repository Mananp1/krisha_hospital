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
import { deletePatient } from '@/app/admin/actions';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import { formatDate, formatTime } from '@/lib/format';
import type { Appointment } from '@/types/database';

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

export function PatientTable({ patients, total }: { patients: PatientRow[]; total: number }) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [detailKey, setDetailKey] = useState<string | null>(null);

  // Held by key so a refresh after an edit re-feeds the open dialog.
  const editing = patients.find((p) => p.phoneDigits === editingKey) ?? null;
  const detail  = patients.find((p) => p.phoneDigits === detailKey) ?? null;

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
                <TableHead>Breakdown</TableHead>
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
                    <TableCell>
                      <span className="text-[13px] font-semibold text-text-base">{patient.total}</span>
                    </TableCell>
                    <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                      {formatDate(patient.lastDate)}
                      <span className="block text-[12px]">{formatTime(patient.lastTime)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {patient.confirmed > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            {patient.confirmed} conf
                          </span>
                        )}
                        {patient.pending > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
                            {patient.pending} pend
                          </span>
                        )}
                        {/* red-600 on red-50 was 4.41:1 at this size, under the 4.5:1 floor; red-700 clears 5.91:1. */}
                        {patient.cancelled > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700">
                            {patient.cancelled} canc
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <ContactActions phone={patient.phone} />
                        <button
                          onClick={() => setEditingKey(patient.phoneDigits)}
                          title="Edit patient"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-subtle text-text-muted border border-border-muted hover:text-primary hover:border-primary/40 transition-colors"
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
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
          open
          onOpenChange={(v) => { if (!v) setDetailKey(null); }}
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
    </>
  );
}
