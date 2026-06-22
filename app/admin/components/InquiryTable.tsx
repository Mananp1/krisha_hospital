'use client';

import { useTransition } from 'react';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table';
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
    <div className={isPending ? 'opacity-60 pointer-events-none' : ''}>
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
                <span className="block truncate">{inq.message}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={inq.is_resolved ? 'resolved' : 'unresolved'} />
              </TableCell>
              <TableCell>
                {!inq.is_resolved && (
                  <button
                    onClick={() => handleResolve(inq.id)}
                    className="text-[12px] font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}