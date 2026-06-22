'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, EventClickArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import { AppointmentDrawer } from './AppointmentDrawer';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import type { Appointment } from '@/types/database';

// Saturated colors — visually distinct even at small event widths
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  pending:   { bg: '#FDE68A', border: '#D97706', text: '#78350F', dot: '#D97706' },
  confirmed: { bg: '#6EE7B7', border: '#059669', text: '#064E3B', dot: '#059669' },
  cancelled: { bg: '#FCA5A5', border: '#DC2626', text: '#7F1D1D', dot: '#DC2626' },
};

function addThirtyMins(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}:00`;
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function toCalendarEvents(appointments: Appointment[]): EventInput[] {
  return appointments.map((appt) => {
    const c = STATUS_COLORS[appt.status] ?? STATUS_COLORS.pending;
    return {
      id: appt.id,
      title: appt.patient_name,
      start: `${appt.appointment_date}T${appt.appointment_time}`,
      end: `${appt.appointment_date}T${addThirtyMins(appt.appointment_time)}`,
      backgroundColor: c.bg,
      borderColor: c.border,
      textColor: c.text,
      extendedProps: { appointment: appt },
    };
  });
}

export function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<string | undefined>();
  const [clickedTime, setClickedTime] = useState<string | undefined>();
  const [initialView] = useState<string>(
    () => window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek',
  );

  // Count per date for header badges and month density
  const byDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appt of appointments) {
      (map[appt.appointment_date] ??= []).push(appt);
    }
    return map;
  }, [appointments]);

  function handleEventClick(info: EventClickArg) {
    setSelected(info.event.extendedProps.appointment as Appointment);
  }

  function handleDateClick(info: DateClickArg) {
    const [datePart, timeFull] = info.dateStr.split('T');
    // timeFull is "HH:MM:SS" in week/day view, undefined in month view
    const timePart = timeFull ? timeFull.substring(0, 5) : undefined;
    setClickedDate(datePart);
    setClickedTime(timePart);
    setNewApptOpen(true);
  }

  // Custom day-column header for week/day views
  function dayHeaderContent(info: { date: Date; isToday: boolean }) {
    const key = toDateKey(info.date);
    const dayAppts = byDate[key] ?? [];
    const total = dayAppts.length;
    const confirmed = dayAppts.filter((a) => a.status === 'confirmed').length;
    const pending = dayAppts.filter((a) => a.status === 'pending').length;

    return (
      <div className="flex flex-col items-center py-2 gap-0.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {info.date.toLocaleDateString('en', { weekday: 'short' })}
        </span>
        {info.isToday ? (
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-[16px] font-bold leading-none">
            {info.date.getDate()}
          </span>
        ) : (
          <span className="text-[16px] font-bold leading-none text-text-base">
            {info.date.getDate()}
          </span>
        )}
        {total > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[10px] font-semibold text-text-muted">{total}</span>
            {confirmed > 0 && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                title={`${confirmed} confirmed`}
              />
            )}
            {pending > 0 && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                title={`${pending} pending`}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Custom month cell header — day number + density dot
  function dayCellContent(info: { date: Date; dayNumberText: string; isToday: boolean }) {
    const key = toDateKey(info.date);
    const count = (byDate[key] ?? []).length;
    const dotColor =
      count >= 8 ? 'bg-red-400' :
      count >= 4 ? 'bg-amber-400' :
      count >= 1 ? 'bg-emerald-400' : '';

    return (
      <div className="flex items-center justify-between w-full px-1 py-0.5">
        <span className={`text-[12px] font-semibold ${info.isToday ? 'text-primary' : 'text-text-base'}`}>
          {info.dayNumberText}
        </span>
        {dotColor && <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />}
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ── Buttons ── */
        .krisha-cal .fc-button {
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 5px 12px !important;
          text-transform: capitalize !important;
          box-shadow: none !important;
        }
        .krisha-cal .fc-button-primary {
          background-color: white !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
        }
        .krisha-cal .fc-button-primary:hover:not(:disabled) {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
        .krisha-cal .fc-button-primary:not(:disabled).fc-button-active,
        .krisha-cal .fc-button-primary:not(:disabled):active {
          background-color: var(--color-primary, #7c3aed) !important;
          border-color: var(--color-primary, #7c3aed) !important;
          color: white !important;
        }
        .krisha-cal .fc-button-group .fc-button        { border-radius: 0 !important; }
        .krisha-cal .fc-button-group .fc-button:first-child { border-radius: 8px 0 0 8px !important; }
        .krisha-cal .fc-button-group .fc-button:last-child  { border-radius: 0 8px 8px 0 !important; }

        /* ── Toolbar title ── */
        .krisha-cal .fc-toolbar-title {
          font-size: 16px !important;
          font-weight: 700 !important;
          color: #0f172a !important;
        }
        .krisha-cal .fc-toolbar { margin-bottom: 16px !important; }

        /* ── Column headers (week/day) ── */
        .krisha-cal .fc-col-header-cell {
          background: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .krisha-cal .fc-col-header-cell-cushion {
          padding: 0 !important;
          display: block !important;
          text-decoration: none !important;
        }

        /* ── Time grid ── */
        .krisha-cal .fc-timegrid-slot         { height: 44px !important; }
        .krisha-cal .fc-timegrid-slot-lane    { border-color: #f1f5f9 !important; }
        .krisha-cal .fc-timegrid-slot-minor   { border-color: transparent !important; }
        .krisha-cal .fc-timegrid-slot-label   { font-size: 11px !important; color: #94a3b8 !important; }
        .krisha-cal .fc-timegrid-slot-label-cushion { padding-right: 8px !important; }

        /* ── Grid borders ── */
        .krisha-cal .fc-scrollgrid              { border-color: #e2e8f0 !important; border-radius: 12px; }
        .krisha-cal .fc-scrollgrid-section > td { border-color: #e2e8f0 !important; }
        .krisha-cal .fc-theme-standard td,
        .krisha-cal .fc-theme-standard th       { border-color: #e2e8f0 !important; }

        /* ── Today highlight ── */
        .krisha-cal .fc-day-today {
          background-color: rgba(124, 58, 237, 0.04) !important;
        }
        .krisha-cal .fc-daygrid-day.fc-day-today .fc-daygrid-day-frame {
          background-color: rgba(124, 58, 237, 0.04) !important;
        }

        /* ── Now indicator ── */
        .krisha-cal .fc-now-indicator-line  { border-color: var(--color-primary, #7c3aed) !important; }
        .krisha-cal .fc-now-indicator-arrow { border-top-color: var(--color-primary, #7c3aed) !important; }

        /* ── Events ── */
        .krisha-cal .fc-event {
          border-radius: 5px !important;
          border-width: 1.5px !important;
          cursor: pointer !important;
        }
        .krisha-cal .fc-event:hover { opacity: 0.80 !important; }
        .krisha-cal .fc-daygrid-event { border-radius: 4px !important; }
        .krisha-cal .fc-event-main    { overflow: hidden !important; }

        /* ── Month view ── */
        .krisha-cal .fc-daygrid-day-number {
          font-size: 12px !important;
          padding: 2px 4px !important;
        }
        .krisha-cal .fc-daygrid-day-top { display: block !important; }
        .krisha-cal .fc-daygrid-more-link {
          font-size: 11px !important;
          font-weight: 600 !important;
          color: var(--color-primary, #7c3aed) !important;
        }

        /* ── Empty-slot hover cue (quick-add affordance) ── */
        .krisha-cal .fc-timegrid-col-events:hover,
        .krisha-cal .fc-daygrid-day:hover .fc-daygrid-day-frame {
          background-color: rgba(124, 58, 237, 0.02) !important;
          cursor: pointer !important;
        }
      `}</style>

      <div className="krisha-cal">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView={initialView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth',
          }}
          buttonText={{ today: 'Today', day: 'Day', week: 'Week', month: 'Month' }}
          events={toCalendarEvents(appointments)}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          dayHeaderContent={dayHeaderContent}
          dayCellContent={dayCellContent}
          dayMaxEvents={3}
          slotMinTime="09:00:00"
          slotMaxTime="19:30:00"
          allDaySlot={false}
          nowIndicator
          height="auto"
          eventContent={(info) => {
            const status = (info.event.extendedProps.appointment as Appointment).status;
            const dot = STATUS_COLORS[status]?.dot ?? '#D97706';
            return (
              <div className="flex items-center gap-1 px-1.5 py-0.5 overflow-hidden h-full min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: dot }}
                />
                <span className="text-[11px] font-semibold truncate leading-tight">
                  {info.event.title}
                </span>
              </div>
            );
          }}
        />
      </div>

      <AppointmentDrawer
        appointment={selected}
        onClose={() => setSelected(null)}
        onUpdated={() => { setSelected(null); router.refresh(); }}
      />

      <NewAppointmentDialog
        open={newApptOpen}
        onOpenChange={setNewApptOpen}
        defaultDate={clickedDate}
        defaultTime={clickedTime}
        onCreated={() => router.refresh()}
      />
    </>
  );
}

export default CalendarView;