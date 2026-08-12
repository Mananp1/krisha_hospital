'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { SlotDatePicker } from './SlotDatePicker';
import { formatTimeDisplay, type SlotGroup } from '@/lib/opd-hours';
import { formatDateLong } from '@/lib/format';
import { cn } from '@/lib/utils';

// The wall clock is an external system, not React state, so it is subscribed to
// rather than mirrored into a useState. Ticking each minute lets a slot grey out
// as its time passes without the admin reloading the dashboard.
function subscribeToClock(onChange: () => void): () => void {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

/** Current minute. Coarse on purpose: it keeps the snapshot stable between ticks. */
function getClockSnapshot(): number {
  return Math.floor(Date.now() / 60_000);
}

/** No clock on the server — nothing is "past" until the browser says so. */
function getServerClockSnapshot(): null {
  return null;
}

interface SlotAvailabilityProps {
  /** "yyyy-MM-dd" the panel is showing. */
  date: string;
  /** "yyyy-MM-dd" for the real today, so the picker can offer "Today". */
  today: string;
  groups: SlotGroup[];
  /** Booked count per "HH:mm" slot. Absent means zero. */
  counts: Record<string, number>;
  capacity: number;
}

/**
 * Per-slot availability for one day. Clicking a slot opens the New Appointment
 * dialog with that date and time already filled in.
 */
export function SlotAvailability({ date, today, groups, counts, capacity }: SlotAvailabilityProps) {
  const router = useRouter();
  const [slot, setSlot] = useState<string | null>(null);

  // What counts as "already gone" is the admin's own local time, so it is read
  // in the browser. Null through SSR and hydration, then live.
  const minute = useSyncExternalStore(
    subscribeToClock, getClockSnapshot, getServerClockSnapshot,
  );
  const nowMs = minute === null ? null : minute * 60_000;

  /** A slot is spent once its start time is behind us on the day being shown. */
  function isPast(s: string): boolean {
    if (nowMs === null) return false;
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = s.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm).getTime() <= nowMs;
  }

  const isToday = date === today;

  const totalBooked = groups.reduce(
    (sum, g) => sum + g.slots.reduce((n, s) => n + (counts[s] ?? 0), 0), 0,
  );
  const totalCapacity = groups.reduce((sum, g) => sum + g.slots.length, 0) * capacity;

  // Only slots that can still be booked count as remaining.
  const stillOpen = groups.reduce(
    (n, g) => n + g.slots.filter((s) => !isPast(s) && (counts[s] ?? 0) < capacity).length,
    0,
  );

  return (
    <>
      <div className="bg-surface rounded-lg border border-border-muted p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[15px] font-semibold text-text-base">Slot availability</h2>
            <p className="text-[12px] text-text-muted mt-0.5">
              {formatDateLong(date)}{isToday && ' (today)'} · {totalBooked} of{' '}
              {totalCapacity} booked · {stillOpen} still open
            </p>
          </div>
          <SlotDatePicker date={date} today={today} />
        </div>

        {groups.length === 0 ? (
          <p className="text-[13px] text-text-muted py-2">
            No OPD hours on this day.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">
                  {group.label}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
                  {group.slots.map((s) => {
                    const booked = counts[s] ?? 0;
                    const free = Math.max(0, capacity - booked);
                    const isFull = free === 0;
                    const past = isPast(s);

                    return (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        disabled={past}
                        title={
                          past
                            ? `${formatTimeDisplay(s)} has already passed`
                            : isFull
                              ? `${formatTimeDisplay(s)} is full — click to book anyway`
                              : `Book ${formatTimeDisplay(s)}`
                        }
                        className={cn(
                          'flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-[12px] font-semibold transition-all',
                          past
                            ? 'bg-surface-muted border-border-muted text-text-muted opacity-50 cursor-not-allowed'
                            : cn(
                                'cursor-pointer',
                                isFull
                                  ? 'bg-red-50 border-red-200 text-red-700 hover:border-red-400'
                                  : booked > 0
                                    ? 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-400'
                                    : 'bg-surface border-border-muted text-text-base hover:border-primary hover:text-primary hover:bg-primary-50',
                              ),
                        )}
                      >
                        <span className={cn(past && 'line-through')}>
                          {formatTimeDisplay(s)}
                        </span>
                        <span className="text-[10px] font-normal mt-0.5">
                          {past ? 'Passed' : isFull ? 'Full' : `${free} free`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {groups.length > 0 && stillOpen === 0 && nowMs !== null && (
          <p className="mt-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[12px] text-amber-800">
            Nothing left to book on this day. Use the date arrows to move to the
            next one.
          </p>
        )}

        {groups.length > 0 && (
          <p className="text-[11px] text-text-muted mt-4 leading-relaxed">
            Click a slot to book it — {capacity} patients per slot. Full slots can
            still be booked, since the limit applies to the public form rather
            than to the clinic. Slots that have already passed cannot; use the
            date arrows to book a later day.
          </p>
        )}
      </div>

      {slot && (
        <NewAppointmentDialog
          open
          onOpenChange={(v) => { if (!v) setSlot(null); }}
          defaultDate={date}
          defaultTime={slot}
          onCreated={() => { setSlot(null); router.refresh(); }}
        />
      )}
    </>
  );
}
