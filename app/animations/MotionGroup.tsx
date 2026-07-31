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
  /**
   * Opt-in two-stage background fill on hover, applied to the
   * `[data-motion-surface]` element inside each item.
   *
   * Given as CSS custom-property *names* rather than colour literals, so the
   * palette stays in globals.css and this never holds a second copy of a
   * brand colour that could drift from it.
   */
  fill?: { from: string; mid: string; to: string };
}

export default function MotionGroup({
  children,
  className,
  itemSelector = '[data-motion-item]',
  stagger = motion.stagger.base,
  hover = false,
  hoverScale = 1.03,
  fill,
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

          /*
            Resolved once, from the document. `getPropertyValue` returns the
            computed value, so a token defined as `var(--primary-400)`
            arrives here as the colour itself — which is what GSAP needs to
            interpolate, since it cannot tween between two `var()` strings.
          */
          const palette = fill
            ? (() => {
              const root = getComputedStyle(document.documentElement);
              return {
                from: root.getPropertyValue(fill.from).trim(),
                mid: root.getPropertyValue(fill.mid).trim(),
                to: root.getPropertyValue(fill.to).trim(),
              };
            })()
            : null;

          /*
            One card is open at a time, and the group has to know which.

            Moving between two cards used to leave both raised to the same
            z-index at once — one growing, one still shrinking. Equal
            z-index falls back to document order, so travelling right-to-left
            put the *closing* card on top of the one being opened, its
            background still part-way back to white, drawn across the new
            card's right edge. That was the pale border.

            Two things fix it. A card that is closing drops to a rank of its
            own: still above the untouched cards, so nothing crops it while
            it shrinks, but always beneath whichever card is opening. And
            taking over from another card closes it immediately rather than
            waiting on its own delay, so the handover starts at once instead
            of the two overlapping for the length of a timer.
          */
          const OPEN_Z = 20;
          const CLOSING_Z = 10;
          const closers = new Map<HTMLElement, () => void>();
          let openItem: HTMLElement | null = null;

          const cleanups = items.map((item) => {
            const arrow = item.querySelector<HTMLElement>('[data-motion-arrow]');
            const surface = palette
              ? item.querySelector<HTMLElement>('[data-motion-surface]')
              : null;

            /*
              Take inline ownership of the background up front, before any
              hover happens. The stylesheet still carries a `hover:` colour
              as the fallback for anyone this block never runs for — reduced
              motion, or no fine pointer — and inline styles outrank it, so
              claiming it now stops that instant colour flashing in during
              the intent delay, ahead of the fill that is meant to follow.
            */
            if (surface && palette) {
              gsap.set(surface, { backgroundColor: palette.from });
            }

            let fillTimeline: gsap.core.Timeline | null = null;

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
            const open = safe(() => {
              openItem = item;
              gsap.set(item, { zIndex: OPEN_Z });
              gsap.to(item, {
                scale: hoverScale,
                duration: motion.duration.fast,
                ease: motion.ease.standard,
                overwrite: 'auto',
                /*
                  GSAP's default `force3D: "auto"` promotes the element to a
                  compositor layer for the tween and drops it again after.
                  That is right for movement, but scaling a rasterised layer
                  resamples a texture captured at the old size, which softens
                  the edges for the duration of the tween and then snaps
                  crisp — visible here as a hairline flickering along the
                  card border while it grows. Re-rasterising each frame costs
                  a little more, trivially so for one card over 240ms.
                */
                force3D: false,
              });
              if (arrow) {
                gsap.to(arrow, {
                  x: 4,
                  duration: motion.duration.fast,
                  ease: motion.ease.standard,
                  overwrite: 'auto',
                });
              }

              if (surface && palette) {
                // Killed rather than overwritten: a half-finished fill is a
                // two-tween timeline, and `overwrite` on a replacement only
                // clears the tween currently running — the queued second
                // stage would still fire and drag the colour back down.
                fillTimeline?.kill();
                fillTimeline = gsap
                  .timeline({ delay: motion.hoverFill.offset })
                  .to(surface, {
                    backgroundColor: palette.mid,
                    duration: motion.hoverFill.rise,
                    ease: 'none',
                  })
                  .to(surface, {
                    backgroundColor: palette.to,
                    duration: motion.hoverFill.settle,
                    ease: motion.ease.standard,
                  });
              }
            });
            const close = safe(() => {
              if (openItem === item) openItem = null;

              // Demoted, not cleared. Above the cards it is still overlapping
              // as it shrinks, so none of them crop it, but below any card
              // being opened — which is what stops a closing card drawing
              // across its replacement.
              gsap.set(item, { zIndex: CLOSING_Z });
              gsap.to(item, {
                scale: 1,
                duration: motion.duration.fast,
                ease: motion.ease.standard,
                overwrite: 'auto',
                force3D: false,
                // Only once it is back to size and overlapping nothing.
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

              if (surface && palette) {
                // Straight back out, no intermediate stage. The two steps on
                // the way in are there to make the colour look like it is
                // filling; on the way out that same staging would read as
                // the card hesitating before it lets go.
                fillTimeline?.kill();
                fillTimeline = gsap.timeline().to(surface, {
                  backgroundColor: palette.from,
                  duration: motion.hoverFill.reset,
                  ease: motion.ease.standard,
                });
              }
            });

            /*
              Hover intent. The delay is a timer rather than the tween's own
              `delay`, and the difference matters: a scheduled tween still
              runs after a pointer has passed by, so the card would pop a
              beat late and immediately unpop. Cancelling the timer means a
              hover that did not settle produces no animation at all.

              Each direction cancels the other, so a fast in-out-in leaves
              exactly one pending action rather than a queue of them.
            */
            let openTimer = 0;
            let closeTimer = 0;

            // Registered so a sibling taking over can shut this one down
            // without waiting for its own leave timer to elapse.
            closers.set(item, () => {
              window.clearTimeout(openTimer);
              window.clearTimeout(closeTimer);
              close();
            });

            const enter = () => {
              window.clearTimeout(closeTimer);
              window.clearTimeout(openTimer);
              openTimer = window.setTimeout(() => {
                // Hand over before growing, so the card being replaced is
                // already demoted and on its way down by the time this one
                // has any size to overlap it with.
                if (openItem && openItem !== item) {
                  closers.get(openItem)?.();
                }
                open();
              }, motion.hoverDelayMs.open);
            };
            const leave = () => {
              window.clearTimeout(openTimer);
              window.clearTimeout(closeTimer);
              closeTimer = window.setTimeout(close, motion.hoverDelayMs.close);
            };

            item.addEventListener('mouseenter', enter);
            item.addEventListener('mouseleave', leave);
            item.addEventListener('focusin', enter);
            item.addEventListener('focusout', leave);

            return () => {
              window.clearTimeout(openTimer);
              window.clearTimeout(closeTimer);
              fillTimeline?.kill();
              closers.delete(item);
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
      dependencies: [fill, hover, hoverScale, itemSelector, stagger],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
