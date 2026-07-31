import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { services } from '@/app/data/services';
import { cn } from '@/lib/utils';
import MotionGroup from '@/app/animations/MotionGroup';
import SectionHeader from './SectionHeader';

/*
 * Stable bento rhythms on a twelve-column grid:
 *
 * Laptop:
 *   3 / 2 / 3 / 2 / 3 cards per row
 *
 * Wide desktop:
 *   4 / 2 / 3 / 4 cards per row
 *
 * Longer descriptions are assigned to the wider two-card and three-card rows.
 * The order is derived deterministically from translated copy, so it remains
 * stable for each locale and never reshuffles after hydration.
 */
const responsiveSpanClasses = [
  'lg:col-span-4 xl:col-span-3',
  'lg:col-span-4 xl:col-span-3',
  'lg:col-span-4 xl:col-span-3',
  'lg:col-span-6 xl:col-span-3',
  'lg:col-span-6 xl:col-span-6',
  'lg:col-span-4 xl:col-span-6',
  'lg:col-span-4 xl:col-span-4',
  'lg:col-span-4 xl:col-span-4',
  'lg:col-span-6 xl:col-span-4',
  'lg:col-span-6 xl:col-span-3',
  'lg:col-span-4 xl:col-span-3',
  'lg:col-span-4 xl:col-span-3',
  'sm:col-span-2 lg:col-span-4 xl:col-span-3',
] as const;

export default function Services() {
  const t = useTranslations('servicesSection');
  const translatedServices = services.map((service) => ({
    ...service,
    title: t(`cards.${service.slug}.title`),
    description: t(`cards.${service.slug}.desc`),
  }));
  const byDescriptionLength = [...translatedServices].sort(
    (a, b) => b.description.length - a.description.length,
  );
  const twoCardRow = byDescriptionLength.slice(0, 2);
  const threeCardRow = byDescriptionLength.slice(2, 5);
  const fourCardRows = byDescriptionLength.slice(5);
  const orderedServices = [
    ...fourCardRows.slice(0, 4),
    ...twoCardRow,
    ...threeCardRow,
    ...fourCardRows.slice(4),
  ];

  return (
    <section
      id="services"
      className="w-full bg-linear-to-b from-surface from-85% to-surface-subtle py-12 md:py-16 lg:py-20"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <SectionHeader
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          centered={false}
          maxWidth={620}
        />

        <div className="mt-9">
          {/*
            Dividers between cards only — no border around the panel.

            Rather than bordering each cell and trimming the outside edges,
            the grid itself is the divider colour and `gap-px` lets it show
            through in the 1px seams between cells. A gap exists only
            *between* tracks, never outside them, so the outer edge cannot
            draw by construction — no per-cell "is this the last column"
            logic, which the varying column spans below would make fragile.

            This relies on every row filling its 12 columns exactly (3/2/3/2/3
            at lg, 4/2/3/4 at xl); a short row would leave the divider colour
            showing as a block rather than a line.
          */}
          <MotionGroup
            hover
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-px bg-border-muted"
          >
            {orderedServices.map(({ slug, title, description }, index) => (
              <div
                key={slug}
                data-motion-item
                /*
                  No background on this wrapper — deliberately.

                  It used to carry `bg-surface` while the Link inside carried
                  its own, so two backgrounds were stacked on the element
                  being scaled. On hover the Link turns dark while this stayed
                  white, and sub-pixel rounding of the scaled box let a
                  hairline of that white show past the Link's edge: the flash
                  of white border during the scale. The Link already fills
                  this wrapper (`h-full`, block-level), so the wrapper's own
                  background was never visible except as that artifact.
                */
                className={cn(
                  'min-w-0 h-full',
                  responsiveSpanClasses[index],
                )}
              >
                <Link
                  href={`/services/${slug}`}
                  className="group relative z-0 flex flex-col h-full p-5 md:p-6 xl:p-7 bg-surface no-underline transition-[background-color,box-shadow] duration-200 hover:z-10 hover:bg-primary hover:ring-1 hover:ring-inset hover:ring-primary focus-visible:z-20 focus-visible:outline-none focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  <h3 className="text-body font-semibold text-text-base leading-snug transition-colors duration-200 group-hover:text-text-inverse group-focus-visible:text-text-inverse">
                    {title}
                  </h3>

                  <p className="mt-2 text-meta text-text-muted leading-relaxed grow transition-colors duration-200 group-hover:text-text-inverse/85 group-focus-visible:text-text-inverse/85">
                    {description}
                  </p>

                  <span className="mt-5 min-h-11 inline-flex items-center gap-1.5 text-meta font-semibold text-secondary transition-colors duration-200 group-hover:text-text-inverse group-focus-visible:text-text-inverse">
                    {t('learnMore')}
                    {/*
                      No CSS transform here: MotionGroup animates this
                      element's `x` on hover, and a `transition-transform`
                      alongside it would transition GSAP's own per-frame
                      writes, so the two easings fight. GSAP's hover block is
                      already gated on `prefers-reduced-motion`, which is
                      what the `motion-reduce:` guards used to cover.
                    */}
                    <ArrowRightIcon
                      size={14}
                      data-motion-arrow
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </div>
            ))}
          </MotionGroup>
        </div>
      </div>
    </section>
  );
}
