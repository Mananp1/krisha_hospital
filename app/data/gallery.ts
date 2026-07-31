import type { StaticImageData } from 'next/image';
import receptionDeskHero from '@/public/gallery/reception-desk-hero.jpg';
import sonographyRoomHero from '@/public/gallery/sonography-room-hero.jpg';
import procedureRoomHero from '@/public/gallery/procedure-room-hero.jpg';

/**
 * Photo catalogue for the /gallery page, the home page "Our Facility" strip
 * and the two frames in the hero composition.
 *
 * The camera originals were 21:9 ultra-wide frames, some shot vertically and
 * flagged with EXIF orientation. They have since been rotated, downscaled to a
 * 2400px long edge and re-encoded, so what is on disk is what the visitor sees:
 * landscape files are 2400x1030, portrait files 1030x2400. Unprocessed
 * originals live in assets/gallery-originals/ (git-ignored).
 */
export type GalleryOrientation = 'landscape' | 'portrait';

/**
 * Footprint in the /gallery mosaic. The set below is chosen so the tiles pack
 * with no gaps at both 2 and 4 columns — see `TILE_SPANS` in GalleryGrid.
 */
export type GalleryTile = 'wide' | 'tall' | 'square' | 'feature';

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  orientation: GalleryOrientation;
  tile: GalleryTile;
  /** CSS object-position, for frames that need a tighter crop than centre. */
  position?: string;
}

/**
 * Order is load-bearing: the grid places tiles in DOM order, and this sequence
 * is what makes the mosaic tile exactly at 2 and 4 columns.
 */
export const galleryImages: GalleryImage[] = [
  {
    src: '/gallery/reception-desk-2.jpg',
    alt: "Reception desk and patient waiting lounge at Krisha Women's Hospital, Narol",
    caption: 'Reception & Waiting Lounge',
    orientation: 'landscape',
    tile: 'wide',
  },
  {
    src: '/gallery/consulting-room-entrance.jpg',
    alt: "Entrance to Dr. Alhad Pande's consulting room at Krisha Women's Hospital",
    caption: 'Consulting Room',
    orientation: 'portrait',
    tile: 'tall',
  },
  {
    src: '/gallery/patient-waiting-area.jpg',
    alt: "Seating in the patient waiting area outside the special rooms at Krisha Women's Hospital",
    caption: 'Patient Waiting Area',
    orientation: 'portrait',
    tile: 'tall',
  },
  {
    src: '/gallery/operation-theatre.jpg',
    alt: "Modular operation theatre with surgical light and operating table at Krisha Women's Hospital",
    caption: 'Operation Theatre',
    orientation: 'portrait',
    tile: 'feature',
  },
  {
    src: '/gallery/sonography-room.jpg',
    alt: "Sonography room with ultrasound machine and examination couch at Krisha Women's Hospital",
    caption: 'Sonography Room',
    orientation: 'landscape',
    tile: 'wide',
  },
  {
    src: '/gallery/pharmacy-counter.jpg',
    alt: "In-house Krisha Pharmacy counter and attendant seating at Krisha Women's Hospital",
    caption: 'In-House Pharmacy',
    orientation: 'portrait',
    tile: 'tall',
  },
  {
    src: '/gallery/ultrasound-suite.jpg',
    alt: "Ultrasound suite with colour Doppler machine at Krisha Women's Hospital",
    caption: 'Ultrasound Suite',
    orientation: 'portrait',
    tile: 'tall',
  },
  {
    src: '/gallery/ultrasound-console.jpg',
    alt: "Ultrasound console and reporting printer in the sonography suite at Krisha Women's Hospital",
    caption: 'Ultrasound Console',
    orientation: 'portrait',
    tile: 'square',
  },
  {
    src: '/gallery/sonography-machine.jpg',
    alt: "Colour Doppler sonography machine and PC-PNDT notice at Krisha Women's Hospital",
    caption: 'Sonography Equipment',
    orientation: 'portrait',
    tile: 'square',
  },
  {
    src: '/gallery/procedure-room.jpg',
    alt: "Procedure room with obstetric examination table at Krisha Women's Hospital",
    caption: 'Procedure & Examination Room',
    orientation: 'landscape',
    tile: 'wide',
  },
];

/** The three frames shown in the home page "Our Facility" preview strip. */
export const galleryPreview: GalleryImage[] = galleryImages.filter(
  (i) => i.orientation === 'landscape',
);

/**
 * A hero frame. Statically imported rather than referenced by path string,
 * because the hero needs each frame's intrinsic aspect ratio at render time
 * to size and fade it individually — see HeroCarousel. Static imports carry
 * `width`/`height` from the file itself, so re-cropping a frame only needs a
 * rebuild; there are no hardcoded dimensions here to fall out of date.
 */
export interface HeroImage {
  src: StaticImageData;
  alt: string;
}

/**
 * Frames for the hero carousel only — the `*-hero.jpg` crops, all cut to
 * 16:9. They are separate files from the `/gallery` catalogue on purpose:
 * pointing the hero at `galleryPreview` put the exact same three crops in
 * both the hero and the "Our Facility" strip a couple of scrolls apart, and
 * the two mirrored frames are flipped left/right relative to their gallery
 * counterparts, so the hero reads as a distinct pass over the hospital
 * rather than a rerun of the strip below it.
 *
 * The shared aspect ratio is what keeps the composition steady: the hero
 * pins each frame to the right edge and sizes it from its own ratio, so
 * frames of differing widths would start at different points and the left
 * edge would jump on every slide change.
 */
export const heroCarouselImages: HeroImage[] = [
  {
    src: receptionDeskHero,
    alt: "Reception desk and patient waiting lounge at Krisha Women's Hospital, Narol",
  },
  {
    src: sonographyRoomHero,
    alt: "Sonography room with ultrasound machine and examination couch at Krisha Women's Hospital",
  },
  {
    src: procedureRoomHero,
    alt: "Procedure room with obstetric examination table at Krisha Women's Hospital",
  },
];
