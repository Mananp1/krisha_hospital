const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * The clinic's wall clock. Deployment servers commonly run in UTC, which rolls
 * its date over at 05:30 IST — early enough to call yesterday's appointments
 * no-shows while the clinic is still shut. Anything that asks "what day is it"
 * has to name this zone rather than trust the host.
 */
export const CLINIC_TIME_ZONE = 'Asia/Kolkata';

/** Today in the clinic's timezone, as "yyyy-MM-dd". Safe on server and client. */
export function todayInClinic(): string {
  // en-CA formats as ISO "yyyy-MM-dd", which is what every date column here uses.
  return new Intl.DateTimeFormat('en-CA', { timeZone: CLINIC_TIME_ZONE }).format(new Date());
}

/** Shifts a "yyyy-MM-dd" by whole days, without leaving date-string space. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const shifted = new Date(y, m - 1, d + days);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, '0')}-${String(shifted.getDate()).padStart(2, '0')}`;
}

/** "2026-08-17" → "17 Aug 2026". Parsed by hand to avoid a UTC day shift. */
export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "2026-08-17" → "Monday, 17 Aug 2026". */
export function formatDateLong(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long' });
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "14:30:00" → "2:30 PM". */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${String(m).padStart(2, '0')} ${period}`;
}

/** ISO timestamp → "17 Aug 2026". */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** ISO timestamp → "17 Aug 2026, 2:30 PM". */
export function formatTimestampLong(iso: string): string {
  const d = new Date(iso);
  const hours = d.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${display}:${String(d.getMinutes()).padStart(2, '0')} ${period}`;
}
