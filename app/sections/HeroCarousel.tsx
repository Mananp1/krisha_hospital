'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import type { HeroImage } from '@/app/data/gallery';

interface HeroCarouselProps {
  images: HeroImage[];
  sizes: string;
  priority?: boolean;
  /**
   * `fill` — each frame covers the whole box, cropping as needed.
   * `fit-right` — each frame keeps its own proportions, sits flush against
   * the right edge, and dissolves into the section background on its left.
   *
   * The two hero compositions need opposite treatment, so neither can be
   * hardcoded here; see the call sites in Hero.tsx for why each picks what
   * it does.
   */
  layout?: 'fill' | 'fit-right';
}

export default function HeroCarousel({
  images,
  sizes,
  priority = false,
  layout = 'fill',
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || isPaused || images.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [images.length, isPaused, reduceMotion]);

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  const fitRight = layout === 'fit-right';

  return (
    <div
      className="absolute inset-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Krisha Women's Hospital facilities"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {images.map((image, index) => (
        /*
          In `fit-right`, each frame gets its own wrapper sized to that
          frame's aspect ratio and pinned to the right edge. The height is
          definite (inset-y-0), so the width follows from `aspect-ratio` —
          which means the wrapper's left edge lands exactly where the photo
          actually starts, and it moves per frame as the crops differ. A
          section-wide gradient cannot do this: the three frames start at
          very different points across the viewport, so one fixed gradient
          position can only ever line up with one of them.
        */
        <div
          key={image.src.src}
          className={`${
            fitRight ? 'absolute inset-y-0 right-0' : 'absolute inset-0'
          } transition-opacity duration-700 motion-reduce:transition-none ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={
            fitRight
              ? { aspectRatio: `${image.src.width} / ${image.src.height}` }
              : undefined
          }
        >
          <Image
            src={image.src}
            alt={index === activeIndex ? image.alt : ''}
            fill
            sizes={sizes}
            priority={priority && index === 0}
            className="object-cover object-center"
          />

          {/*
            Left dissolve, drawn on the frame itself rather than the section,
            so it is anchored to this photo's own left edge. Fully opaque at
            that edge and clearing to nothing across the next third of the
            frame, so the boundary between photo and section background never
            resolves into a visible vertical line.
          */}
          {fitRight && (
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-2/5 pointer-events-none bg-linear-to-r from-surface from-0% via-surface/70 via-35% to-transparent to-100%"
            />
          )}
        </div>
      ))}

      {images.length > 1 && (
        <div className="absolute right-4 bottom-5 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={showPrevious}
            className="w-11 h-11 rounded-full bg-surface/90 text-primary flex items-center justify-center shadow-card hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Show previous hospital photo"
          >
            <ChevronLeftIcon size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            className="w-11 h-11 rounded-full bg-surface/90 text-primary flex items-center justify-center shadow-card hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Show next hospital photo"
          >
            <ChevronRightIcon size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
