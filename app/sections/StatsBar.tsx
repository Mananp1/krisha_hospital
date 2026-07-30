'use client';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * Full-bleed trust band. Five icon cards on a gradient became one flat plum
 * block: no cards, no icons, display-face numerals separated by hairline rules.
 * This is the 30% of the 60/30/10 doing its job as a single large field.
 */
const stats = [
  { value: 20000, suffix: '+',     display: '20K+',   labelKey: 'happyPatients' },
  { value: 5000,  suffix: '+',     display: '5,000+', labelKey: 'normalDeliveries' },
  { value: 2500,  suffix: '+',     display: '2,500+', labelKey: 'ivfBabies' },
  { value: 72,    suffix: '%',     display: '72%',    labelKey: 'ivfSuccessRate' },
  { value: 20,    suffix: ' Yrs',  display: '20 Yrs', labelKey: 'yearsExcellence' },
] as const;

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

interface StatItemProps {
  readonly stat: (typeof stats)[number];
  readonly label: string;
  readonly active: boolean;
}

function StatItem({ stat, label, active }: StatItemProps) {
  const count = useCountUp(stat.value, 1500, active);

  let formatted = stat.display;
  if (active) {
    const n = stat.value >= 1000 ? count.toLocaleString() : String(count);
    formatted = n + stat.suffix;
  }

  return (
    <div className="flex flex-col items-center text-center px-3 py-7 lg:py-9">
      <span className="font-display text-display text-text-inverse tabular-nums leading-none">
        {formatted}
      </span>
      <span className="mt-3 text-label uppercase text-secondary-200">
        {label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  const t = useTranslations('statsBar');
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full bg-primary-900">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <div className="grid grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <div
              key={stat.labelKey}
              className={cn(
                // Hairline rules instead of card edges. Two columns on mobile,
                // five in a row from lg, so the divider logic differs per axis.
                'lg:border-l lg:border-white/12 lg:first:border-l-0',
                i % 2 === 1 && 'border-l border-white/12',
                i >= 2 && 'border-t border-white/12 lg:border-t-0',
                i === stats.length - 1 && 'col-span-2 lg:col-span-1',
              )}
            >
              <StatItem stat={stat} label={t(stat.labelKey)} active={active} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
