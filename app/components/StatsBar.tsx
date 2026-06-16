'use client';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 20000, suffix: '+', label: 'Happy Patients', display: '20K+' },
  { value: 5000, suffix: '+', label: 'Normal Deliveries', display: '5,000+' },
  { value: 2500, suffix: '+', label: 'IVF / ICSI Babies', display: '2,500+' },
  { value: 72, suffix: '%', label: 'IVF Success Rate', display: '72%' },
  { value: 20, suffix: ' Yrs', label: 'Of Excellence', display: '20 Yrs' },
];

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

function StatItem({ stat, active }: { stat: (typeof stats)[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1500, active);
  const formatted = active
    ? stat.value >= 1000
      ? count.toLocaleString() + stat.suffix
      : count + stat.suffix
    : stat.display;

  return (
    <div className="flex flex-col items-center gap-1.5 text-center py-7 lg:py-0">
      <span className="font-extrabold text-[28px] sm:text-[32px] lg:text-[36px] text-text-inverse leading-[1.1] tabular-nums">
        {formatted}
      </span>
      <span className="text-[12px] sm:text-[12.5px] font-medium text-text-inverse/85 leading-snug">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar() {
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
    <div ref={ref} className="w-full bg-primary">
      <div className="grid grid-cols-2 lg:flex lg:items-center lg:justify-between max-w-360 mx-auto px-5 lg:px-25 lg:min-h-25 lg:divide-x lg:divide-white/20">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex justify-center items-center lg:flex-1 ${
              i >= 2 ? 'border-t border-white/10 lg:border-t-0' : ''
            } ${i === 4 ? 'col-span-2' : ''}`}
          >
            <StatItem stat={stat} active={active} />
          </div>
        ))}
      </div>
    </div>
  );
}
