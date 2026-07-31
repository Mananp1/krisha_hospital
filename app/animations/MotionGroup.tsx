'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface MotionGroupProps {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  hover?: boolean;
  /**
   * Hover scale. Tunable because the right amount is a function of size:
   * a large card needs very little to read as lifting, while a small chip
   * needs more before the movement registers at all.
   */
  hoverScale?: number;
}

export default function MotionGroup({
  children,
  className,
  itemSelector = '[data-motion-item]',
  stagger = motion.stagger.base,
  hover = false,
  hoverScale = 1.03,
}: MotionGroupProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root) return;

      /*
        Hover tweens are created after this callback has finished, so GSAP
        cannot associate them with the context on its own — per GSAP's React
        guide, anything that animates from an event handler has to be wrapped
        in `contextSafe` or it is never reverted, leaving inline transforms
        behind on unmount. The fallback keeps types honest; useGSAP always
        supplies it at runtime.
      */
      const safe = contextSafe ?? (<T,>(fn: T) => fn);

      const items = gsap.utils.toArray<HTMLElement>(itemSelector, root);
      if (items.length === 0) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(items, { clearProps: 'all' });
      });

      media.add(
        {
          motionAllowed: '(prefers-reduced-motion: no-preference)',
          desktop: '(hover: hover) and (pointer: fine)',
        },
        (context) => {
          const conditions = context.conditions as {
            motionAllowed: boolean;
            desktop: boolean;
          };

          if (!conditions.motionAllowed) return;
          const entryDelay = root.getBoundingClientRect().top < window.innerHeight
            ? motion.routeEntryDelay
            : 0;

          gsap.fromTo(
            items,
            { autoAlpha: 0, y: motion.distance.desktop },
            {
              autoAlpha: 1,
              y: 0,
              duration: motion.duration.base,
              delay: entryDelay,
              ease: motion.ease.enter,
              stagger,
              clearProps: 'opacity,visibility,transform',
              scrollTrigger: {
                trigger: root,
                start: motion.triggerStart,
                once: true,
              },
            },
          );

          if (!hover || !conditions.desktop) return;

          const cleanups = items.map((item) => {
            const arrow = item.querySelector<HTMLElement>('[data-motion-arrow]');

            /*
              Scale from the centre, so the card grows on all four sides
              rather than lifting off one. Raising z-index is what makes
              that legible: the cards sit flush against each other with only
              a 1px seam between them, so a growing card has to come forward
              over its neighbours instead of being cropped against them.

              z-index is set instantly, not tweened — a numeric z-index
              animation would pass through the neighbours' stacking level on
              the way up and flicker.
            */
            const enter = safe(() => {
              gsap.set(item, { zIndex: 20 });
              gsap.to(item, {
                scale: hoverScale,
                duration: motion.duration.fast,
                ease: motion.ease.standard,
                overwrite: 'auto',
              });
              if (arrow) {
                gsap.to(arrow, {
                  x: 4,
                  duration: motion.duration.fast,
                  ease: motion.ease.standard,
                  overwrite: 'auto',
                });
              }
            });
            const leave = safe(() => {
              gsap.to(item, {
                scale: 1,
                duration: motion.duration.fast,
                ease: motion.ease.standard,
                overwrite: 'auto',
                // Dropped only once it is back to size; clearing it up front
                // would let neighbours cross in front mid-shrink.
                onComplete: () => gsap.set(item, { zIndex: 'auto' }),
              });
              if (arrow) {
                gsap.to(arrow, {
                  x: 0,
                  duration: motion.duration.fast,
                  ease: motion.ease.standard,
                  overwrite: 'auto',
                });
              }
            });

            item.addEventListener('mouseenter', enter);
            item.addEventListener('mouseleave', leave);
            item.addEventListener('focusin', enter);
            item.addEventListener('focusout', leave);

            return () => {
              item.removeEventListener('mouseenter', enter);
              item.removeEventListener('mouseleave', leave);
              item.removeEventListener('focusin', enter);
              item.removeEventListener('focusout', leave);
            };
          });

          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );

      return () => media.revert();
    },
    {
      scope,
      dependencies: [hover, hoverScale, itemSelector, stagger],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
