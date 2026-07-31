'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/app/animations/gsap';
import { motion } from '@/app/animations/motion-config';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: number;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  maxWidth = 560,
  light = false,
}: SectionHeaderProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const parts = root.querySelectorAll('[data-heading-part]');
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(parts, { clearProps: 'all' });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          parts,
          { autoAlpha: 0, y: motion.distance.mobile },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.duration.base,
            delay: root.getBoundingClientRect().top < window.innerHeight
              ? motion.routeEntryDelay
              : 0,
            stagger: motion.stagger.tight,
            ease: motion.ease.enter,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: root,
              start: motion.triggerStart,
              once: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={centered ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'}
    >
      <p
        data-heading-part
        className={`text-label uppercase ${light ? 'text-white/75' : 'text-primary'}`}
      >
        {eyebrow}
      </p>
      <h2
        data-heading-part
        className={`mt-2 font-display text-display ${
          light ? 'text-text-inverse' : 'text-text-base'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-heading-part
          className={`mt-4 text-body ${light ? 'text-text-inverse/80' : 'text-text-muted'}`}
          style={{ maxWidth }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
