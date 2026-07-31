'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { gsap, useGSAP } from './gsap';
import { motion } from './motion-config';

interface PortraitRevealProps {
  children: React.ReactNode;
  className?: string;
}

export default function PortraitReveal({ children, className }: PortraitRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = scope.current;
      if (!root) return;

      // See MotionGroup: tweens created inside event handlers are only
      // tracked for cleanup if the handler is wrapped.
      const safe = contextSafe ?? (<T,>(fn: T) => fn);

      const frame = root.querySelector<HTMLElement>('[data-portrait-frame]');
      const image = root.querySelector<HTMLElement>('img');
      if (!frame || !image) return;

      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([frame, image], { clearProps: 'all' });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        /*
          Where the portrait sits at load decides which kind of reveal it
          gets, because only one of them is possible in each case.

          Below the fold it is scrubbed: the wipe is tied to scroll position
          rather than played on a timer once a trigger fires. Fired on a
          trigger it ran to completion on its own clock, so on any normal
          scroll it had finished before the portrait was properly in view and
          arrived looking like it had simply always been there. Scrubbed, the
          reveal is the scroll — it advances only as far as the reader does,
          and reverses if they go back up.

          Above the fold there is no scrolling to drive anything, so it keeps
          the timed version, delayed behind the splash like every other entry
          animation. That is the case on /doctor, where the portrait is in
          view immediately.
        */
        const aboveFold = root.getBoundingClientRect().top < window.innerHeight;

        const timeline = gsap.timeline(
          aboveFold
            ? { delay: motion.routeEntryDelay }
            : {
              scrollTrigger: {
                trigger: root,
                start: 'top 92%',
                end: 'top 52%',
                // A little catch-up rather than locking to the scrollbar,
                // so a flicked scroll wheel still resolves smoothly instead
                // of snapping frame to frame.
                scrub: 0.6,
              },
            },
        );

        timeline
          .fromTo(
            frame,
            // No `round` on the inset. The frame is already shaped by the
            // `arch` utility and clips its own overflow; the 999px/16px this
            // carried described a different silhouette entirely, and since a
            // clip-path is not cleared afterwards it stayed applied, cutting
            // the arch back to a capsule for good.
            { clipPath: 'inset(0 0 100% 0)' },
            {
              clipPath: 'inset(0 0 0% 0)',
              duration: motion.duration.image,
              ease: motion.ease.enter,
            },
          )
          .fromTo(
            image,
            { scale: 1.055 },
            { scale: 1, duration: motion.duration.image, ease: motion.ease.standard },
            '<',
          );
      });

      /*
        Hover: the photograph drifts in behind the arch, which stays put.
        Scaling the frame instead would move the arch itself — the brand
        device — and push it into the copy beside it. The frame already
        clips (`arch overflow-hidden` at the call site), so the image has
        somewhere to grow into without disturbing the layout.

        Gated on a real pointer: on touch, `mouseenter` fires on tap and the
        zoom would stick until something else was tapped.
      */
      media.add(
        {
          motionAllowed: '(prefers-reduced-motion: no-preference)',
          pointer: '(hover: hover) and (pointer: fine)',
        },
        (context) => {
          const conditions = context.conditions as {
            motionAllowed: boolean;
            pointer: boolean;
          };
          if (!conditions.motionAllowed || !conditions.pointer) return;

          const enter = safe(() => {
            gsap.to(image, {
              scale: 1.06,
              duration: motion.duration.base,
              ease: motion.ease.standard,
              overwrite: 'auto',
            });
          });
          const leave = safe(() => {
            gsap.to(image, {
              scale: 1,
              duration: motion.duration.base,
              ease: motion.ease.standard,
              overwrite: 'auto',
            });
          });

          root.addEventListener('mouseenter', enter);
          root.addEventListener('mouseleave', leave);

          return () => {
            root.removeEventListener('mouseenter', enter);
            root.removeEventListener('mouseleave', leave);
          };
        },
      );

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={cn('relative isolate', className)}>
      {/*
        Halo behind the portrait, using the `arch` brand device rather than a
        bespoke `rounded-[999px_999px_18px_18px]`. The hardcoded 999px capped
        the top into a capsule that did not nest with the arch on the
        portrait itself, and its 18px feet matched no step on the radius
        ladder. `arch` is proportional, so the halo keeps the portrait's
        shape at any size.
      */}
      <span
        aria-hidden="true"
        className="absolute -inset-x-3 top-4 bottom-3 -z-10 arch bg-primary-50"
      />
      {children}
    </div>
  );
}
