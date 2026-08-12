'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, EventClickArg } from '@fullcalendar/core';
import type { DateClickArg } from '@fullcalendar/interaction';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { AppointmentDetailDialog } from './AppointmentDetailDialog';
import { AppointmentsPreviewDialog } from './AppointmentsPreviewDialog';
import type { Appointment } from '@/types/database';
import { OPD_DAY_START, OPD_DAY_END, SLOT_MINUTES } from '@/lib/opd-hours';

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

/** "14:30:00" or "14:30" → 870. */
function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
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
  const calendarRef = useRef<FullCalendar>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [newApptOpen, setNewApptOpen] = useState(false);

  // Held by id so a refresh after an edit re-feeds the open dialog.
  const detail = appointments.find((a) => a.id === detailId) ?? null;
  const [clickedDate, setClickedDate] = useState<string | undefined>();
  const [clickedTime, setClickedTime] = useState<string | undefined>();
  const [initialView] = useState<string>(
    () => window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek',
  );

  // What is being previewed: one slot when `time` is set, otherwise a whole day.
  // `canBook` is settled when the preview opens rather than read from the clock
  // on each render, which would be impure.
  const [preview, setPreview] = useState<
    { date: string; time?: string; canBook: boolean } | null
  >(null);

  /** Opens one slot's list, deciding up front whether booking is still possible. */
  function openSlot(date: string, time: string) {
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    setPreview({
      date,
      time,
      canBook: new Date(y, m - 1, d, hh, mm).getTime() > Date.now(),
    });
  }

  /** Opens a whole day's list. A day stays bookable until it is behind us. */
  function openDay(date: string) {
    const now = new Date();
    const todayKey = toDateKey(now);
    setPreview({ date, canBook: date >= todayKey });
  }

  // Count per date for header badges and month density
  const byDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const appt of appointments) {
      (map[appt.appointment_date] ??= []).push(appt);
    }
    return map;
  }, [appointments]);

  function handleEventClick(info: EventClickArg) {
    const appointment = info.event.extendedProps.appointment as Appointment;
    setDetailId(appointment.id);
  }

  function handleDateClick(info: DateClickArg) {
    const [datePart, timeFull] = info.dateStr.split('T');

    // The day number carries its own handler (open the day's list). It sits
    // inside the cell, so this fires too — leave it to the button.
    if ((info.jsEvent.target as HTMLElement | null)?.closest('[data-day-number]')) {
      return;
    }

    // In month view a date cell is a navigation target, not a booking slot —
    // clicking it drills into that day.
    if (info.view.type === 'dayGridMonth') {
      calendarRef.current?.getApi().changeView('timeGridDay', datePart);
      return;
    }

    // Week and day views open the slot for reading. Booking is a deliberate
    // second step inside that dialog rather than a side effect of clicking the
    // grid, which used to fire on any stray click and hid a crowded slot behind
    // the new-appointment form.
    if (!timeFull) return;
    openSlot(datePart, timeFull.substring(0, 5));
  }

  /** Appointments in the previewed window — one half-hour slot, or the full day. */
  const previewAppointments = useMemo(() => {
    if (!preview) return [];
    const onDay = byDate[preview.date] ?? [];

    const inWindow = preview.time === undefined
      ? onDay
      : onDay.filter((a) => {
          const start = toMinutes(preview.time!);
          const m = toMinutes(a.appointment_time);
          return m >= start && m < start + SLOT_MINUTES;
        });

    return [...inWindow].sort((a, b) =>
      a.appointment_time.localeCompare(b.appointment_time),
    );
  }, [preview, byDate]);

  // Custom day-column header for week/day views
  function dayHeaderContent(info: { date: Date; isToday: boolean }) {
    const key = toDateKey(info.date);
    const dayAppts = byDate[key] ?? [];
    const total = dayAppts.length;
    const confirmed = dayAppts.filter((a) => a.status === 'confirmed').length;
    const pending = dayAppts.filter((a) => a.status === 'pending').length;

    return (
      <button
        type="button"
        onClick={() => openDay(key)}
        title={`View all ${total} appointment${total === 1 ? '' : 's'} on this day`}
        className="w-full flex flex-col items-center py-2 gap-0.5 cursor-pointer hover:bg-primary-50 transition-colors"
      >
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
      </button>
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
        {/* The number opens the day's full list. FullCalendar's own click
            listener fires before React's, so it cannot be stopped from here —
            handleDateClick looks for this marker and stands down instead. */}
        <button
          type="button"
          data-day-number
          onClick={() => openDay(key)}
          title={
            count > 0
              ? `View all ${count} appointment${count === 1 ? '' : 's'} on this day`
              : 'View this day'
          }
          className={`text-[12px] font-semibold rounded px-1 -mx-0.5 cursor-pointer hover:bg-primary hover:text-white transition-colors ${
            info.isToday ? 'text-primary' : 'text-text-base'
          }`}
        >
          {info.dayNumberText}
        </button>
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

        /* ── Slot hover cue (opens the slot's patient list) ── */
        .krisha-cal .fc-timegrid-col-events:hover,
        .krisha-cal .fc-daygrid-day:hover .fc-daygrid-day-frame {
          background-color: rgba(124, 58, 237, 0.02) !important;
          cursor: pointer !important;
        }

        /* ── Past days ──
           Shaded to show they are read-only. Still clickable: a past slot can be
           opened to see who attended, it just cannot be booked into. */
        .krisha-cal .fc-timegrid-col.fc-day-past .fc-timegrid-col-frame {
          background-color: rgba(100, 116, 139, 0.06) !important;
        }

        /* ── Overflow link inside a crowded slot ── */
        .krisha-cal .fc-timegrid-more-link {
          font-size: 10px !important;
          font-weight: 700 !important;
          background: var(--color-primary, #7c3aed) !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 1px 4px !important;
        }
      `}</style>

      <div className="krisha-cal">
        <FullCalendar
          ref={calendarRef}
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
          dayMaxEvents={4}
          // A half-hour slot holds far more patients than can be drawn side by
          // side, so cap the stack and let the overflow link open the slot list.
          eventMaxStack={3}
          moreLinkClick={(arg) => {
            const d = arg.date;
            // In month view the link covers a whole day, not a slot, and its
            // date is midnight — show the day's full list rather than a 00:00
            // slot. This is the direct answer to "16 booked, I can see 3".
            if (arg.view.type === 'dayGridMonth') {
              openDay(toDateKey(d));
              return 'none';
            }
            openSlot(
              toDateKey(d),
              `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
            );
            return 'none';
          }}
          moreLinkContent={(arg) => `+${arg.num} more`}
          // Pinned to the same constant the slot filter uses, so the grid cannot
          // drift out of step with what a "slot" means everywhere else.
          slotDuration={`00:${SLOT_MINUTES}:00`}
          slotMinTime={`${OPD_DAY_START}:00`}
          slotMaxTime={`${OPD_DAY_END}:00`}
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

      {preview && (
        <AppointmentsPreviewDialog
          open
          onOpenChange={(v) => { if (!v) setPreview(null); }}
          date={preview.date}
          time={preview.time}
          appointments={previewAppointments}
          canBook={preview.canBook}
          onBook={() => {
            setClickedDate(preview.date);
            // Day mode has no time yet — the form asks for one.
            setClickedTime(preview.time);
            setPreview(null);
            setNewApptOpen(true);
          }}
          onSelect={(appt) => { setPreview(null); setDetailId(appt.id); }}
        />
      )}

      {detail && (
        <AppointmentDetailDialog
          appointment={detail}
          open
          onOpenChange={(v) => { if (!v) setDetailId(null); }}
        />
      )}

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