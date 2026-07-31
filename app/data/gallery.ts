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
    src: '/gallery/reception-desk.jpg',
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
