import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { PatientTable } from '@/app/admin/components/PatientTable';
import type { PatientRow } from '@/app/admin/components/PatientTable';
import { parsePageSize, parsePage } from '@/lib/pagination';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Patients | Admin' };

type SortCol = 'name' | 'total' | 'last';

interface PageProps {
  searchParams: Promise<{
    page?: string; pageSize?: string; sortCol?: string; sortDir?: string;
  }>;
}

export default async function PatientsPage({ searchParams }: PageProps) {
  const { page, pageSize, sortCol, sortDir } = await searchParams;

  const pageNum     = parsePage(page);
  const pageSizeNum = parsePageSize(pageSize);
  const col = (sortCol ?? 'last') as SortCol;
  const asc = sortDir === 'asc';

  const supabase = createAdminClient();

  // Fetch all appointments to derive unique patients (grouped by phone server-side)
  const { data } = await supabase
    .from('appointments')
    .select('id,patient_name,phone,email,appointment_date,appointment_time,status,message,created_at,updated_at,updated_by')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  const appointments = (data ?? []) as Appointment[];

  // Group by phone to derive unique patients
  const map = new Map<string, PatientRow>();
  for (const appt of appointments) {
    const existing = map.get(appt.phone);
    if (!existing) {
      map.set(appt.phone, {
        phone: appt.phone,
        name: appt.patient_name,
        email: appt.email,
        total: 1,
        pending:   appt.status === 'pending'   ? 1 : 0,
        confirmed: appt.status === 'confirmed' ? 1 : 0,
        cancelled: appt.status === 'cancelled' ? 1 : 0,
        lastDate: appt.appointment_date,
        lastTime: appt.appointment_time,
        appointments: [appt],
      });
    } else {
      existing.total++;
      existing.appointments.push(appt);
      if (appt.status === 'pending')   existing.pending++;
      else if (appt.status === 'confirmed') existing.confirmed++;
      else if (appt.status === 'cancelled') existing.cancelled++;
      if (
        appt.appointment_date > existing.lastDate ||
        (appt.appointment_date === existing.lastDate && appt.appointment_time > existing.lastTime)
      ) {
        existing.lastDate = appt.appointment_date;
        existing.lastTime = appt.appointment_time;
      }
    }
  }

  // Sort server-side
  const all = Array.from(map.values()).sort((a, b) => {
    let cmp = 0;
    if (col === 'name')  cmp = a.name.localeCompare(b.name);
    if (col === 'total') cmp = a.total - b.total;
    if (col === 'last')  cmp = (`${a.lastDate}${a.lastTime}`).localeCompare(`${b.lastDate}${b.lastTime}`);
    return asc ? cmp : -cmp;
  });

  const total     = all.length;
  const returning = all.filter((p) => p.total > 1).length;
  const from      = (pageNum - 1) * pageSizeNum;
  const patients  = all.slice(from, from + pageSizeNum);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Patients</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {total} unique · {returning} returning
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <PatientTable patients={patients} total={total} />
      </div>
    </div>
  );
}
