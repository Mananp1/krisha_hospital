import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { AppointmentTable } from '@/app/admin/components/AppointmentTable';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Appointments | Admin' };

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  const appointments = (data ?? []) as Appointment[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Appointments</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {appointments.length} total · update status using the dropdown.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <AppointmentTable appointments={appointments} />
      </div>
    </div>
  );
}