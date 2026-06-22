import {
  CalendarIcon,
  ClockIcon,
  MessageSquareIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { StatsCard } from '@/app/admin/components/StatsCard';
import { StatusBadge } from '@/app/admin/components/StatusBadge';

function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[m - 1]} ${y}`;
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalAppointments },
    { count: pendingAppointments },
    { count: totalInquiries },
    { count: unresolvedInquiries },
    { data: recentAppointments },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase.from('appointments').select('id,patient_name,phone,appointment_date,appointment_time,status').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-text-base">Dashboard</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          Overview of appointments and patient inquiries.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatsCard
          title="Total Appointments"
          value={totalAppointments ?? 0}
          icon={<CalendarIcon size={20} strokeWidth={1.8} />}
        />
        <StatsCard
          title="Pending"
          value={pendingAppointments ?? 0}
          icon={<ClockIcon size={20} strokeWidth={1.8} />}
          note="Awaiting confirmation"
        />
        <StatsCard
          title="Total Inquiries"
          value={totalInquiries ?? 0}
          icon={<MessageSquareIcon size={20} strokeWidth={1.8} />}
        />
        <StatsCard
          title="Unresolved"
          value={unresolvedInquiries ?? 0}
          icon={<AlertCircleIcon size={20} strokeWidth={1.8} />}
          note="Requires follow-up"
        />
      </div>

      {/* Recent appointments */}
      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <div className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-base">Recent Appointments</h2>
          <a
            href="/admin/appointments"
            className="text-[12px] font-semibold text-primary hover:opacity-70 transition-opacity"
          >
            View all →
          </a>
        </div>

        {!recentAppointments || recentAppointments.length === 0 ? (
          <p className="text-center text-[13px] text-text-muted py-12">
            No appointments yet.
          </p>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border-muted">
                <th className="text-left px-6 py-3 font-semibold text-text-muted">Patient</th>
                <th className="text-left px-6 py-3 font-semibold text-text-muted">Date &amp; Time</th>
                <th className="text-left px-6 py-3 font-semibold text-text-muted">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appt) => (
                <tr key={appt.id} className="border-b border-border-muted last:border-0">
                  <td className="px-6 py-3 font-medium text-text-base">{appt.patient_name}</td>
                  <td className="px-6 py-3 text-text-muted">
                    {formatDate(appt.appointment_date)} · {formatTime(appt.appointment_time)}
                  </td>
                  <td className="px-6 py-3 text-text-muted">{appt.phone}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={appt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}