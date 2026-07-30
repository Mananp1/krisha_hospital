import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  featuredServices,
  serviceGroups,
  servicesInGroup,
} from '@/app/data/services';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

/**
 * Thirteen services, no longer thirteen identical cards.
 *
 * Five specialities take large bento cells — the first one wide — and the
 * remaining eight sit in a compact grid grouped by care pathway. Nothing is
 * hidden or removed; every service is still one click away. Only the hierarchy
 * changed, so a visitor can tell at a glance what the hospital is known for.
 *
 * No imagery on the featured cards: the photo library is facility shots, and
 * captioning a waiting room as "Pregnancy & Maternity Care" would be
 * misleading. Strong icons carry them instead.
 */
export default function Services() {
  const t = useTranslations('servicesSection');

  return (
    <section id="services" className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          centered={false}
          maxWidth={620}
        />

        {/* ── Featured five ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {featuredServices.map(({ slug, Icon }, i) => (
            <FadeIn
              key={slug}
              direction="up"
              delay={i < 3 ? i * 0.06 : 0}
              /* The first card spans two columns, so five cards fill two rows
                 of three exactly — 2+1 then 1+1+1. */
              className={cn(i === 0 && 'lg:col-span-2')}
            >
              <Link
                href={`/services/${slug}`}
                className="group flex flex-col h-full p-7 lg:p-8 rounded-md bg-surface border border-border-muted no-underline transition-colors hover:border-primary/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                <div className="w-12 h-12 rounded-md bg-primary-50 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-text-inverse">
                  <Icon size={26} />
                </div>

                <h3
                  className={cn(
                    'mt-5 font-semibold text-text-base leading-snug',
                    i === 0 ? 'text-title' : 'text-body',
                  )}
                >
                  {t(`cards.${slug}.title`)}
                </h3>

                <p className="mt-2 text-meta text-text-muted grow">
                  {t(`cards.${slug}.desc`)}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-meta font-semibold text-secondary">
                  {t('learnMore')}
                  <ArrowRightIcon
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* ── The remaining eight, grouped by care pathway ── */}
        <FadeIn direction="up" className="mt-12 pt-10 border-t border-border-muted">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {serviceGroups.map((group) => (
              <div key={group}>
                <h3 className="text-label uppercase text-text-subtle">
                  {t(`groups.${group}`)}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {servicesInGroup(group).map(({ slug, Icon }) => (
                    <li key={slug}>
                      <Link
                        href={`/services/${slug}`}
                        className="group flex items-start gap-2.5 text-meta text-text-base no-underline hover:text-secondary transition-colors"
                      >
                        <Icon
                          size={17}
                          className="mt-px shrink-0 text-primary/45 transition-colors group-hover:text-secondary"
                        />
                        <span className="leading-snug">
                          {t(`cards.${slug}.title`)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
