'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { StatusBadge } from './StatusBadge';
import { TablePagination } from './TablePagination';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import type { Appointment } from '@/types/database';

export interface PatientRow {
  phone: string;
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

function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[m - 1]} ${y}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
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

function PatientDrawer({ patient, onClose }: { patient: PatientRow | null; onClose: () => void }) {
  if (!patient) return null;

  const digits   = cleanPhone(patient.phone);
  const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
  const sorted   = [...patient.appointments].sort((a, b) =>
    (`${b.appointment_date}${b.appointment_time}`).localeCompare(
     `${a.appointment_date}${a.appointment_time}`)
  );

  return (
    <Sheet open={!!patient} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-5 border-b border-border-muted">
          <SheetTitle className="text-[17px] font-bold text-text-base">{patient.name}</SheetTitle>
          <p className="text-[12px] text-text-muted mt-0.5">{patient.phone}</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Contact */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Contact</p>
            <div className="flex gap-2">
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
                href={`tel:${patient.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary text-[12px] font-semibold hover:bg-primary/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                Call
              </a>
            </div>
            {patient.email && <p className="text-[12px] text-text-muted mt-2">{patient.email}</p>}
          </div>

          {/* Stats */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">Summary</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Total',     value: patient.total,     cls: 'bg-primary-50 text-primary' },
                { label: 'Confirmed', value: patient.confirmed, cls: 'bg-emerald-50 text-emerald-700' },
                { label: 'Pending',   value: patient.pending,   cls: 'bg-amber-50 text-amber-700' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={`rounded-xl px-3 py-2.5 text-center ${cls}`}>
                  <p className="text-[18px] font-bold leading-none">{value}</p>
                  <p className="text-[11px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Appointment history */}
          <div>
            <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">
              Appointment History
            </p>
            <div className="flex flex-col gap-2">
              {sorted.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-start justify-between gap-3 bg-surface-subtle border border-border-muted rounded-xl px-3.5 py-3"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-text-base">{formatDate(appt.appointment_date)}</p>
                    <p className="text-[12px] text-text-muted mt-0.5">{formatTime(appt.appointment_time)}</p>
                    {appt.message && (
                      <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed">{appt.message}</p>
                    )}
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function PatientTable({ patients, total }: { patients: PatientRow[]; total: number }) {
  const [selected, setSelected] = useState<PatientRow | null>(null);

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
              {patients.map((patient) => {
                const digits   = cleanPhone(patient.phone);
                const waNumber = digits.startsWith('91') ? digits : `91${digits}`;

                return (
                  <TableRow
                    key={patient.phone}
                    onClick={() => setSelected(patient)}
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
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </a>
                        <a
                          href={`tel:${patient.phone}`}
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
      </div>

      <TablePagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => navigate({ page: String(p) })}
        onPageSizeChange={(s) => navigate({ pageSize: String(s), page: '1' })}
      />

      <PatientDrawer patient={selected} onClose={() => setSelected(null)} />
    </>
  );
}
