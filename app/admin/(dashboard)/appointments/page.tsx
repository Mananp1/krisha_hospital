import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { AppointmentTable } from '@/app/admin/components/AppointmentTable';
import { AppointmentSearch } from '@/app/admin/components/AppointmentSearch';
import { NewAppointmentDialog } from '@/app/admin/components/NewAppointmentDialog';
import type { Appointment, AppointmentStatus } from '@/types/database';

export const metadata: Metadata = { title: 'Appointments | Admin' };

interface PageProps {
  searchParams: Promise<{ name?: string; phone?: string; date?: string; status?: string }>;
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const { name, phone, date, status } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status as AppointmentStatus);
  }

  if (date) {
    query = query.eq('appointment_date', date);
  }

  const { data } = await query;
  let appointments = (data ?? []) as Appointment[];

  if (name) {
    const lower = name.toLowerCase();
    appointments = appointments.filter((a) =>
      a.patient_name.toLowerCase().includes(lower),
    );
  }

  if (phone) {
    appointments = appointments.filter((a) => a.phone.includes(phone));
  }

  const pending = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-text-base">Appointments</h1>
          <p className="text-[13px] text-text-muted mt-0.5">
            {appointments.length} {name || phone || date || status ? 'matching' : 'total'} · {pending} pending
          </p>
        </div>
        <div className="shrink-0">
          <NewAppointmentDialog />
        </div>
      </div>

      <Suspense>
        <AppointmentSearch />
      </Suspense>

      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
}