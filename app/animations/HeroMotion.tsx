'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface HeroMotionProps {
  children: React.ReactNode;
  className?: string;
}

export default function HeroMotion({ children, className }: HeroMotionProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          root.querySelectorAll('[data-hero-image], [data-hero-line], [data-hero-stat]'),
          { clearProps: 'all' },
        );
      });

      media.add(
        {
          motionAllowed: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1024px)',
        },
        (context) => {
          const conditions = context.conditions as {
            motionAllowed: boolean;
            desktop: boolean;
          };
          if (!conditions.motionAllowed) return;

          const image = root.querySelector<HTMLElement>(
            conditions.desktop
              ? '[data-hero-image="desktop"]'
              : '[data-hero-image="mobile"]',
          );
          const copy = root.querySelector<HTMLElement>(
            conditions.desktop
              ? '[data-hero-copy="desktop"]'
              : '[data-hero-copy="mobile"]',
          );
          if (!copy) return;

          const lines = copy.querySelectorAll<HTMLElement>('[data-hero-line]');
          const stats = copy.querySelectorAll<HTMLElement>('[data-hero-stat]');
          // Shared with every other entry animation. This was a literal
          // 0.78 — a third copy of the splash delay that the config change
          // would have silently left behind.
          const timeline = gsap.timeline({ delay: motion.routeEntryDelay });

          if (image) {
            timeline.fromTo(
              image,
              {
                autoAlpha: 0,
                scale: conditions.desktop ? 1.035 : 1.02,
                clipPath: conditions.desktop
                  ? 'inset(0 0 0 10%)'
                  : 'inset(8% 0 0 0)',
              },
              {
                autoAlpha: 1,
                scale: 1,
                clipPath: 'inset(0 0 0 0)',
                duration: motion.duration.image,
                ease: motion.ease.enter,
              },
              0,
            );
          }

          timeline
            .fromTo(
              lines,
              { autoAlpha: 0, y: conditions.desktop ? 28 : 18 },
              {
                autoAlpha: 1,
                y: 0,
                duration: motion.duration.base,
                stagger: motion.stagger.tight,
                ease: motion.ease.enter,
                clearProps: 'opacity,visibility,transform',
              },
              0.12,
            )
            .fromTo(
              stats,
              { autoAlpha: 0, y: 12 },
              {
                autoAlpha: 1,
                y: 0,
                duration: motion.duration.base,
                stagger: motion.stagger.tight,
                ease: motion.ease.enter,
                clearProps: 'opacity,visibility,transform',
              },
              0.4,
            );
        },
      );

      return () => media.revert();
    },
    { scope },
  );

  return (
    <section ref={scope} id="home" className={cn(className)}>
      {children}
    </section>
  );
}

