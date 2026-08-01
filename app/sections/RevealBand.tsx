'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { gsap, useGSAP } from '@/app/animations/gsap';
import { motion } from '@/app/animations/motion-config';

/**
 * A full-bleed brand moment. As the band scrolls into view its photograph
 * grows and sharpens from a smaller, softened centre into a crisp full-bleed
 * frame — the reveal is scrubbed to the scroll position, so it advances only as
 * far as the reader does. The short line over it is the hospital's own tagline,
 * not new marketing copy.
 */
export default function RevealBand() {
  const t = useTranslations('revealBand');
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const image = root.querySelector<HTMLElement>('[data-reveal-image]');
      const copy = root.querySelectorAll<HTMLElement>('[data-reveal-line]');
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        if (image) gsap.set(image, { clearProps: 'all' });
        gsap.set(copy, { clearProps: 'all' });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        if (image) {
          gsap.fromTo(
            image,
            { clipPath: 'inset(12% 16% 12% 16%)', scale: 1.18, autoAlpha: 0.55 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top 90%',
                end: 'top 20%',
                scrub: 0.6,
              },
            },
          );
        }

        gsap.fromTo(
          copy,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.duration.base,
            stagger: motion.stagger.tight,
            ease: motion.ease.enter,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: { trigger: root, start: 'top 62%', once: true },
          },
        );
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative w-full overflow-hidden bg-primary-950 h-[68vh] min-h-[26rem] lg:h-[80vh]"
    >
      {/* Backdrop — reveals on scroll. */}
      <div data-reveal-image className="absolute inset-0">
        <Image
          src="/gallery/staff/web/staff-6.jpg"
          alt={t('alt')}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Legibility wash. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-primary-950/60 via-primary-950/55 to-primary-950/70"
      />

      {/* Centred tagline. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
        <p data-reveal-line className="text-label uppercase text-white/75">
          {t('eyebrow')}
        </p>
        <h2
          data-reveal-line
          className="mt-3 font-display text-display text-white text-balance max-w-3xl drop-shadow-sm"
        >
          {t('title')}
        </h2>
        <p data-reveal-line className="mt-4 text-lead text-white/85 max-w-xl">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
