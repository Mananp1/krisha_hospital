'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon, XIcon, ZoomInIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { GalleryImage, GalleryTile } from '@/app/data/gallery';
import MotionGroup from '@/app/animations/MotionGroup';

interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * Footprints in cells. Every shape is built from 1x2 / 2x1 / 1x1 / 2x2 blocks,
 * which is what lets the ten photos pack with no gaps at both 2 and 4 columns.
 * Changing the number of photos, their order or their `tile` will re-open holes
 * in the mosaic — re-check the packing if you do.
 */
const TILE_SPANS: Record<GalleryTile, string> = {
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  square: 'col-span-1 row-span-1',
  feature: 'col-span-2 row-span-2',
};

/** Rendered width of a tile, for the responsive image `sizes` hint. */
const TILE_SIZES: Record<GalleryTile, string> = {
  wide: '(min-width: 1440px) 620px, (min-width: 768px) 50vw, 100vw',
  feature: '(min-width: 1440px) 620px, (min-width: 768px) 50vw, 100vw',
  tall: '(min-width: 1440px) 310px, (min-width: 768px) 25vw, 50vw',
  square: '(min-width: 1440px) 310px, (min-width: 768px) 25vw, 50vw',
};

interface TileProps {
  image: GalleryImage;
  onOpen: () => void;
  priority?: boolean;
}

function Tile({ image, onOpen, priority }: TileProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View larger: ${image.caption}`}
      className="group relative block w-full h-full overflow-hidden rounded-lg lg:rounded-lg bg-primary-50 ring-1 ring-primary/10 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={TILE_SIZES[image.tile]}
        style={{ objectPosition: image.position ?? 'center' }}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        priority={priority}
      />

      {/* Depth scrim, always on */}
      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
      {/* Brand tint on hover / keyboard focus */}
      <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />

      <span className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-surface/85 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
        <ZoomInIcon size={14} />
      </span>

      <span className="absolute bottom-0 left-0 right-0 px-3.5 py-3 lg:px-4 lg:py-3.5 text-left text-text-inverse text-[12px] lg:text-[13px] font-semibold leading-snug">
        {image.caption}
      </span>
    </button>
  );
}

/**
 * Portfolio-style catalogue. Unlike a masonry, every tile sits on a shared row
 * grid, so rows stay flush and no photo hangs below its neighbours — the mix of
 * wide, tall, square and 2x2 footprints is what supplies the variety instead.
 * Tapping a tile opens the uncropped photo.
 */
export default function GalleryGrid({ images }: GalleryGridProps) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) =>
      setOpenAt((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openAt, step]);

  const current = openAt === null ? null : images[openAt];

  return (
    <>
      {/* Row heights track the fluid container so cells stay roughly square;
          they are pinned once max-w-page caps the container at xl. */}
      <MotionGroup
        hover
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[46vw] sm:auto-rows-[44vw] md:auto-rows-[23vw] lg:auto-rows-[22vw] xl:auto-rows-[15rem]"
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            data-motion-item
            className={TILE_SPANS[img.tile]}
          >
            <Tile image={img} onOpen={() => setOpenAt(i)} priority={i === 0} />
          </div>
        ))}
      </MotionGroup>

      {/* Lightbox */}
      <Dialog open={openAt !== null} onOpenChange={(open) => !open && setOpenAt(null)}>
        <DialogContent
          showCloseButton={false}
          className="inset-0 flex flex-col w-screen h-screen max-w-none sm:max-w-none translate-x-0 translate-y-0 rounded-none ring-0 shadow-none bg-primary-950/95 p-4 sm:p-6 lg:p-10 gap-4"
        >
          {current && (
            <>
              <DialogTitle className="sr-only">{current.caption}</DialogTitle>
              <DialogDescription className="sr-only">{current.alt}</DialogDescription>

              {/* Top bar */}
              <div className="flex items-center justify-between gap-4 shrink-0">
                <p className="text-[13px] sm:text-sm font-semibold text-text-inverse">
                  {current.caption}
                  <span className="ml-2 font-medium text-text-inverse/55">
                    {(openAt ?? 0) + 1} / {images.length}
                  </span>
                </p>
                <DialogClose
                  aria-label="Close gallery viewer"
                  className="w-9 h-9 rounded-full bg-white/10 text-text-inverse flex items-center justify-center hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors shrink-0"
                >
                  <XIcon size={18} />
                </DialogClose>
              </div>

              {/* Photo — uncropped */}
              <div className="relative flex-1 min-h-0">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="w-10 h-10 rounded-full bg-white/10 text-text-inverse flex items-center justify-center hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors"
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="w-10 h-10 rounded-full bg-white/10 text-text-inverse flex items-center justify-center hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors"
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
