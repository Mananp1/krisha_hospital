import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { galleryImages } from '@/app/data/gallery';
import FadeIn from './FadeIn';

const WHATSAPP = 'https://wa.me/917862950676';

function heroImage(name: string) {
  const image = galleryImages.find((i) => i.src === `/gallery/${name}.jpg`);
  if (!image) throw new Error(`Unknown hero image: ${name}`);
  return image;
}

/**
 * 1510x1030 — third crop of the reception desk. Renamed (not overwritten)
 * each time this file changes: browsers and next/image both cache by URL, so
 * replacing the bytes under the same name leaves visitors seeing the old
 * photo until the URL itself changes.
 */
const backdrop = heroImage('reception-desk-2');

interface TrustItem {
  value: string;
  label: string;
}

/** Shared between the mobile and desktop compositions below. */
function HeroCopy({ trust }: { trust: TrustItem[] }) {
  const t = useTranslations('hero');
  const tDoctor = useTranslations('doctorProfile');

  return (
    <>
      {/*
        The two lines break rather than wrap. Run inline, the magenta started
        mid-sentence wherever the text happened to reflow, which read as an
        accident instead of an emphasis.
      */}
      <h1 className="font-display text-display-lg text-text-base text-balance">
        <span className="block">{t('titleLine1')}</span>
        <span className="block text-secondary">{t('titleLine2')}</span>
      </h1>

      {/*
        No lead paragraph. The headline carries the promise on its own.
        `hero.lead` stays in all three catalogues — it is still used by the
        page metadata description.
      */}
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
          className="rounded-md px-7 py-3.5 h-auto text-body font-semibold bg-surface border-transparent text-primary hover:bg-primary hover:text-text-inverse shadow-none"
        >
          <Link href="/#services">{t('exploreServices')}</Link>
        </Button>
      </div>

      {/* Tertiary line, where the reference puts its partnership link. */}
      <Link
        href="/doctor"
        className="inline-flex items-center gap-2 mt-7 text-meta font-semibold text-text-base no-underline group"
      >
        {tDoctor('viewFullProfile')}
        <ArrowRightIcon
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      {/*
        Trust row. The reference has no such panel, but it was an explicit
        ask in the original brief, so it survives as a flat rule-separated
        line rather than a floating card.
      */}
      <dl className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 pt-7 border-t border-primary/12 w-full max-w-lg">
        {trust.map((item) => (
          <div key={item.label} className="flex items-baseline gap-2">
            <dt className="sr-only">{item.label}</dt>
            <dd className="font-display text-display-sm text-primary leading-none tabular-nums">
              {item.value}
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
    <section id="home" className="relative w-full bg-surface overflow-hidden">
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
        <div className="relative w-full aspect-4/3 sm:aspect-16/9">
          <Image
            src={backdrop.src}
            alt={backdrop.alt}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
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
          <FadeIn className="flex flex-col items-start">
            <HeroCopy trust={trust} />
          </FadeIn>
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
        {/* ── Full-bleed backdrop ── */}
        <Image
          src={backdrop.src}
          alt={backdrop.alt}
          fill
          sizes="100vw"
          priority
          /*
            Plain centre. At ~1.47:1 this frame is close enough to a typical
            wide hero box's aspect that object-cover crops mostly top/bottom
            rather than left/right. Revisit with a specific object-position
            if a particular viewport width crops into the desk or the
            signage.
          */
          className="object-cover object-center"
        />

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
          <FadeIn className="flex flex-col items-start max-w-2xl">
            <HeroCopy trust={trust} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
