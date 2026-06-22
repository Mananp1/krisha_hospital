'use client';

import dynamic from 'next/dynamic';
import type { Appointment } from '@/types/database';

const CalendarView = dynamic(
  () => import('./CalendarView'),
  {
    ssr: false,
    loading: () => (
      <div className="py-24 text-center text-[13px] text-text-muted">
        Loading calendar…
      </div>
    ),
  },
);

export function CalendarClientWrapper({ appointments }: { appointments: Appointment[] }) {
  return <CalendarView appointments={appointments} />;
}