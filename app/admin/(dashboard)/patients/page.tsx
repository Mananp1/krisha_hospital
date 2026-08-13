import { Suspense } from 'react';
import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { PatientTable } from '@/app/admin/components/PatientTable';
import { PatientSearch } from '@/app/admin/components/PatientSearch';
import type { PatientRow } from '@/app/admin/components/PatientTable';
import { parsePageSize, parsePage } from '@/lib/pagination';
import { todayInClinic } from '@/lib/format';
import { attendanceOf } from '@/lib/attendance';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Patients | Admin' };

type SortCol = 'name' | 'total' | 'last';

interface PageProps {
  searchParams: Promise<{
    name?: string; phone?: string;
    page?: string; pageSize?: string; sortCol?: string; sortDir?: string;
  }>;
}

export default async function PatientsPage({ searchParams }: PageProps) {
  const { name, phone, page, pageSize, sortCol, sortDir } = await searchParams;

  const pageNum     = parsePage(page);
  const pageSizeNum = parsePageSize(pageSize);
  const col = (sortCol ?? 'last') as SortCol;
  const asc = sortDir === 'asc';

  const supabase = createAdminClient();
  const today = todayInClinic();

  // Fetch all appointments to derive unique patients (grouped by phone server-side)
  const { data } = await supabase
    .from('appointments')
    .select('id,patient_name,phone,phone_digits,email,appointment_date,appointment_time,status,message,checked_in_at,checked_in_by,created_at,updated_at,updated_by')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  const appointments = (data ?? []) as Appointment[];

  // Group on phone_digits (generated, punctuation-stripped) so "+91 98765 43210"
  // and "9876543210" resolve to one patient rather than two.
  const map = new Map<string, PatientRow>();
  for (const appt of appointments) {
    const key = appt.phone_digits ?? appt.phone;
    // Attendance is derived, so the visit tallies are counted the same way the
    // badges are rendered — one definition, in lib/attendance.ts.
    const attendance = attendanceOf(appt, today);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        phone: appt.phone,
        phoneDigits: key,
        name: appt.patient_name,
        email: appt.email,
        total: 1,
        pending:   appt.status === 'pending'   ? 1 : 0,
        confirmed: appt.status === 'confirmed' ? 1 : 0,
        cancelled: appt.status === 'cancelled' ? 1 : 0,
        arrived:   attendance === 'arrived' ? 1 : 0,
        noShow:    attendance === 'no_show' ? 1 : 0,
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
      if (attendance === 'arrived')      existing.arrived++;
      else if (attendance === 'no_show') existing.noShow++;
      if (
        appt.appointment_date > existing.lastDate ||
        (appt.appointment_date === existing.lastDate && appt.appointment_time > existing.lastTime)
      ) {
        existing.lastDate = appt.appointment_date;
        existing.lastTime = appt.appointment_time;
      }
    }
  }

  // Filtering happens after grouping, not in the query. A patient's name, visit
  // count and last visit are all derived from the whole group, so filtering the
  // appointments first would build patients out of only their matching rows and
  // report the wrong totals.
  const nameQuery = name?.trim().toLowerCase() ?? '';

  // `phone_digits` holds the last 10 digits, so a typed country code has to come
  // off before it can match — the same two-form trick `search_patients()` uses
  // in docs/schema-v5.md. Without it, "+91 98765" matches nothing at all.
  const digits = phone?.replace(/\D/g, '') ?? '';
  const phoneQueries = digits
    ? [
        digits.length > 10 ? digits.slice(-10) : digits,
        digits.length > 2 && digits.startsWith('91') ? digits.slice(2) : '',
      ].filter(Boolean)
    : [];

  const matching = Array.from(map.values()).filter((p) =>
    (!nameQuery || p.name.toLowerCase().includes(nameQuery)) &&
    (phoneQueries.length === 0 || phoneQueries.some((q) => p.phoneDigits.includes(q))),
  );

  // Sort server-side
  const all = matching.sort((a, b) => {
    let cmp = 0;
    if (col === 'name')  cmp = a.name.localeCompare(b.name);
    if (col === 'total') cmp = a.total - b.total;
    if (col === 'last')  cmp = (`${a.lastDate}${a.lastTime}`).localeCompare(`${b.lastDate}${b.lastTime}`);
    return asc ? cmp : -cmp;
  });

  const total     = all.length;
  const returning = all.filter((p) => p.total > 1).length;
  const filtered  = Boolean(nameQuery || phoneQueries.length);
  const from      = (pageNum - 1) * pageSizeNum;
  const patients  = all.slice(from, from + pageSizeNum);

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Patients</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {total} {filtered ? 'matching' : 'unique'} · {returning} returning
        </p>
      </div>

      <Suspense>
        <PatientSearch />
      </Suspense>

      <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
        <PatientTable patients={patients} total={total} today={today} />
      </div>
    </div>
  );
}
