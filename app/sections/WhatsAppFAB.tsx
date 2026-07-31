'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/app/animations/gsap';
import { motion } from '@/app/animations/motion-config';

/**
 * Floating WhatsApp action.
 *
 * The hover was `hover:scale-110 active:scale-95 transition-transform` in
 * CSS. That could not stay once GSAP took over motion here: both write to
 * `transform`, and a CSS transition on the same property fights whatever
 * GSAP sets each frame. One owner per property.
 */
export default function WhatsAppFAB() {
  const root = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const element = root.current;
      if (!element) return;

      const safe = contextSafe ?? (<T,>(fn: T) => fn);
      const media = gsap.matchMedia();

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

          // `back` overshoots a little and settles, so the button reads as
          // responding rather than resizing. Kept mild: this sits over the
          // page at all times, and anything springier becomes a distraction.
          const enter = safe(() => {
            gsap.to(element, {
              scale: 1.12,
              duration: motion.duration.fast,
              ease: 'back.out(2.2)',
              overwrite: 'auto',
            });
          });
          const leave = safe(() => {
            gsap.to(element, {
              scale: 1,
              duration: motion.duration.fast,
              ease: motion.ease.standard,
              overwrite: 'auto',
            });
          });
          // Press feedback, replacing `active:scale-95`.
          const press = safe(() => {
            gsap.to(element, {
              scale: 0.94,
              duration: 0.1,
              ease: motion.ease.standard,
              overwrite: 'auto',
            });
          });

          element.addEventListener('mouseenter', enter);
          element.addEventListener('mouseleave', leave);
          element.addEventListener('focus', enter);
          element.addEventListener('blur', leave);
          element.addEventListener('pointerdown', press);
          element.addEventListener('pointerup', enter);

          return () => {
            element.removeEventListener('mouseenter', enter);
            element.removeEventListener('mouseleave', leave);
            element.removeEventListener('focus', enter);
            element.removeEventListener('blur', leave);
            element.removeEventListener('pointerdown', press);
            element.removeEventListener('pointerup', enter);
          };
        },
      );

      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <a
      ref={root}
      href="https://wa.me/917862950676"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 drop-shadow-lg rounded-pill focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <Image
        src="/whatsapp-svgrepo-com.svg"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-full h-full"
      />
    </a>
  );
}
