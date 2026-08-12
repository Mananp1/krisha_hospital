'use client';

import { useTransition, useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, PencilIcon } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './StatusBadge';
import { ContactActions } from './ContactActions';
import { TablePagination } from './TablePagination';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { ConfirmDelete } from './ConfirmDelete';
import { EditInquiryDialog } from './EditInquiryDialog';
import { InquiryDetailDialog } from './InquiryDetailDialog';
import { resolveInquiry, unresolveInquiry, deleteInquiry } from '@/app/admin/actions';
import { cn } from '@/lib/utils';
import { formatTimestamp } from '@/lib/format';
import type { ContactInquiry } from '@/types/database';

function getAge(iso: string): { label: string; pillClass: string } {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays === 0) return { label: 'Today',            pillClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (diffDays === 1) return { label: 'Yesterday',        pillClass: 'text-amber-700   bg-amber-50   border-amber-200'   };
  if (diffDays <= 3)  return { label: `${diffDays}d ago`, pillClass: 'text-orange-700  bg-orange-50  border-orange-200'  };
  return               { label: `${diffDays}d ago`, pillClass: 'text-red-700     bg-red-50     border-red-200'    };
}

function AgePill({ iso }: { iso: string }) {
  const { label, pillClass } = getAge(iso);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border ${pillClass}`}>
      {label}
    </span>
  );
}

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

export function InquiryTable({
  inquiries,
  total,
}: {
  inquiries: ContactInquiry[];
  total: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  // Held by id so a refresh after resolve/edit re-feeds the open dialog.
  const editing = inquiries.find((i) => i.id === editingId) ?? null;
  const detail  = inquiries.find((i) => i.id === detailId) ?? null;

  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const sortCol  = (searchParams.get('sortCol') as SortCol) ?? 'date';
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

  function handleResolveToggle(inq: ContactInquiry) {
    startTransition(async () => {
      if (inq.is_resolved) {
        await unresolveInquiry(inq.id);
      } else {
        await resolveInquiry(inq.id);
      }
      router.refresh();
    });
  }

  if (inquiries.length === 0 && page === 1) {
    return (
      <div className="text-center py-16 text-text-muted text-[14px]">
        No inquiries found.
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table (sm+) ── */}
      <div className={`hidden sm:block ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="overflow-x-auto">
          <div className="min-w-[580px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortHead label="Received" col="date"   sortCol={sortCol} sortDir={sortDir} onSort={handleSort} className="w-[130px] pl-5" />
                  <SortHead label="Name"     col="name"   sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
                  <TableHead className="w-[130px]">Phone</TableHead>
                  <SortHead label="Status"   col="status" sortCol={sortCol} sortDir={sortDir} onSort={handleSort} className="w-[110px]" />
                  <TableHead className="w-px pr-5 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id} className="align-top">
                    <TableCell className="whitespace-nowrap pt-3 pl-5">
                      <AgePill iso={inq.created_at} />
                      <span className="block text-[11px] text-text-muted mt-0.5">
                        {formatTimestamp(inq.created_at)}
                      </span>
                    </TableCell>
                    <TableCell className="pt-3">
                      <button
                        onClick={() => setDetailId(inq.id)}
                        className="text-[13px] font-medium text-text-base hover:text-primary transition-colors text-left"
                      >
                        {inq.name}
                      </button>
                      <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1 max-w-[240px]">
                        {inq.message}
                      </p>
                    </TableCell>
                    <TableCell className="pt-3">
                      <a
                        href={`tel:${inq.phone}`}
                        className="text-[13px] text-primary hover:underline flex items-center gap-1"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        {inq.phone}
                      </a>
                    </TableCell>
                    <TableCell className="pt-3">
                      <StatusBadge status={inq.is_resolved ? 'resolved' : 'unresolved'} />
                    </TableCell>
                    <TableCell className="pt-3 pr-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailId(inq.id)}
                          className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center bg-primary-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleResolveToggle(inq)}
                          disabled={isPending}
                          className={cn(
                            'w-[78px] py-1 rounded-lg text-[12px] font-semibold text-center border transition-colors disabled:opacity-50',
                            inq.is_resolved
                              ? 'border-border-muted text-text-muted hover:bg-surface-subtle'
                              : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
                          )}
                        >
                          {inq.is_resolved ? 'Reopen' : 'Resolve'}
                        </button>
                        <button
                          onClick={() => setEditingId(inq.id)}
                          className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center border border-border-muted text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setEditingId(inq.id)}
                          className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center border border-border-muted text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          Edit
                        </button>
                        <ConfirmDelete
                          title="Delete this inquiry?"
                          description={`The inquiry from ${inq.name} will be permanently removed. This cannot be undone.`}
                          onConfirm={() => deleteInquiry(inq.id)}
                          trigger={
                            <button
                              disabled={isPending}
                              className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              Delete
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
      </div>

      {/* ── Mobile cards (< sm) ── */}
      <div className={`sm:hidden divide-y divide-border-muted ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
        {inquiries.map((inq) => (
            <div key={inq.id} className="px-4 py-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AgePill iso={inq.created_at} />
                  <button
                    onClick={() => setDetailId(inq.id)}
                    className="text-[13px] font-semibold text-text-base hover:text-primary transition-colors text-left"
                  >
                    {inq.name}
                  </button>
                </div>
                <StatusBadge status={inq.is_resolved ? 'resolved' : 'unresolved'} />
              </div>
              <a href={`tel:${inq.phone}`} className="text-[13px] text-primary flex items-center gap-1.5 self-start">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {inq.phone}
              </a>
              <p className="text-[12px] text-text-muted line-clamp-2">{inq.message}</p>
              <ContactActions phone={inq.phone} className="mt-0.5" />
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => setDetailId(inq.id)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleResolveToggle(inq)}
                  disabled={isPending}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-colors disabled:opacity-50',
                    inq.is_resolved
                      ? 'border-border-muted text-text-muted hover:bg-surface-subtle'
                      : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50',
                  )}
                >
                  {inq.is_resolved ? 'Reopen' : 'Resolve'}
                </button>
                <button
                  onClick={() => setEditingId(inq.id)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-border-muted text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingId(inq.id)}
                  title="Edit inquiry"
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-border-muted text-text-muted hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                </button>
                <ConfirmDelete
                  title="Delete this inquiry?"
                  description={`The inquiry from ${inq.name} will be permanently removed. This cannot be undone.`}
                  onConfirm={() => deleteInquiry(inq.id)}
                  trigger={
                    <button
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  }
                />
              </div>
            </div>
        ))}
      </div>

      <TablePagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={(p) => navigate({ page: String(p) })}
        onPageSizeChange={(s) => navigate({ pageSize: String(s), page: '1' })}
      />

      {detail && (
        <InquiryDetailDialog
          inquiry={detail}
          open
          onOpenChange={(v) => { if (!v) setDetailId(null); }}
        />
      )}

      {editing && (
        <EditInquiryDialog
          open
          onOpenChange={(v) => { if (!v) setEditingId(null); }}
          inquiry={editing}
        />
      )}
    </>
  );
}
