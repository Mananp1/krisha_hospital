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
 * 1821x1030 — the reception crop, straightened and tightened so the desk and
 * the "KRISHA WOMEN'S HOSPITAL" signage sit inside frame without the glass
 * door on the previous wide crop's right edge.
 */
const backdrop = heroImage('reception-desk');

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
