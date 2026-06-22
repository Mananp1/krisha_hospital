'use client';

import { useState, useTransition } from 'react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { resolveInquiry } from '@/app/admin/actions';
import type { ContactInquiry } from '@/types/database';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getAge(iso: string): { label: string; pillClass: string } {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diffDays === 0) return { label: 'Today',           pillClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (diffDays === 1) return { label: 'Yesterday',       pillClass: 'text-amber-700   bg-amber-50   border-amber-200'   };
  if (diffDays <= 3)  return { label: `${diffDays}d ago`, pillClass: 'text-orange-700  bg-orange-50  border-orange-200'  };
  return               { label: `${diffDays}d ago`, pillClass: 'text-red-700     bg-red-50     border-red-200'    };
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
}

function AgePill({ iso }: { iso: string }) {
  const { label, pillClass } = getAge(iso);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border ${pillClass}`}>
      {label}
    </span>
  );
}

interface ActionButtonsProps {
  inq: ContactInquiry;
  onView: () => void;
  onResolve: () => void;
  isPending: boolean;
}

function ActionButtons({ inq, onView, onResolve, isPending }: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onView}
        className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center bg-primary-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
      >
        View
      </button>
      {!inq.is_resolved && (
        <button
          onClick={onResolve}
          disabled={isPending}
          className="w-[68px] py-1 rounded-lg text-[12px] font-semibold text-center border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          Resolve
        </button>
      )}
    </div>
  );
}

export function InquiryTable({ inquiries }: { inquiries: ContactInquiry[] }) {
  const [isPending, startTransition] = useTransition();
  const [viewing, setViewing] = useState<ContactInquiry | null>(null);

  function handleResolve(id: string) {
    startTransition(async () => {
      await resolveInquiry(id);
      setViewing(null);
    });
  }

  if (inquiries.length === 0) {
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
                  <TableHead className="w-[130px] pl-5">Received</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[130px]">Phone</TableHead>
                  <TableHead className="w-[110px]">Status</TableHead>
                  <TableHead className="w-px pr-5 whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id} className="align-top">
                    <TableCell className="whitespace-nowrap pt-3 pl-5">
                      <AgePill iso={inq.created_at} />
                      <span className="block text-[11px] text-text-muted mt-0.5">
                        {formatDateTime(inq.created_at)}
                      </span>
                    </TableCell>
                    <TableCell className="pt-3">
                      <p className="text-[13px] font-medium text-text-base">{inq.name}</p>
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
                      <ActionButtons
                        inq={inq}
                        onView={() => setViewing(inq)}
                        onResolve={() => handleResolve(inq.id)}
                        isPending={isPending}
                      />
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
        {inquiries.map((inq) => {
          const digits = cleanPhone(inq.phone);
          const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
          return (
            <div key={inq.id} className="px-4 py-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AgePill iso={inq.created_at} />
                  <span className="text-[13px] font-semibold text-text-base">{inq.name}</span>
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

              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => setViewing(inq)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-primary-50 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  View
                </button>
                {!inq.is_resolved && (
                  <button
                    onClick={() => handleResolve(inq.id)}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                  >
                    Resolve
                  </button>
                )}
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Full inquiry dialog ── */}
      <Dialog open={!!viewing} onOpenChange={(open) => { if (!open) setViewing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Inquiry from {viewing?.name}</DialogTitle>
          </DialogHeader>

          {viewing && (
            <div className="mt-1 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Received</p>
                  <AgePill iso={viewing.created_at} />
                  <span className="block text-[12px] text-text-muted mt-0.5">{formatDateTime(viewing.created_at)}</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Status</p>
                  <StatusBadge status={viewing.is_resolved ? 'resolved' : 'unresolved'} />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Phone</p>
                  <a href={`tel:${viewing.phone}`} className="text-primary hover:underline">{viewing.phone}</a>
                </div>
                {viewing.email && (
                  <div>
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Email</p>
                    <span className="text-text-base">{viewing.email}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Message</p>
                <div className="bg-surface-subtle border border-border-muted rounded-xl px-4 py-3 text-[13px] text-text-base leading-relaxed whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                {(() => {
                  const digits = cleanPhone(viewing.phone);
                  const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
                  return (
                    <a
                      href={`https://wa.me/${waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold text-center hover:bg-emerald-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                  );
                })()}
                <a
                  href={`tel:${viewing.phone}`}
                  className="flex-1 py-2 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base text-center hover:bg-surface-subtle transition-colors"
                >
                  Call
                </a>
                {!viewing.is_resolved && (
                  <button
                    onClick={() => handleResolve(viewing.id)}
                    disabled={isPending}
                    className="flex-1 py-2 rounded-xl border border-emerald-600 text-emerald-700 text-[13px] font-semibold hover:bg-emerald-50 transition-colors disabled:opacity-60"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}