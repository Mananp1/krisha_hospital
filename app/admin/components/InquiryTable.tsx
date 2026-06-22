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

export function InquiryTable({ inquiries }: { inquiries: ContactInquiry[] }) {
  const [isPending, startTransition] = useTransition();
  const [viewing, setViewing] = useState<ContactInquiry | null>(null);

  function handleResolve(id: string) {
    startTransition(async () => {
      await resolveInquiry(id);
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
      <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
        <div className="overflow-x-auto">
        <div className="min-w-[700px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="text-[13px] text-text-muted whitespace-nowrap">
                  {formatDateTime(inq.created_at)}
                </TableCell>
                <TableCell className="font-medium text-text-base text-[13px]">
                  {inq.name}
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${inq.phone}`}
                    className="text-[13px] text-primary hover:underline"
                  >
                    {inq.phone}
                  </a>
                </TableCell>
                <TableCell className="text-[13px] text-text-muted">
                  {inq.email ?? <span className="italic">—</span>}
                </TableCell>
                <TableCell className="text-[13px] text-text-muted max-w-[220px]">
                  <button
                    onClick={() => setViewing(inq)}
                    className="block truncate text-left hover:text-primary transition-colors underline-offset-2 hover:underline"
                  >
                    {inq.message}
                  </button>
                </TableCell>
                <TableCell>
                  <StatusBadge status={inq.is_resolved ? 'resolved' : 'unresolved'} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewing(inq)}
                      className="text-[12px] font-semibold text-primary hover:opacity-70 transition-opacity"
                    >
                      View
                    </button>
                    {!inq.is_resolved && (
                      <button
                        onClick={() => handleResolve(inq.id)}
                        className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        </div>
      </div>

      {/* Full inquiry dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => { if (!open) setViewing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px]">Inquiry from {viewing?.name}</DialogTitle>
          </DialogHeader>

          {viewing && (
            <div className="mt-1 flex flex-col gap-4">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-[13px]">
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
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Received</p>
                  <span className="text-text-base">{formatDateTime(viewing.created_at)}</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">Status</p>
                  <StatusBadge status={viewing.is_resolved ? 'resolved' : 'unresolved'} />
                </div>
              </div>

              {/* Full message */}
              <div>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">Message</p>
                <div className="bg-surface-subtle border border-border-muted rounded-xl px-4 py-3 text-[13px] text-text-base leading-relaxed whitespace-pre-wrap">
                  {viewing.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${viewing.phone}`}
                  className="flex-1 py-2 rounded-xl border border-border-muted text-[13px] font-semibold text-text-base text-center hover:bg-surface-subtle transition-colors"
                >
                  Call Patient
                </a>
                {!viewing.is_resolved && (
                  <button
                    onClick={() => {
                      handleResolve(viewing.id);
                      setViewing(null);
                    }}
                    disabled={isPending}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
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