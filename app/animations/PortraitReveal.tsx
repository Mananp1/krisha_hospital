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
        const timeline = gsap.timeline({
          delay: root.getBoundingClientRect().top < window.innerHeight
            ? motion.routeEntryDelay
            : 0,
          scrollTrigger: {
            trigger: root,
            start: 'top 84%',
            once: true,
          },
        });

        timeline
          .fromTo(
            frame,
            { clipPath: 'inset(0 0 100% 0 round 999px 999px 16px 16px)' },
            {
              clipPath: 'inset(0 0 0% 0 round 999px 999px 16px 16px)',
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
