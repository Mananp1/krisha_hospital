import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { heroCarouselImages } from '@/app/data/gallery';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import AnimatedNumber from '@/app/animations/AnimatedNumber';
import HeroMotion from '@/app/animations/HeroMotion';
import HeroCarousel from './HeroCarousel';

interface TrustItem {
  value: string;
  label: string;
  /** Only the "7+" figure counts up; the rest read as fixed symbols. */
  animate?: boolean;
}

export default function Hero() {
  const t = useTranslations('hero');

  const trust: TrustItem[] = [
    { value: '7+', label: t('trust.years'), animate: true },
    { value: '24×7', label: t('trust.emergency') },
    { value: '4.9', label: t('trust.rating') },
  ];

  return (
    <HeroMotion className="relative w-full overflow-hidden bg-primary-950">
      {/*
        ── Full-bleed backdrop ──
        The existing facility carousel, shown edge to edge. The whole layer
        scales in on load (HeroMotion) for the slow "Ken Burns" open.
      */}
      <div data-hero-backdrop className="absolute inset-0">
        <HeroCarousel
          images={heroCarouselImages}
          sizes="100vw"
          priority
          layout="fill"
        />
      </div>

      {/*
        ── Legibility overlay ──
        A plum wash so the white copy reads over any frame: a vertical
        gradient that deepens toward the foot where the CTAs and stats sit, and
        a left-to-right one that anchors the copy column. The solid header sits
        above the section now, so no top scrim is needed.
      */}
      <div data-hero-overlay aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-primary-950/45 via-primary-950/55 to-primary-950/85" />
        <div className="absolute inset-0 bg-linear-to-r from-primary-950/65 via-primary-950/30 to-transparent" />
      </div>

      {/* ── Copy ── */}
      <div className="relative mx-auto max-w-page px-5 lg:px-gutter">
        <div
          data-hero-copy
          className="flex min-h-[calc(100svh_-_8.25rem)] lg:min-h-[calc(100svh_-_9.375rem)] max-w-3xl flex-col items-start justify-center py-16"
        >
          {/* Eyebrow — translucent chip with a magenta marker. */}
          <span
            data-hero-line
            className="inline-flex items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3.5 py-1.5 text-label uppercase text-white backdrop-blur-sm"
          >
            <span aria-hidden="true" className="size-1.5 rounded-full bg-secondary-400" />
            Krisha Women&apos;s Hospital
          </span>

          {/*
            The three lines break rather than wrap — the magenta accent is the
            close of the promise, not a mid-sentence colour change.

            Each line is masked: an `overflow-hidden` wrapper around the
            animated span, so the entrance reads as a wipe-up reveal. The inner
            span carries a little bottom padding so descenders (the "y" in
            "journey", the "g" in "stage") aren't clipped by the mask at rest.
          */}
          <h1 className="mt-6 font-display text-display-lg text-white text-balance drop-shadow-sm">
            <span className="block overflow-hidden">
              <span data-hero-line className="block pb-[0.12em]">{t('titleLine1')}</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block pb-[0.12em]">{t('titleLine2')}</span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block pb-[0.12em] text-secondary-300">{t('titleLine3')}</span>
            </span>
          </h1>

          {/* CTAs — one solid magenta action, one quiet outline. */}
          <div data-hero-stat className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-7 py-4 h-auto text-body font-semibold hover:bg-secondary-600 shadow-float gap-2"
            >
              <Link href="/book-appointment">
                {t('bookAppointment')}
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-4 h-auto text-body font-semibold border-white/40 bg-white/5 text-white hover:bg-white hover:text-primary shadow-none backdrop-blur-sm"
            >
              <a href="#services">{t('exploreServices')}</a>
            </Button>
          </div>

          {/* Trust row — plain figures on the dark ground. */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/15 pt-7">
            {trust.map((item) => (
              <div key={item.label} data-hero-stat className="flex flex-col">
                <dd className="font-display text-display-sm text-white leading-none tabular-nums">
                  {item.animate ? <AnimatedNumber value={item.value} /> : item.value}
                </dd>
                <dt className="mt-1.5 text-meta text-white/70">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </HeroMotion>
  );
}
