'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

/** Shifts a "yyyy-MM-dd" string by n days without touching UTC. */
function shift(date: string, days: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const next = new Date(y, m - 1, d + days);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

/**
 * Moves the dashboard's slot panel between days via a `slotDate` search param.
 *
 * Today is the floor: nobody books a patient into a day that has already
 * happened, so backwards navigation stops there rather than wrapping around.
 * Past appointments are reviewed on the appointments and calendar pages.
 */
export function SlotDatePicker({ date, today }: { date: string; today: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const atToday = date <= today;   // "yyyy-MM-dd" sorts chronologically

  function go(next: string) {
    const target = next < today ? today : next;

    const params = new URLSearchParams(searchParams.toString());
    if (target === today) params.delete('slotDate');
    else params.set('slotDate', target);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const btn =
    'w-8 h-8 flex items-center justify-center rounded-lg border border-border-muted text-text-muted transition-colors hover:text-primary hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-text-muted disabled:hover:border-border-muted';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => go(shift(date, -1))}
        disabled={atToday}
        title={atToday ? 'Cannot book in the past' : 'Previous day'}
        className={btn}
      >
        <ChevronLeftIcon size={15} />
      </button>

      <input
        type="date"
        value={date}
        min={today}
        onChange={(e) => { if (e.target.value) go(e.target.value); }}
        className="px-3 py-1.5 text-[13px] bg-surface border border-border-muted rounded-md text-text-base transition-[color,box-shadow] focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20"
      />

      <button onClick={() => go(shift(date, 1))} title="Next day" className={btn}>
        <ChevronRightIcon size={15} />
      </button>

      {!atToday && (
        <button
          onClick={() => go(today)}
          className="px-3 py-1.5 text-[12px] font-semibold text-primary hover:underline"
        >
          Today
        </button>
      )}
    </div>
  );
}
