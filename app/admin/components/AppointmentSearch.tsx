'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { SearchIcon, PhoneIcon } from 'lucide-react';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { inputClass } from './controls';

export function AppointmentSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page'); // reset to page 1 on any filter change
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <div className="relative flex-1 min-w-[160px]">
        <SearchIcon size={15} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name..."
          defaultValue={searchParams.get('name') ?? ''}
          onChange={(e) => setParam('name', e.target.value)}
          className={cn(inputClass, 'pl-9 pr-3')}
        />
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <PhoneIcon size={15} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search by phone..."
          defaultValue={searchParams.get('phone') ?? ''}
          onChange={(e) => setParam('phone', e.target.value)}
          className={cn(inputClass, 'pl-9 pr-3')}
        />
      </div>

      <input
        type="date"
        defaultValue={searchParams.get('date') ?? ''}
        onChange={(e) => setParam('date', e.target.value)}
        className={cn(inputClass, 'flex-1 min-w-[140px]')}
        title="Filter by date"
      />

      <Select
        defaultValue={searchParams.get('status') ?? 'all'}
        onValueChange={(val) => setParam('status', val === 'all' ? '' : val)}
      >
        <SelectTrigger className="w-36 text-[13px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Attendance is a separate axis from status: a confirmed patient can
          still fail to turn up, so these two filters combine rather than
          replace each other. "No-show" is the one the desk calls back. */}
      <Select
        defaultValue={searchParams.get('attendance') ?? 'all'}
        onValueChange={(val) => setParam('attendance', val === 'all' ? '' : val)}
      >
        <SelectTrigger className="w-40 text-[13px]">
          <SelectValue placeholder="All attendance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All attendance</SelectItem>
          <SelectItem value="arrived">Arrived</SelectItem>
          <SelectItem value="no_show">No-show</SelectItem>
          <SelectItem value="awaiting">Awaiting today</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}