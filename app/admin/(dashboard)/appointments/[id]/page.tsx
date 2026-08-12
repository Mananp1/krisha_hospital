import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { StatusBadge } from '@/app/admin/components/StatusBadge';
import { ContactActions } from '@/app/admin/components/ContactActions';
import {
  DetailHeader, DetailCard, DetailField,
} from '@/app/admin/components/DetailHeader';
import { AppointmentActions } from '@/app/admin/components/AppointmentActions';
import { formatDateLong, formatTime, formatTimestampLong } from '@/lib/format';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Appointment | Admin' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AppointmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!data) notFound();
  const appointment = data as Appointment;

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <DetailHeader
        backHref="/admin/appointments"
        backLabel="Appointments"
        title={appointment.patient_name}
        subtitle={`${formatDateLong(appointment.appointment_date)} · ${formatTime(appointment.appointment_time)}`}
        actions={<StatusBadge status={appointment.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <DetailCard title="Symptoms / Notes">
            {appointment.message ? (
              <p className="text-[14px] text-text-base leading-relaxed whitespace-pre-wrap">
                {appointment.message}
              </p>
            ) : (
              <p className="text-[14px] text-text-muted italic">No notes provided</p>
            )}
          </DetailCard>

          <DetailCard title="Manage">
            <AppointmentActions appointment={appointment} />
          </DetailCard>
        </div>

        <div className="flex flex-col gap-4">
          <DetailCard title="Contact">
            <div className="flex flex-col gap-3">
              <DetailField label="Phone">
                <Link
                  href={`/admin/patients/${appointment.phone_digits}`}
                  className="text-primary hover:underline"
                >
                  {appointment.phone}
                </Link>
              </DetailField>

              {appointment.email && (
                <DetailField label="Email">
                  <span className="break-all">{appointment.email}</span>
                </DetailField>
              )}

              <ContactActions phone={appointment.phone} size="md" />

              <Link
                href={`/admin/patients/${appointment.phone_digits}`}
                className="text-[13px] font-semibold text-primary hover:underline"
              >
                View patient history →
              </Link>
            </div>
          </DetailCard>

          <DetailCard title="Record">
            <div className="flex flex-col gap-3">
              <DetailField label="Booked on">
                <span className="text-[13px]">{formatTimestampLong(appointment.created_at)}</span>
              </DetailField>
              <DetailField label="Last updated">
                <span className="text-[13px]">{formatTimestampLong(appointment.updated_at)}</span>
              </DetailField>
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
