import { useTranslations } from 'next-intl';
import {
  ArrowRightIcon,
  BabyIcon,
  ShieldPlusIcon,
  ScanLineIcon,
  SparklesIcon,
  MicroscopeIcon,
  HeartPulseIcon,
  ShieldIcon,
  StethoscopeIcon,
  HeartHandshakeIcon,
  Flower2Icon,
  RibbonIcon,
  CalendarHeartIcon,
  FlowerIcon,
  type LucideIcon,
} from 'lucide-react';
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
/**
 * Token names, not colours — MotionGroup resolves them from the document, so
 * the palette stays in globals.css. Module scope keeps the object identity
 * stable; inline it would be a new object every render and re-run the hook.
 */
const CARD_FILL = {
  from: '--surface',
  mid: '--primary-400',
  to: '--primary',
} as const;

/**
 * One line-art glyph per service, keyed by slug. A single hairline weight
 * (normalised globally on `.lucide`) keeps them consistent with the logo, and
 * each sits in a soft primary tile that inverts to white when the card fills
 * on hover — so the icon reads as part of the same surface, not a sticker.
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  'pregnancy-maternity-care': BabyIcon,
  'high-risk-pregnancy': ShieldPlusIcon,
  'antenatal-gynecological-sonography': ScanLineIcon,
  'infertility-treatment': SparklesIcon,
  'laparoscopic-hysteroscopic-surgery': MicroscopeIcon,
  'painless-vaginal-delivery': HeartPulseIcon,
  'cervical-cerclage': ShieldIcon,
  'tuboplasty-fertility-procedures': StethoscopeIcon,
  'preconception-counseling': HeartHandshakeIcon,
  'adolescent-gynecology': Flower2Icon,
  'cervical-cancer-screening': RibbonIcon,
  'family-planning-contraceptive-counseling': CalendarHeartIcon,
  'menopause-consultation': FlowerIcon,
};

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
            fill={CARD_FILL}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-px bg-border-muted"
          >
            {orderedServices.map(({ slug, title, description }, index) => {
              const Icon = SERVICE_ICONS[slug];
              return (
              <div
                key={slug}
                data-motion-item
                /*
                  `relative` is load-bearing, not decoration.

                  Grid items paint in DOM order, so when a hovered card grows
                  it slides *under* the card to its right (later in the DOM)
                  while correctly covering the one to its left — which showed
                  up as a pale edge on the right side only, the neighbour's
                  own background cutting across the scaled card. The seam
                  colour is #eae5fb, near enough to white to read as one.

                  GSAP raises z-index on hover, but a static grid item is an
                  unreliable place to apply it. Positioning the cell makes the
                  stacking explicit, so the hovered card is above both
                  neighbours regardless of document order.

                  No background here on purpose either: the Link fills this
                  wrapper, so a second background underneath it can only ever
                  surface as a rounding artifact along the edges.
                */
                className={cn(
                  'relative min-w-0 h-full',
                  responsiveSpanClasses[index],
                )}
              >
                <Link
                  href={`/services/${slug}`}
                  // Stacking is handled by the wrapper above, which is the
                  // element that actually scales; z-index here only ever
                  // applied inside this card's own context.
                  data-motion-surface
                  /*
                    `background-color` is deliberately absent from the
                    transition list: GSAP drives the fill through a pale
                    stage, and a CSS transition on the same property would
                    transition each of its per-frame writes, blurring the two
                    stages into one and fighting its easing.

                    `hover:bg-primary` stays as the no-JS / reduced-motion /
                    coarse-pointer fallback. Where GSAP does run it claims the
                    property inline on mount, which outranks this class.
                  */
                  className="group flex flex-col h-full p-5 md:p-6 xl:p-7 bg-surface no-underline transition-[box-shadow] duration-200 hover:bg-primary hover:ring-1 hover:ring-inset hover:ring-primary focus-visible:outline-none focus-visible:bg-primary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                >
                  {Icon && (
                    <span
                      aria-hidden="true"
                      className="mb-4 grid size-11 place-items-center rounded-xl bg-primary-50 text-primary ring-1 ring-primary-100 transition-colors duration-150 delay-[80ms] group-hover:delay-[240ms] group-hover:bg-white/15 group-hover:text-text-inverse group-hover:ring-white/25 group-focus-visible:bg-white/15 group-focus-visible:text-text-inverse group-focus-visible:ring-white/25"
                    >
                      <Icon size={22} />
                    </span>
                  )}

                  {/*
                    Text waits for the fill to be well underway before it
                    flips. These delays are measured from pointer-enter,
                    where the GSAP timings are measured from the end of the
                    intent delay — so they carry that 90ms too:
                    90 intent + 80 fill offset + 70 rise ≈ 240ms, the point
                    the background is dark enough for inverted text to be
                    legible. Flipping any earlier puts white text on a card
                    that is still nearly white.
                  */}
                  <h3 className="text-body font-semibold text-text-base leading-snug transition-colors duration-150 delay-[80ms] group-hover:delay-[240ms] group-hover:text-text-inverse group-focus-visible:text-text-inverse">
                    {title}
                  </h3>

                  <p className="mt-2 text-meta text-text-muted leading-relaxed grow transition-colors duration-150 delay-[80ms] group-hover:delay-[240ms] group-hover:text-text-inverse/85 group-focus-visible:text-text-inverse/85">
                    {description}
                  </p>

                  <span className="mt-5 min-h-11 inline-flex items-center gap-1.5 text-meta font-semibold text-secondary transition-colors duration-150 delay-[80ms] group-hover:delay-[240ms] group-hover:text-text-inverse group-focus-visible:text-text-inverse">
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
              );
            })}
          </MotionGroup>
        </div>
      </div>
    </section>
  );
}
