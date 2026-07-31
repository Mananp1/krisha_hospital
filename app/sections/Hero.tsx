import { useTranslations } from 'next-intl';
import { heroCarouselImages } from '@/app/data/gallery';
import AnimatedNumber from '@/app/animations/AnimatedNumber';
import HeroMotion from '@/app/animations/HeroMotion';
import HeroCarousel from './HeroCarousel';

interface TrustItem {
  value: string;
  label: string;
}

/** Shared between the mobile and desktop compositions below. */
function HeroCopy({ trust }: { trust: TrustItem[] }) {
  const t = useTranslations('hero');

  return (
    <>
      {/*
        The three lines break rather than wrap. Run inline, the magenta started
        mid-sentence wherever the text happened to reflow, which read as an
        accident instead of an emphasis.
      */}
      <h1 className="font-display text-display-lg text-text-base text-balance">
        <span data-hero-line className="block">{t('titleLine1')}</span>
        <span data-hero-line className="block">{t('titleLine2')}</span>
        <span data-hero-line className="block text-secondary">{t('titleLine3')}</span>
      </h1>

      {/*
        No lead paragraph. The headline carries the promise on its own.
        `hero.lead` stays in all three catalogues — it is still used by the
        page metadata description.
      */}
      {/*
        Trust row. A bare border-t line above two floating numbers read as a
        stray rule rather than a group, especially now that the backdrop is
        a carousel rather than one fixed photo — each stat is its own
        bordered chip instead, so the pair reads as one unit regardless of
        what's behind it.
      */}
      <dl className="flex flex-wrap gap-3 mt-8 w-full max-w-lg">
        {trust.map((item) => (
          <div
            key={item.label}
            data-hero-stat
            className="flex items-baseline gap-2 rounded-md border border-border-muted/70 bg-surface/85 backdrop-blur-sm px-4 py-2.5"
          >
            <dt className="sr-only">{item.label}</dt>
            <dd className="font-display text-display-sm text-primary leading-none tabular-nums">
              {item.value.startsWith('20')
                ? <AnimatedNumber value={item.value} />
                : item.value}
            </dd>
            <span aria-hidden="true" className="text-meta text-text-muted">
              {item.label}
            </span>
          </div>
        ))}
      </dl>
    </>
  );
}

export default function Hero() {
  const t = useTranslations('hero');

  const trust: TrustItem[] = [
    { value: '20+', label: t('trust.years') },
    { value: '24×7', label: t('trust.emergency') },
  ];

  return (
    <HeroMotion className="relative w-full bg-surface overflow-hidden">
      {/*
        ── Below lg: stacked, not overlaid ──
        The left-right wash on the desktop composition below has to stay
        almost fully opaque at these widths just to keep the headline
        readable — the copy column runs close to full viewport width on a
        phone or tablet, so there's no room for text beside a visible photo.
        That wash was doing its job, but it also meant the reception desk
        was never actually visible below lg: a dense, near-solid tint over
        the whole photo the whole time.

        Below lg the photo and the copy split into two stacked blocks instead
        of one overlaid composition: the photo shown clean, at full colour,
        with the nav floating over its top edge and the copy following
        directly below — so the fades on the photo run top-to-bottom (into
        the nav above, into the copy below) rather than left-to-right (there
        is no text on top of it to protect).
      */}
      <div className="lg:hidden">
        <div data-hero-image="mobile" className="relative w-full aspect-4/3 sm:aspect-16/9">
          {/*
            Filled, not fitted. The block is only ~390px wide on a phone
            while the narrowest frame is over 1100px, so covering it crops
            but never enlarges — there is no zoom to avoid here, and fitting
            each frame would shrink it into a fraction of an already small
            block.
          */}
          <HeroCarousel
            images={heroCarouselImages}
            sizes="100vw"
            priority
            layout="fill"
          />

          {/* Top fade — the nav floats transparently over this edge. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-24 pointer-events-none bg-linear-to-b from-surface/80 to-transparent"
          />

          {/* Bottom fade — into the copy block directly below. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none bg-linear-to-t from-surface to-transparent"
          />
        </div>

        <div className="px-5 pt-8 pb-14">
          <div data-hero-copy="mobile" className="flex flex-col items-start">
            <HeroCopy trust={trust} />
          </div>
        </div>
      </div>

      {/*
        ── lg and up: the original overlaid composition ──
        Unchanged: one full-bleed photo behind the copy, held legible with a
        left-to-right wash for the text and a top-down wash for the nav.
      */}
      <div
        className="hidden lg:flex relative items-center overflow-hidden lg:min-h-[min(88vh,50rem)]"
      >
        {/*
          ── Backdrop ──
          Fitted and pinned right. The cropped frames are much narrower than
          this box, so filling it would enlarge them — the zoom that made the
          crops look wrong. Fitting keeps each frame at its own proportions
          and puts the leftover width entirely on the left, under the copy,
          so the photo runs flush to the right edge with nothing beside it.
          Each frame carries its own left dissolve into `surface`, since the
          three crops differ in width and so start at different points.
        */}
        <div data-hero-image="desktop" className="absolute inset-0">
          <HeroCarousel
            images={heroCarouselImages}
            sizes="100vw"
            priority
            layout="fit-right"
          />
        </div>

        {/*
          Left-to-right legibility wash. Solid through 34%, still 60% opaque
          through 52%, then clears to `to-transparent` — not a tinted floor —
          by 70%, so the desk and signage on the right render exactly as
          shot, with nothing added past that point.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-linear-to-r from-surface from-34% via-surface/60 via-52% to-transparent to-70%"
        />

        {/*
          Top-down wash, for the overlay navbar. The nav is transparent while
          unscrolled (NavBar's `overlay` mode) and sits on whatever the
          backdrop shows at the very top of the frame — this gives the logo
          and links a consistent light backdrop instead of depending on
          ceiling lights or dark fixtures landing directly behind them. Sized
          to the tallest nav breakpoint (xl:h-27 = 108px) plus room to fade
          out before it reaches the headline.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-56 pointer-events-none bg-linear-to-b from-surface/85 from-0% to-transparent to-100%"
        />

        {/*
          Bottom-up wash, so the section blends into Services instead of the
          photo cutting straight to a flat white edge. Lands on plain
          `surface`, matching Services' own top colour exactly, so the join
          is invisible rather than landing on a second, slightly different
          white.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-72 pointer-events-none bg-linear-to-t from-surface to-transparent"
        />

        {/* ── Copy ── */}
        <div className="relative w-full max-w-page mx-auto px-gutter pt-32">
          <div data-hero-copy="desktop" className="flex flex-col items-start max-w-2xl">
            <HeroCopy trust={trust} />
          </div>
        </div>
      </div>
    </HeroMotion>
  );
}
