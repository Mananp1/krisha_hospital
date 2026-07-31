'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

/**
 * Progressive-enhancement reveal: the server markup is fully visible, then
 * GSAP takes ownership after hydration. Scoped selectors and useGSAP cleanup
 * keep route changes from leaving inline styles or ScrollTriggers behind.
 */
export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className,
}: FadeInProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = scope.current;
      if (!element) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(element, { clearProps: 'all' });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const x = direction === 'left' ? -motion.distance.desktop
          : direction === 'right' ? motion.distance.desktop
            : 0;
        const y = direction === 'up' ? motion.distance.desktop : 0;
        const entryDelay = element.getBoundingClientRect().top < window.innerHeight
          ? motion.routeEntryDelay
          : 0;

        gsap.fromTo(
          element,
          { autoAlpha: 0, x, y },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: motion.duration.base,
            delay: delay + entryDelay,
            ease: motion.ease.enter,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: element,
              start: motion.triggerStart,
              once: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope, dependencies: [delay, direction], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
