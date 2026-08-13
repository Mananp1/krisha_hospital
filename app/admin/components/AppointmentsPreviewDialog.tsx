'use client';

import { CalendarPlusIcon, ChevronRightIcon } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { AttendanceBadge } from './AttendanceBadge';
import { ContactActions } from './ContactActions';
import { formatDateLong, formatTime } from '@/lib/format';
import { attendanceOf } from '@/lib/attendance';
import type { Appointment } from '@/types/database';
import { btnPrimary } from './controls';
import { cn } from '@/lib/utils';

interface AppointmentsPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "yyyy-MM-dd" being previewed. */
  date: string;
  /** "HH:mm" for a single slot. Omitted to preview the whole day. */
  time?: string;
  /** Everyone booked in the window, already sorted. */
  appointments: Appointment[];
  /** False once the slot, or the day, has gone by. */
  canBook: boolean;
  /** Today in the clinic's timezone — attendance is derived against it. */
  today: string;
  onBook: () => void;
  onSelect: (appointment: Appointment) => void;
}

/**
 * The patients booked into one slot, or across a whole day.
 *
 * The calendar grid can only legibly draw a few events per cell, so a busy day
 * has to be readable somewhere else — this is that somewhere. It is also the
 * only route to creating an appointment from the calendar, which keeps "look at
 * this" and "book into this" as two separate decisions.
 */
export function AppointmentsPreviewDialog({
  open, onOpenChange, date, time, appointments, canBook, today, onBook, onSelect,
}: AppointmentsPreviewDialogProps) {
  const isSlot = time !== undefined;
  const active = appointments.filter((a) => a.status !== 'cancelled');
  const cancelled = appointments.length - active.length;
  const arrived = appointments.filter((a) => a.checked_in_at).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[16px]">
            {isSlot ? formatTime(time) : formatDateLong(date)}
          </DialogTitle>
          <p className="text-[12px] text-text-muted">
            {isSlot && `${formatDateLong(date)} · `}
            {active.length} booked
            {arrived > 0 && ` · ${arrived} arrived`}
            {cancelled > 0 && ` · ${cancelled} cancelled`}
          </p>
        </DialogHeader>

        {appointments.length === 0 ? (
          <p className="text-[13px] text-text-muted py-6 text-center">
            Nobody is booked {isSlot ? 'into this slot' : 'on this day'}.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5 overflow-y-auto -mx-1 px-1 py-1">
            {appointments.map((appt) => {
              const attendance = attendanceOf(appt, today);
              return (
              <li
                key={appt.id}
                className="flex items-center gap-2 rounded-xl border border-border-muted bg-surface p-2.5"
              >
                {/* The row opens the full record; the contact buttons are their
                    own actions, so they sit outside the button rather than in it. */}
                <button
                  onClick={() => onSelect(appt)}
                  className="flex-1 min-w-0 text-left group cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    {/* In day mode the time is what tells the rows apart. */}
                    {!isSlot && (
                      <span className="text-[11px] font-semibold text-primary shrink-0 tabular-nums">
                        {formatTime(appt.appointment_time)}
                      </span>
                    )}
                    <span className="text-[13px] font-semibold text-text-base truncate group-hover:text-primary transition-colors">
                      {appt.patient_name}
                    </span>
                    <ChevronRightIcon
                      size={13}
                      className="text-text-muted shrink-0 group-hover:text-primary transition-colors"
                    />
                  </span>
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <StatusBadge status={appt.status} />
                    {/* A future slot is upcoming by definition — saying so next
                        to "Confirmed" is noise, so attendance shows up only
                        once it reports something. */}
                    {attendance !== 'upcoming' && <AttendanceBadge state={attendance} />}
                    <span className="text-[11px] text-text-muted truncate">
                      {appt.phone}
                    </span>
                  </span>
                </button>

                <ContactActions phone={appt.phone} />
              </li>
              );
            })}
          </ul>
        )}

        {canBook ? (
          <button
            onClick={onBook}
            className={cn(btnPrimary, 'mt-1 w-full')}
          >
            <CalendarPlusIcon size={14} />
            {isSlot ? 'Book into this slot' : 'Book on this day'}
          </button>
        ) : (
          <p className="mt-1 px-3 py-2 rounded-xl bg-surface-muted text-[12px] text-text-muted text-center">
            {isSlot ? 'This slot has' : 'This day has'} already passed — it can be
            viewed but not booked into.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
