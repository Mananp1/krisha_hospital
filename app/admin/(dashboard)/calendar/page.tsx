import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { CalendarClientWrapper } from '@/app/admin/components/CalendarClientWrapper';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Schedule | Admin' };

export default async function CalendarPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  const appointments = (data ?? []) as Appointment[];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Schedule</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {appointments.length} total appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-muted p-4 lg:p-6 overflow-hidden">
        <CalendarClientWrapper appointments={appointments} />
      </div>
    </div>
  );
}