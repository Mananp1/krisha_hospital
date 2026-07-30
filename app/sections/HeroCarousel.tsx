'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { GalleryImage } from '@/app/data/gallery';

interface HeroCarouselProps {
  slides: GalleryImage[];
  /** Milliseconds each slide stays on screen. */
  interval?: number;
  className?: string;
}

const SWIPE_THRESHOLD = 40;

export default function HeroCarousel({
  slides,
  interval = 5000,
  className,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduceMotion) return;

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [paused, interval, slides.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    }
  };

  return (
    <div
      className={className}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photos of Krisha Women's Hospital"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null) return;
        const delta = e.changedTouches[0].clientX - start;
        if (Math.abs(delta) > SWIPE_THRESHOLD) go(index + (delta < 0 ? 1 : -1));
      }}
    >
      {/* Slides — cross-fade, all mounted so the browser can preload them */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
            style={{ objectPosition: slide.position ?? 'center' }}
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Bottom scrim so the caption and controls stay legible */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/55 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Caption */}
      <p className="absolute left-5 bottom-5 lg:left-6 lg:bottom-6 text-text-inverse text-[13px] lg:text-sm font-semibold drop-shadow-sm pr-28">
        {slides[index].caption}
      </p>

      {/* Prev / next */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-surface/80 backdrop-blur-sm text-primary flex items-center justify-center shadow-sm hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-surface/80 backdrop-blur-sm text-primary flex items-center justify-center shadow-sm hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors"
          >
            <ChevronRightIcon size={18} />
          </button>

          {/* Dots */}
          <div className="absolute right-5 bottom-5 lg:right-6 lg:bottom-6 z-10 flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to photo ${i + 1}: ${slide.caption}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  i === index ? 'w-6 bg-secondary' : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
