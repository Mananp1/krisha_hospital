'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { SearchIcon, PhoneIcon } from 'lucide-react';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';

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
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <div className="relative flex-1 min-w-[180px]">
        <SearchIcon
          size={15}
          strokeWidth={1.8}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by name..."
          defaultValue={searchParams.get('name') ?? ''}
          onChange={(e) => setParam('name', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] bg-surface border border-border-muted rounded-xl text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="relative flex-1 min-w-[180px]">
        <PhoneIcon
          size={15}
          strokeWidth={1.8}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search by phone..."
          defaultValue={searchParams.get('phone') ?? ''}
          onChange={(e) => setParam('phone', e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] bg-surface border border-border-muted rounded-xl text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <Select
        defaultValue={searchParams.get('status') ?? 'all'}
        onValueChange={(val) => setParam('status', val === 'all' ? '' : val)}
      >
        <SelectTrigger className="w-40 text-[13px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}