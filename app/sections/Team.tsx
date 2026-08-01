import Image from 'next/image';
import { useTranslations } from 'next-intl';
import MotionGroup from '@/app/animations/MotionGroup';
import SectionHeader from './SectionHeader';

interface TeamPhoto {
  src: string;
  caption: string;
  /** Grid footprint. The feature is 2x2; the rest are 1x1. */
  span: string;
  /** object-position for the crop. */
  position: string;
}

/**
 * "Meet the team." A controlled mosaic rather than the gallery's packed one:
 * a single 2x2 feature plus four 1x1 tiles fills a 4x2 block (and a 2x4 block
 * at the mobile two-column width) with no gaps, so it never needs the fragile
 * ordering the facility gallery does.
 */
export default function Team() {
  const t = useTranslations('teamSection');

  const photos: TeamPhoto[] = [
    {
      src: '/gallery/staff/web/staff-5.jpg',
      caption: t('captions.team'),
      span: 'col-span-2 row-span-2',
      position: 'center',
    },
    {
      src: '/gallery/staff/web/staff-2.jpg',
      caption: t('captions.doctor'),
      span: 'col-span-1 row-span-1',
      position: 'center',
    },
    {
      src: '/gallery/staff/web/staff-4.jpg',
      caption: t('captions.nurses'),
      span: 'col-span-1 row-span-1',
      position: 'center',
    },
    {
      src: '/gallery/staff/web/staff-3.jpg',
      caption: t('captions.consult'),
      span: 'col-span-1 row-span-1',
      position: 'center',
    },
    {
      src: '/gallery/staff/web/staff-1.jpg',
      caption: t('captions.doctorPortrait'),
      span: 'col-span-1 row-span-1',
      position: 'top',
    },
  ];

  return (
    <section id="team" className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <MotionGroup
          hover
          className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[42vw] sm:auto-rows-[40vw] lg:auto-rows-[13.5rem]"
        >
          {photos.map((photo, index) => (
            <div key={photo.src} data-motion-item className={photo.span}>
              <div className="group relative block w-full h-full overflow-hidden rounded-lg bg-primary-50 ring-1 ring-primary/10">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes={
                    index === 0
                      ? '(min-width: 1024px) 640px, 100vw'
                      : '(min-width: 1024px) 320px, 50vw'
                  }
                  style={{ objectPosition: photo.position }}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Depth scrim so the caption stays legible on any frame. */}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                <span className="absolute bottom-0 left-0 right-0 px-4 py-3.5 text-left text-text-inverse text-[12.5px] lg:text-[13.5px] font-semibold leading-snug">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </MotionGroup>
      </div>
    </section>
  );
}
