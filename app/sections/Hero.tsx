import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { galleryImages } from '@/app/data/gallery';
import FadeIn from './FadeIn';

const WHATSAPP = 'https://wa.me/917862950676';

/** One dominant frame and one supporting frame — not four of equal weight. */
function heroImage(name: string) {
  const image = galleryImages.find((i) => i.src === `/gallery/${name}.jpg`);
  if (!image) throw new Error(`Unknown hero image: ${name}`);
  return image;
}

const dominant = heroImage('reception-waiting-lounge');
const supporting = heroImage('consulting-room-entrance');

export default function Hero() {
  const t = useTranslations('hero');

  const trust = [
    { value: '20+', label: t('trust.years') },
    { value: '24×7', label: t('trust.emergency') },
    { value: '4.9', label: t('trust.rating') },
  ];

  return (
    <section
      id="home"
      className="w-full bg-surface-subtle py-section-sm lg:py-section-lg"
    >
      {/*
        Asymmetric split — the copy column is narrower than the image column and
        both are left-aligned. This replaces a centred layout fronted by a
        four-slide carousel, where no single image carried the page.
      */}
      <div className="max-w-page mx-auto px-5 lg:px-gutter grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-12 lg:gap-16 xl:gap-20 items-center">
        {/* ── Copy ── */}
        <FadeIn className="flex flex-col items-start">
          <h1 className="font-display text-display-lg text-text-base">
            {t('titleLine1')}{' '}
            <span className="text-secondary">{t('titleLine2')}</span>
          </h1>

          <p className="mt-6 text-lead text-text-muted max-w-measure">
            {t('lead')}
          </p>

          <div className="flex items-center gap-3 mt-9 flex-wrap">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-body font-semibold hover:bg-secondary-600 shadow-none"
            >
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {t('bookAppointment')}
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-body font-semibold border border-primary/30 text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <Link href="/#services">{t('exploreServices')}</Link>
            </Button>
          </div>
        </FadeIn>

        {/* ── Photography ── */}
        <FadeIn delay={0.15} direction="up" className="relative">
          {/*
            Indented on the left so the supporting frame overlaps it from inside
            the column. No negative offsets, so nothing can push the page
            sideways at awkward widths.
          */}
          <div className="relative aspect-4/3 sm:ml-16 lg:ml-20 rounded-xl overflow-hidden bg-primary-50">
            <Image
              src={dominant.src}
              alt={dominant.alt}
              fill
              sizes="(min-width: 1024px) 620px, (min-width: 640px) 80vw, 100vw"
              style={{ objectPosition: dominant.position ?? 'center' }}
              className="object-cover"
              priority
            />
          </div>

          {/* Supporting frame — the arch, brand device B1. Photography only. */}
          <div className="hidden sm:block absolute left-0 bottom-0 w-32 lg:w-40 aspect-3/4 arch overflow-hidden bg-primary-50 ring-4 ring-surface-subtle">
            <Image
              src={supporting.src}
              alt={supporting.alt}
              fill
              sizes="160px"
              style={{ objectPosition: supporting.position ?? 'center' }}
              className="object-cover"
            />
          </div>

          {/*
            Trust panel — floats over the dominant frame from sm up, and reflows
            underneath on mobile, where an overlay would cover the photograph.
          */}
          <div className="mt-5 sm:mt-0 sm:absolute sm:right-0 sm:-bottom-5 flex items-center bg-surface rounded-md shadow-card px-2 py-3 sm:px-3">
            {trust.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center px-3 sm:px-4 border-l border-border-muted first:border-l-0"
              >
                <span className="font-display text-display-sm text-primary tabular-nums leading-none">
                  {item.value}
                </span>
                <span className="mt-1.5 text-label uppercase text-text-muted whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
