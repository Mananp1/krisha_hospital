import Link from 'next/link';
import {
  CalendarIcon,
  CalendarDaysIcon,
  ClockIcon,
  MessageSquareIcon,
  AlertCircleIcon,
  ListIcon,
  AlertTriangleIcon,
} from 'lucide-react';
import { createAdminClient } from '@/utils/supabase/admin';
import { StatsCard } from '@/app/admin/components/StatsCard';
import { StatusBadge } from '@/app/admin/components/StatusBadge';
import { AttendanceBadge } from '@/app/admin/components/AttendanceBadge';
import { attendanceOf } from '@/lib/attendance';
import { NewAppointmentDialog } from '@/app/admin/components/NewAppointmentDialog';
import { SlotAvailability } from '@/app/admin/components/SlotAvailability';
import { getSlotGroupsForDate, parseLocalDate } from '@/lib/opd-hours';
import { formatDate, formatTime, todayInClinic, addDays, CLINIC_TIME_ZONE } from '@/lib/format';
import type { ClinicSettings, AppointmentStatus } from '@/types/database';

const FALLBACK_CAPACITY = 5;

/** How far back the no-show callback list reaches. */
const NO_SHOW_WINDOW_DAYS = 7;

function formatDayHeader() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: CLINIC_TIME_ZONE,
  });
}

type RecentAppt = {
  id: string; patient_name: string; phone: string;
  appointment_date: string; appointment_time: string;
  status: AppointmentStatus; checked_in_at: string | null;
  created_at: string; type: 'appointment';
};
type RecentInquiry = {
  id: string; name: string; phone: string; message: string;
  is_resolved: boolean; created_at: string; type: 'inquiry';
};
type ActivityItem = RecentAppt | RecentInquiry;

interface PageProps {
  searchParams: Promise<{ slotDate?: string }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { slotDate } = await searchParams;

  const supabase = createAdminClient();
  const today = todayInClinic();
  const weekEnd = addDays(today, 7);
  const noShowFrom = addDays(today, -NO_SHOW_WINDOW_DAYS);

  // The slot panel books forward only, so today is the floor. Bad input and any
  // past date (a hand-edited URL) both fall back to today.
  const panelDate =
    slotDate && parseLocalDate(slotDate) && slotDate >= today ? slotDate : today;

