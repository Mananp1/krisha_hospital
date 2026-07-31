import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { services } from '@/app/data/services';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

/**
 * All thirteen services as one unified panel, not a grid of separate floating
 * cards. Icons added noise, not meaning — "cervical cerclage" and "family
 * planning" don't have a distinct glyph that tells a visitor anything the
 * title doesn't already say — so this reads on title + description alone.
 *
 * The first service takes its own full-width row rather than a partial span:
 * 13 is prime, so any card spanning less than the full grid width leaves an
 * uneven last row at *some* breakpoint. A full-width banner leaves exactly
 * twelve behind it, and 12 divides cleanly by 1, 2, 3 and 4 columns — every
 * breakpoint's grid is a complete rectangle, nothing trails off short.
 *
 * No gaps between cells: a single bordered panel (border-t/border-l on the
 * container, border-r/border-b on every cell) reads as one continuous
 * structure with hairline dividers, rather than a scattered set of separately
 * elevated cards. Each cell contributes only its own right and bottom edge,
 * so no internal boundary ever draws twice.
 */
export default function Services() {
  const t = useTranslations('servicesSection');
  const [banner, ...rest] = services;

  return (
    <section id="services" className="w-full bg-linear-to-b from-surface from-85% to-surface-subtle py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          centered={false}
          maxWidth={620}
        />

        <div className="mt-12 border-t border-l border-border-muted rounded-lg overflow-hidden">
          {/* ── Banner — the flagship speciality, its own full-width row ── */}
          <FadeIn direction="up">
            <Link
              href={`/services/${banner.slug}`}
              className="group flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-10 border-r border-b border-border-muted bg-surface p-7 lg:p-9 no-underline transition-colors hover:bg-primary-50/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary"
            >
              <h3 className="text-title font-semibold text-text-base leading-snug shrink-0 lg:w-80">
                {t(`cards.${banner.slug}.title`)}
              </h3>
              <p className="text-meta text-text-muted lg:flex-1">
                {t(`cards.${banner.slug}.desc`)}
              </p>
              <span className="inline-flex items-center gap-1.5 text-meta font-semibold text-secondary shrink-0">
                {t('learnMore')}
                <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </FadeIn>

          {/* ── The remaining twelve ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((s, i) => (
              <FadeIn key={s.slug} direction="up" delay={i < 4 ? i * 0.05 : 0}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex flex-col h-full border-r border-b border-border-muted bg-surface p-7 no-underline transition-colors hover:bg-primary-50/40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-secondary"
                >
                  <h3 className="text-body font-semibold text-text-base leading-snug">
                    {t(`cards.${s.slug}.title`)}
                  </h3>
                  <p className="mt-2 text-meta text-text-muted grow">
                    {t(`cards.${s.slug}.desc`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-meta font-semibold text-secondary">
                    {t('learnMore')}
                    <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
