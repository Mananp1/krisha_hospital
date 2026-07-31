'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface AnimatedNumberProps {
  value: string;
  className?: string;
}

export default function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const element = numberRef.current;
      const match = value.match(/^([\d,]+)(.*)$/);
      if (!element || !match) return;

      const end = Number(match[1].replaceAll(',', ''));
      const suffix = match[2];
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        element.textContent = value;
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { value: 0 };

        gsap.to(counter, {
          value: end,
          duration: motion.duration.slow,
          delay: element.getBoundingClientRect().top < window.innerHeight
            ? motion.routeEntryDelay + 0.25
            : 0,
          ease: motion.ease.standard,
          snap: { value: 1 },
          onUpdate: () => {
            element.textContent = `${Math.round(counter.value).toLocaleString('en-IN')}${suffix}`;
          },
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            once: true,
          },
        });
      });

      return () => media.revert();
    },
    { scope: numberRef, dependencies: [value], revertOnUpdate: true },
  );

  return (
    <span className={cn(className)}>
      <span className="sr-only">{value}</span>
      <span ref={numberRef} aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
