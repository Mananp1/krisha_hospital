import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { AppointmentTable } from '@/app/admin/components/AppointmentTable';
import { AppointmentSearch } from '@/app/admin/components/AppointmentSearch';
import { NewAppointmentDialog } from '@/app/admin/components/NewAppointmentDialog';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { todayInClinic } from '@/lib/format';
import type { Appointment, AppointmentStatus } from '@/types/database';

export const metadata: Metadata = { title: 'Appointments | Admin' };

const SORT_COL_MAP: Record<string, string> = {
  date: 'appointment_date',
  name: 'patient_name',
  status: 'status',
};

interface PageProps {
  searchParams: Promise<{
    name?: string; phone?: string; date?: string; status?: string; attendance?: string;
    page?: string; pageSize?: string; sortCol?: string; sortDir?: string;
  }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const {
    name, phone, date, status, attendance, page, pageSize, sortCol, sortDir,
  } = await searchParams;

  const pageNum     = parsePage(page);
  const pageSizeNum = parsePageSize(pageSize);
  const col = SORT_COL_MAP[sortCol ?? 'date'] ?? 'appointment_date';
  const asc = sortDir === 'asc';
  const from = (pageNum - 1) * pageSizeNum;
  const to   = from + pageSizeNum - 1;

  const supabase = createAdminClient();
  const today = todayInClinic();

  let query = supabase.from('appointments').select('*', { count: 'exact' });

  if (status && status !== 'all') query = query.eq('status', status as AppointmentStatus);
  if (date)  query = query.eq('appointment_date', date);
  if (name)  query = query.ilike('patient_name', `%${name}%`);
  if (phone) query = query.ilike('phone', `%${phone}%`);

  // Attendance is derived, not stored (docs/schema-v6.md), so each option is
  // expressed as the condition that defines it rather than as a column match.
  // Cancelled bookings are excluded throughout: a visit that was called off is
  // neither attended nor missed.
  if (attendance === 'arrived') {
    query = query.not('checked_in_at', 'is', null).neq('status', 'cancelled');
  } else if (attendance === 'no_show') {
    query = query.is('checked_in_at', null).lt('appointment_date', today).neq('status', 'cancelled');
  } else if (attendance === 'awaiting') {
    query = query.is('checked_in_at', null).eq('appointment_date', today).neq('status', 'cancelled');
  } else if (attendance === 'upcoming') {
    query = query.is('checked_in_at', null).gt('appointment_date', today).neq('status', 'cancelled');
  }

  if (col === 'appointment_date') {
    query = query
      .order('appointment_date', { ascending: asc })
      .order('appointment_time', { ascending: asc });
  } else {
    query = query
      .order(col, { ascending: asc })
      .order('appointment_date', { ascending: false });
  }

  const { data, count } = await query.range(from, to);

  const appointments = (data ?? []) as Appointment[];
  const total = count ?? 0;
  const pending = appointments.filter((a) => a.status === 'pending').length;
  const filtered = Boolean(name || phone || date || status || attendance);

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-base">Appointments</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {total} {filtered ? 'matching' : 'total'} · {pending} pending this page
          </p>
        </div>
        <div className="shrink-0">
          <NewAppointmentDialog />
        </div>
      </div>

      <Suspense>
        <AppointmentSearch />
      </Suspense>

      <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
        <AppointmentTable appointments={appointments} total={total} today={today} />
      </div>
    </div>
  );
}
