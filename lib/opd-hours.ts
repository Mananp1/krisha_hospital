/**
 * Single source of truth for OPD consulting hours.
 *
 * OPD: Mon–Sat 11 AM–2 PM & 6 PM–8 PM · Sun 11 AM–1 PM
 *
 * Appointments are booked in 30-minute slots. A slot is identified by its
 * start time ("HH:mm", 24h). The last slot in a window starts one slot-length
 * before the window closes, so every booked visit ends by closing time.
 */

export const SLOT_MINUTES = 30;

/**
 * Bounds for the admin-configurable per-slot capacity
 * (`clinic_settings.max_per_slot`). Mirrors the table's check constraint.
 *
 * These live here rather than in `app/admin/actions.ts` because a `'use server'`
 * module may only export async functions.
 */
export const MIN_PER_SLOT = 1;
export const MAX_PER_SLOT_LIMIT = 100;

/** A window of [start, end) local time on a given day. */
interface OpdWindow {
  /** Label shown above the slot group in the booking UI. */
  label: string;
  start: string;
  end: string;
}

const WEEKDAY_WINDOWS: OpdWindow[] = [
  { label: 'Morning', start: '11:00', end: '14:00' },
  { label: 'Evening', start: '18:00', end: '20:00' },
];

const SUNDAY_WINDOWS: OpdWindow[] = [
  { label: 'Morning', start: '11:00', end: '13:00' },
];

/** Indexed by `Date.getDay()` — 0 is Sunday. The clinic runs OPD every day. */
const WINDOWS_BY_DAY: Record<number, OpdWindow[]> = {
  0: SUNDAY_WINDOWS,
  1: WEEKDAY_WINDOWS,
  2: WEEKDAY_WINDOWS,
  3: WEEKDAY_WINDOWS,
  4: WEEKDAY_WINDOWS,
  5: WEEKDAY_WINDOWS,
  6: WEEKDAY_WINDOWS,
};

/** Human-readable summary, kept next to the schedule it describes. */
export const OPD_HOURS_LABEL =
  'OPD hours: Mon–Sat, 11 AM–2 PM & 6 PM–8 PM · Sun, 11 AM–1 PM.';

/** Earliest/latest OPD times across the whole week, for calendar viewports. */
export const OPD_DAY_START = '11:00';
export const OPD_DAY_END = '20:00';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function windowSlots({ start, end }: OpdWindow): string[] {
  const slots: string[] = [];
  const close = toMinutes(end);
  for (let t = toMinutes(start); t + SLOT_MINUTES <= close; t += SLOT_MINUTES) {
    slots.push(toTimeString(t));
  }
  return slots;
}

export interface SlotGroup {
  label: string;
  slots: string[];
}

/** Slot start times for a date, grouped by OPD window (morning / evening). */
export function getSlotGroupsForDate(date: Date): SlotGroup[] {
  const windows = WINDOWS_BY_DAY[date.getDay()] ?? [];
  return windows.map((w) => ({ label: w.label, slots: windowSlots(w) }));
}

/** Flat list of slot start times bookable on a date. */
export function getSlotsForDate(date: Date): string[] {
  return getSlotGroupsForDate(date).flatMap((g) => g.slots);
}

/** Slot start times for a "yyyy-MM-dd" string (parsed as a local date). */
export function getSlotsForDateString(dateStr: string): string[] {
  const date = parseLocalDate(dateStr);
  return date ? getSlotsForDate(date) : [];
}

/** Whether a slot falls inside OPD hours for that date. */
export function isSlotWithinOpdHours(slot: string, date: Date): boolean {
  return getSlotsForDate(date).includes(slot);
}

/**
 * Parses "yyyy-MM-dd" into a local-midnight Date. `new Date("yyyy-MM-dd")`
 * parses as UTC, which shifts the weekday for negative-offset timezones.
 */
export function parseLocalDate(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Formats "14:30" as "2:30 PM". */
export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
}
