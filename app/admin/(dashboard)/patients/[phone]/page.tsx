import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { StatusBadge } from '@/app/admin/components/StatusBadge';
import { ContactActions } from '@/app/admin/components/ContactActions';
import {
  DetailHeader, DetailCard, DetailField,
} from '@/app/admin/components/DetailHeader';
import { PatientActions } from '@/app/admin/components/PatientActions';
import { formatDate, formatTime } from '@/lib/format';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Patient | Admin' };

interface PageProps {
  params: Promise<{ phone: string }>;
}

export default async function PatientDetailPage({ params }: PageProps) {
  const { phone } = await params;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('phone_digits', phone)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  const appointments = (data ?? []) as Appointment[];
  if (appointments.length === 0) notFound();

  // A patient is a group of appointments; the newest row carries the current
  // name and email, since either can change between visits.
  const latest = appointments[0];
  const counts = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <DetailHeader
        backHref="/admin/patients"
        backLabel="Patients"
        title={latest.patient_name}
        subtitle={`${counts.total} appointment${counts.total === 1 ? '' : 's'} · ${latest.phone}`}
        actions={<PatientActions
          name={latest.patient_name}
          phone={latest.phone}
          phoneDigits={phone}
          total={counts.total}
        />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <DetailCard title="Appointment history">
            <div className="flex flex-col gap-2">
              {appointments.map((appt) => (
                <Link
                  key={appt.id}
                  href={`/admin/appointments/${appt.id}`}
                  className="flex items-start justify-between gap-3 bg-surface-subtle border border-border-muted rounded-xl px-4 py-3 hover:border-primary/40 hover:bg-primary-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-text-base">
                      {formatDate(appt.appointment_date)}
                    </p>
                    <p className="text-[12px] text-text-muted mt-0.5">
                      {formatTime(appt.appointment_time)}
                    </p>
                    {appt.message && (
                      <p className="text-[12px] text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                        {appt.message}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={appt.status} />
                </Link>
              ))}
            </div>
          </DetailCard>
        </div>

        <div className="flex flex-col gap-4">
          <DetailCard title="Summary">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total',     value: counts.total,     cls: 'bg-primary-50 text-primary' },
                { label: 'Confirmed', value: counts.confirmed, cls: 'bg-emerald-50 text-emerald-700' },
                { label: 'Pending',   value: counts.pending,   cls: 'bg-amber-50 text-amber-700' },
                { label: 'Cancelled', value: counts.cancelled, cls: 'bg-red-50 text-red-700' },
              ].map(({ label, value, cls }) => (
                <div key={label} className={`rounded-xl px-3 py-2.5 text-center ${cls}`}>
                  <p className="text-[18px] font-bold leading-none">{value}</p>
                  <p className="text-[11px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </DetailCard>

          <DetailCard title="Contact">
            <div className="flex flex-col gap-3">
              <DetailField label="Phone">
                <a href={`tel:${latest.phone}`} className="text-primary hover:underline">
                  {latest.phone}
                </a>
              </DetailField>

              {latest.email && (
                <DetailField label="Email">
                  <span className="break-all">{latest.email}</span>
                </DetailField>
              )}

              <ContactActions phone={latest.phone} size="md" />
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
