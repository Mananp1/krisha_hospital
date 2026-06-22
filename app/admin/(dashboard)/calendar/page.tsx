import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { StatusBadge } from '@/app/admin/components/StatusBadge';
import type { Appointment } from '@/types/database';

export const metadata: Metadata = { title: 'Schedule | Admin' };

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDayHeading(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
}

export default async function CalendarPage() {
  const supabase = createAdminClient();
  const today = todayStr();

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .gte('appointment_date', today)
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  const appointments = (data ?? []) as Appointment[];

  // Group by date
  const grouped = new Map<string, Appointment[]>();
  for (const appt of appointments) {
    const existing = grouped.get(appt.appointment_date) ?? [];
    existing.push(appt);
    grouped.set(appt.appointment_date, existing);
  }

  const dates = Array.from(grouped.keys()).sort();

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-text-base">Schedule</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          Upcoming appointments · {appointments.length} total
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border-muted py-16 text-center">
          <p className="text-[14px] text-text-muted">No upcoming appointments.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {dates.map((date) => {
            const dayAppointments = grouped.get(date)!;
            return (
              <div key={date} className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
                {/* Date header */}
                <div className="px-6 py-3.5 border-b border-border-muted bg-surface-subtle flex items-center justify-between">
                  <h2 className="text-[14px] font-bold text-text-base">
                    {formatDayHeading(date)}
                  </h2>
                  <span className="text-[12px] font-semibold text-text-muted">
                    {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Appointments for that day */}
                <div className="divide-y divide-border-muted">
                  {dayAppointments.map((appt) => {
                    const digits = cleanPhone(appt.phone);
                    const waNumber = digits.startsWith('91') ? digits : `91${digits}`;
                    const waUrl = `https://wa.me/${waNumber}`;

                    return (
                      <div key={appt.id} className="px-6 py-3.5 flex items-center gap-4">
                        <span className="text-[13px] font-semibold text-primary w-20 shrink-0">
                          {formatTime(appt.appointment_time)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-text-base">{appt.patient_name}</p>
                          {appt.message && (
                            <p className="text-[11px] text-text-muted truncate">{appt.message}</p>
                          )}
                        </div>

                        <span className="text-[13px] text-text-muted hidden sm:block">{appt.phone}</span>

                        <StatusBadge status={appt.status} />

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </a>
                          <a
                            href={`tel:${appt.phone}`}
                            title="Call"
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary hover:bg-primary/10 transition-colors"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.7 10.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.62 0h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.59a16 16 0 006.29 6.29l.96-.96a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}