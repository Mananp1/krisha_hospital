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

export default function Hero() {
  const t = useTranslations('hero');
  const tDoctor = useTranslations('doctorProfile');

  const trust = [
    { value: '20+', label: t('trust.years') },
    { value: '24×7', label: t('trust.emergency') },
  ];

  return (
    <section
      id="home"
      /*
        Capped below full viewport height: the backdrop is 1821x1030 (~1.77:1),
        noticeably less panoramic than the old 2400x1030 crop, and a taller
        band asks object-cover to blow the image up further than it should.
      */
      className="relative flex items-center min-h-160 lg:min-h-[min(88vh,50rem)] overflow-hidden bg-surface"
    >
      {/* ── Full-bleed backdrop ── */}
      <Image
        src={backdrop.src}
        alt={backdrop.alt}
        fill
        sizes="100vw"
        priority
        /*
          Plain centre. At ~1.77:1 this frame is close enough to a typical wide
          hero box's aspect that object-cover crops mostly top/bottom rather
          than left/right — unlike the old 2400x1030 (2.33:1) crop, which lost
          most of its height and needed a horizontal anchor tuned by hand to
          keep the desk in frame. Revisit with a specific object-position if a
          particular viewport width crops into the desk or the signage.
        */
        className="object-cover object-center"
      />

      {/*
        Left-to-right legibility wash, mobile-first. Below lg the copy column
        runs close to full viewport width (max-w-xl caps it at 36rem, wider
        than most phones and tablets), so the base wash stays fully opaque
        almost edge to edge — the photo shows only as a sliver, if at all.
        The previous version reused one set of stops everywhere and only
        swapped in a lighter `sm:` floor at 640px, which is well inside
        tablet width — that's what was letting the photo bleed through under
        the text on anything narrower than a laptop.

        Only at lg (1024px, where max-w-2xl becomes a much smaller fraction of
        the viewport) does the wash pull back to reveal the desk on the right.
        The end stop is `to-transparent`, not a tinted colour: `to-surface/55`
        is a *floor* — the gradient holds at 55% opacity from that point to
        the edge instead of clearing, so the whole right side sat under a
        permanent haze instead of showing the photo untouched. transparent has
        no such floor; once the fade reaches it, nothing is added past that
        point, so the desk and signage render exactly as shot.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-linear-to-r from-surface via-surface via-88% to-surface/85 lg:from-34% lg:via-surface/60 lg:via-52% lg:to-transparent lg:to-70%"
      />

      {/*
        Top-down wash, for the overlay navbar. The nav is transparent while
        unscrolled (NavBar's `overlay` mode) and sits on whatever the backdrop
        shows at the very top of the frame — this gives the logo and links a
        consistent light backdrop instead of depending on ceiling lights or
        dark fixtures landing directly behind them. Sized to the tallest nav
        breakpoint (xl:h-27 = 108px) plus room to fade out before it reaches
        the headline.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-56 pointer-events-none bg-linear-to-b from-surface/85 from-0% to-transparent to-100%"
      />

      {/*
        Bottom-up wash, so the section blends into Services instead of the
        photo cutting straight to a flat white edge. Short — this only needs
        to soften the seam, not cover meaningful photo — and lands on plain
        `surface`, matching Services' own top colour exactly so the join is
        invisible rather than landing on a second, slightly different white.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 lg:h-32 pointer-events-none bg-linear-to-t from-surface to-transparent"
      />

      {/* ── Copy ── */}
      <div className="relative w-full max-w-page mx-auto px-5 lg:px-gutter pt-28 lg:pt-32">
        <FadeIn className="flex flex-col items-start max-w-xl lg:max-w-2xl">
          {/*
            The two lines break rather than wrap. Run inline, the magenta
            started mid-sentence wherever the text happened to reflow, which
            read as an accident instead of an emphasis.
          */}
          <h1 className="font-display text-display-lg text-text-base text-balance">
            <span className="block">{t('titleLine1')}</span>
            <span className="block text-secondary">{t('titleLine2')}</span>
          </h1>

          {/*
            No lead paragraph. The headline carries the promise on its own, and
            dropping it lets the wash pull back far enough for the reception
            desk to read. `hero.lead` stays in all three catalogues — it is
            still used by the page metadata description.
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
            line rather than a floating card — which would have put a container
            back on top of the photograph.
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
        </FadeIn>
      </div>
    </section>
  );
}
