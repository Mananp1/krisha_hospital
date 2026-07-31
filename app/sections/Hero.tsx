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

/** The widest frame in the library — 2400x1030 carries a full-bleed band. */
const backdrop = heroImage('reception-waiting-lounge');

export default function Hero() {
  const t = useTranslations('hero');
  const tDoctor = useTranslations('doctorProfile');

  const trust = [
    { value: '20+', label: t('trust.years') },
    { value: '24×7', label: t('trust.emergency') },
    { value: '4.9', label: t('trust.rating') },
  ];

  return (
    <section
      id="home"
      /*
        Capped below full viewport height: the backdrop is 2400x1030, so a
        taller band crops it hard vertically and throws away the room.
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
          The desk sits at roughly 35–65% across the source frame.

          Wide: anchored hard left. The copy wash covers the left half of the
          viewport, so at 42% the desk still landed underneath it and only the
          glass door and PULL sign showed. Pinning left slides the whole frame
          right, clearing the desk of the wash and dropping the door off the
          right edge entirely.

          Narrow: centred. A tall viewport crops this 2400x1030 frame to a thin
          vertical slice, and the left edge of that slice is a notice board —
          centring lands the slice on the desk instead.
        */
        className="object-cover object-center sm:object-left"
      />

      {/*
        Legibility wash. Text sits on the opaque end, never on the photograph —
        the copy column is capped well inside where the gradient is still solid,
        so contrast does not depend on what the image happens to show. Mobile
        gets a heavier tail because the column occupies more of the frame.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-surface from-15% via-surface/88 via-40% to-surface/20 to-68% sm:to-transparent"
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
