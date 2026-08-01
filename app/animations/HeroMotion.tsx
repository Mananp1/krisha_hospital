'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface HeroMotionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The home page opening move. A cinematic settle on the full-bleed backdrop
 * behind a staged reveal of the copy:
 *
 *   backdrop  slow scale-down from enlarged (a "Ken Burns" open)
 *   overlay   fades up with it
 *   headline  each line wipes up from behind its own mask — the
 *             `[data-hero-line]` spans live inside `overflow-hidden`
 *             wrappers, so `yPercent` reads as a reveal, not a slide
 *   eyebrow   rides the same reveal (it has no mask, so it just lifts in)
 *   cta/stats settle up last
 *
 * Deliberately not a uniform fade on everything: the masked lines and the
 * expo ease are what stop it reading as a generic template entrance.
 */
export default function HeroMotion({ children, className }: HeroMotionProps) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          root.querySelectorAll(
            '[data-hero-backdrop], [data-hero-overlay], [data-hero-line], [data-hero-stat]',
          ),
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

          const backdrop = root.querySelector<HTMLElement>('[data-hero-backdrop]');
          const overlay = root.querySelector<HTMLElement>('[data-hero-overlay]');
          const copy = root.querySelector<HTMLElement>('[data-hero-copy]');
          if (!copy) return;

          const lines = copy.querySelectorAll<HTMLElement>('[data-hero-line]');
          const stats = copy.querySelectorAll<HTMLElement>('[data-hero-stat]');
          const timeline = gsap.timeline({ delay: motion.routeEntryDelay });

          if (backdrop) {
            // A long, slow settle from enlarged — cinematic rather than a pop.
            timeline.fromTo(
              backdrop,
              { autoAlpha: 0, scale: conditions.desktop ? 1.16 : 1.1 },
              {
                autoAlpha: 1,
                scale: 1,
                duration: 1.7,
                ease: 'power2.out',
              },
              0,
            );
          }

          if (overlay) {
            timeline.fromTo(
              overlay,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.9, ease: 'power2.out' },
              0,
            );
          }

          timeline
            .fromTo(
              lines,
              { yPercent: 118, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.95,
                stagger: 0.11,
                ease: 'expo.out',
                clearProps: 'opacity,visibility,transform',
              },
              0.4,
            )
            .fromTo(
              stats,
              { y: conditions.desktop ? 26 : 18, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                stagger: 0.09,
                ease: 'power3.out',
                clearProps: 'opacity,visibility,transform',
              },
              0.95,
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
