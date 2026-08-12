const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
