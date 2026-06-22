import Link from 'next/link';
import {
  CalendarIcon,
  CalendarDaysIcon,
  ClockIcon,
  MessageSquareIcon,
  AlertCircleIcon,
  PlusIcon,
  ListIcon,
} from 'lucide-react';
import { createAdminClient } from '@/utils/supabase/admin';
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

function todayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function weekEndStr() {
  const now = new Date();
  now.setDate(now.getDate() + 7);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDayHeader() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

type RecentAppt = {
  id: string;
  patient_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
  type: 'appointment';
};

type RecentInquiry = {
  id: string;
  name: string;
  phone: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
  type: 'inquiry';
};

type ActivityItem = RecentAppt | RecentInquiry;

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const today = todayStr();
  const weekEnd = weekEndStr();

  const [
    { count: todayCount },
    { count: weekCount },
    { count: pendingCount },
    { count: unresolvedCount },
    { data: recentApptsRaw },
    { data: recentInqsRaw },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('appointment_date', today),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .gte('appointment_date', today).lte('appointment_date', weekEnd),
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true })
      .eq('is_resolved', false),
    supabase.from('appointments')
      .select('id,patient_name,phone,appointment_date,appointment_time,status,created_at')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_inquiries')
      .select('id,name,phone,message,is_resolved,created_at')
      .order('created_at', { ascending: false }).limit(5),
  ]);

  const appts: RecentAppt[] = (recentApptsRaw ?? []).map((a) => ({ ...a, type: 'appointment' as const }));
  const inqs: RecentInquiry[] = (recentInqsRaw ?? []).map((i) => ({ ...i, type: 'inquiry' as const }));

  const activity: ActivityItem[] = [...appts, ...inqs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-text-base">Dashboard</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{formatDayHeader()}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Today's Appointments"
          value={todayCount ?? 0}
          icon={<CalendarIcon size={20} strokeWidth={1.8} />}
          note="Scheduled for today"
        />
        <StatsCard
          title="This Week"
          value={weekCount ?? 0}
          icon={<CalendarDaysIcon size={20} strokeWidth={1.8} />}
          note="Next 7 days"
        />
        <StatsCard
          title="Pending Confirmations"
          value={pendingCount ?? 0}
          icon={<ClockIcon size={20} strokeWidth={1.8} />}
          note="Awaiting confirmation"
        />
        <StatsCard
          title="Unresolved Inquiries"
          value={unresolvedCount ?? 0}
          icon={<AlertCircleIcon size={20} strokeWidth={1.8} />}
          note="Requires follow-up"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold text-text-base mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/book-appointment"
            target="_blank"
            className="flex items-center gap-3 bg-surface border border-border-muted rounded-2xl px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-50 group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors">
              <PlusIcon size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-base">New Appointment</p>
              <p className="text-[11px] text-text-muted">Book for a patient</p>
            </div>
          </Link>

          <Link
            href="/admin/appointments"
            className="flex items-center gap-3 bg-surface border border-border-muted rounded-2xl px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-50 group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors">
              <ListIcon size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-base">View Appointments</p>
              <p className="text-[11px] text-text-muted">Manage &amp; update status</p>
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="flex items-center gap-3 bg-surface border border-border-muted rounded-2xl px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-50 group-hover:bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors">
              <MessageSquareIcon size={18} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-base">View Inquiries</p>
              <p className="text-[11px] text-text-muted">Resolve patient messages</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <div className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-text-base">Recent Activity</h2>
          <Link
            href="/admin/appointments"
            className="text-[12px] font-semibold text-primary hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>

        {activity.length === 0 ? (
          <p className="text-center text-[13px] text-text-muted py-12">No activity yet.</p>
        ) : (
          <div className="divide-y divide-border-muted">
            {activity.map((item) => {
              if (item.type === 'appointment') {
                return (
                  <div key={`appt-${item.id}`} className="px-6 py-3.5 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <CalendarIcon size={15} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-base truncate">{item.patient_name}</p>
                      <p className="text-[11px] text-text-muted">
                        {formatDate(item.appointment_date)} · {formatTime(item.appointment_time)} · {item.phone}
                      </p>
                    </div>
                    <StatusBadge status={item.status as 'pending' | 'confirmed' | 'cancelled'} />
                  </div>
                );
              }
              return (
                <div key={`inq-${item.id}`} className="px-6 py-3.5 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <MessageSquareIcon size={15} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text-base truncate">{item.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{item.message}</p>
                  </div>
                  <StatusBadge status={item.is_resolved ? 'resolved' : 'unresolved'} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}