  const [
    { count: todayCount },
    { count: arrivedTodayCount },
    { count: weekCount },
    { count: pendingCount },
    { count: noShowCount },
    { count: unresolvedCount },
    { data: recentApptsRaw },
    { data: recentInqsRaw },
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today).not('checked_in_at', 'is', null),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('appointment_date', today).lte('appointment_date', weekEnd),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    // Missed visits worth a callback: past days only, so today's patients are
    // not counted as no-shows while the clinic is still open. Nothing is stored
    // for this — an unchecked past appointment simply is a no-show.
    supabase.from('appointments').select('*', { count: 'exact', head: true })
      .is('checked_in_at', null).neq('status', 'cancelled')
      .gte('appointment_date', noShowFrom).lt('appointment_date', today),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('is_resolved', false),
    supabase.from('appointments').select('id,patient_name,phone,appointment_date,appointment_time,status,checked_in_at,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('contact_inquiries').select('id,name,phone,message,is_resolved,created_at').order('created_at', { ascending: false }).limit(5),
  ]);

  // Availability for the slot panel: booked counts plus the configured capacity.
  const [{ data: panelAppts }, { data: settingsRaw }] = await Promise.all([
    supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', panelDate)
      .in('status', ['pending', 'confirmed']),
    supabase.from('clinic_settings').select('max_per_slot').eq('id', true).maybeSingle(),
  ]);

  const slotCounts: Record<string, number> = {};
  for (const row of panelAppts ?? []) {
    const key = (row.appointment_time as string).slice(0, 5);
    slotCounts[key] = (slotCounts[key] ?? 0) + 1;
  }

  const capacity =
    (settingsRaw as Pick<ClinicSettings, 'max_per_slot'> | null)?.max_per_slot
    ?? FALLBACK_CAPACITY;

  const slotGroups = getSlotGroupsForDate(parseLocalDate(panelDate) ?? new Date());

  const appts: RecentAppt[] = (recentApptsRaw ?? []).map((a) => ({ ...a, type: 'appointment' as const }));
  const inqs: RecentInquiry[] = (recentInqsRaw ?? []).map((i) => ({ ...i, type: 'inquiry' as const }));
  const activity: ActivityItem[] = [...appts, ...inqs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const noShows = noShowCount ?? 0;
  const hasAlerts =
    (pendingCount ?? 0) > 0 || (unresolvedCount ?? 0) > 0 || noShows > 0;

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Dashboard</h1>
        <p className="text-[13px] text-text-muted mt-0.5">{formatDayHeader()}</p>
      </div>

      {/* Alerts banner */}
      {hasAlerts && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
          <AlertTriangleIcon size={16} strokeWidth={2} className="text-amber-600 shrink-0" />
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-5 text-[13px]">
            {(pendingCount ?? 0) > 0 && (
              <Link href="/admin/appointments?status=pending" className="text-amber-800 font-semibold hover:underline">
                {pendingCount} appointment{pendingCount !== 1 ? 's' : ''} need confirmation
              </Link>
            )}
            {(unresolvedCount ?? 0) > 0 && (
              <Link href="/admin/inquiries" className="text-amber-800 font-semibold hover:underline">
                {unresolvedCount} {unresolvedCount !== 1 ? 'inquiries' : 'inquiry'} awaiting response
              </Link>
            )}
            {noShows > 0 && (
              // Sorted newest first, so the ones from this week — the ones this
              // count is about — are at the top of the list it opens.
              <Link
                href="/admin/appointments?attendance=no_show&sortCol=date&sortDir=desc"
                className="text-amber-800 font-semibold hover:underline"
              >
                {noShows} patient{noShows !== 1 ? 's' : ''} did not come in the last {NO_SHOW_WINDOW_DAYS} days
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Slot availability */}
      <div className="mb-6">
        <SlotAvailability
          date={panelDate}
          today={today}
          groups={slotGroups}
          counts={slotCounts}
          capacity={capacity}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <StatsCard
          title="Today's Appointments"
          value={todayCount ?? 0}
          icon={<CalendarIcon size={18} strokeWidth={1.8} />}
          zeroNote="None scheduled today"
          note={`${arrivedTodayCount ?? 0} checked in so far`}
          href="/admin/appointments?attendance=awaiting"
          hrefLabel="Who is still expected →"
        />
        <StatsCard
          title="This Week"
          value={weekCount ?? 0}
          icon={<CalendarDaysIcon size={18} strokeWidth={1.8} />}
          note="Next 7 days"
        />
        <StatsCard
          title="Pending"
          value={pendingCount ?? 0}
          icon={<ClockIcon size={18} strokeWidth={1.8} />}
          note="Need confirmation"
          href="/admin/appointments?status=pending"
          hrefLabel="Review Appointments →"
        />
        <StatsCard
          title="Unresolved"
          value={unresolvedCount ?? 0}
          icon={<AlertCircleIcon size={18} strokeWidth={1.8} />}
          note="Need follow-up"
          href="/admin/inquiries"
          hrefLabel="Review Inquiries →"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-[14px] font-bold text-text-base mb-2.5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NewAppointmentDialog />

          <Link
            href="/admin/appointments"
            className="flex items-center gap-3 bg-surface border border-border-muted rounded-lg px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group"
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
            className="flex items-center gap-3 bg-surface border border-border-muted rounded-lg px-5 py-4 hover:border-primary/40 hover:bg-primary-50 transition-all group"
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
      <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-muted flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-text-base">Recent Activity</h2>
          <Link href="/admin/appointments" className="text-[12px] font-semibold text-primary hover:opacity-70 transition-opacity">
            View all →
          </Link>
        </div>

        {activity.length === 0 ? (
          <p className="text-center text-[13px] text-text-muted py-10">No activity yet.</p>
        ) : (
          <div className="divide-y divide-border-muted">
            {activity.map((item) => {
              if (item.type === 'appointment') {
                const attendance = attendanceOf(item, today);
                return (
                  <div key={`appt-${item.id}`} className="px-5 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                      <CalendarIcon size={13} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-base truncate">{item.patient_name}</p>
                      <p className="text-[11px] text-text-muted">
                        {formatDate(item.appointment_date)} · {formatTime(item.appointment_time)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StatusBadge status={item.status} />
                      {/* Recent activity is mostly future bookings; "Upcoming"
                          beside "Confirmed" would say nothing. */}
                      {attendance !== 'upcoming' && <AttendanceBadge state={attendance} />}
                    </div>
                  </div>
                );
              }
              return (
                <div key={`inq-${item.id}`} className="px-5 py-2.5 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <MessageSquareIcon size={13} strokeWidth={1.8} />
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