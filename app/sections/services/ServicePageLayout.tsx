import Link from 'next/link';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CTAStrip from '@/app/sections/CTAStrip';

export interface ServiceBenefit {
  label: string;
  description: string;
}

export interface ServiceDetails {
  title: string;
  items: string[];
}

export interface ServicePageData {
  title: string;
  shortTitle: string;
  intro: string | string[];
  overview: string | string[];
  benefits: ServiceBenefit[];
  approach: string | string[];
  summaryItems?: string[];
  overviewDetails?: ServiceDetails;
}

interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
}

function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <div className="flex items-stretch gap-3">
      <span aria-hidden="true" className="w-1 rounded-full bg-secondary shrink-0" />
      <h2
        id={id}
        className="text-[22px] lg:text-[26px] font-bold text-text-base leading-snug"
      >
        {children}
      </h2>
    </div>
  );
}

function normalizeParagraphs(content: string | string[]) {
  if (Array.isArray(content)) {
    return content.filter((paragraph) => paragraph.trim().length > 0);
  }

  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function ServiceBreadcrumb({ currentPage }: { currentPage: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 text-[13px] text-text-muted mb-6 md:mb-7 flex-wrap"
    >
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <ChevronRightIcon size={13} className="text-text-muted shrink-0" aria-hidden="true" />
      <Link href="/#services" className="hover:text-primary transition-colors">
        Services
      </Link>
      <ChevronRightIcon size={13} className="text-text-muted shrink-0" aria-hidden="true" />
      <span className="text-text-base font-medium min-w-0">{currentPage}</span>
    </nav>
  );
}

function ServiceSummaryPanel({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside
      aria-labelledby="service-highlights"
      className="rounded-lg border border-border-muted bg-surface p-5 md:p-6"
    >
      <h2
        id="service-highlights"
        className="text-[11px] font-bold uppercase tracking-[1.4px] text-text-muted mb-4"
      >
        Care Highlights
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-1">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 border-b border-border-muted last:border-b-0 lg:px-4 lg:py-0 lg:first:pl-0 lg:last:pr-0 lg:border-b-0 lg:border-r lg:last:border-r-0 xl:px-0 xl:py-3 xl:first:pt-0 xl:last:pb-0 xl:border-r-0 xl:border-b xl:last:border-b-0"
          >
            <span className="w-8 h-8 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0">
              <CheckIcon size={15} aria-hidden="true" />
            </span>
            <p className="text-[13.5px] font-semibold text-text-base leading-5.5 pt-1">
              {item}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ServiceHero({ data }: { data: ServicePageData }) {
  const introParagraphs = normalizeParagraphs(data.intro);
  const summaryItems = (data.summaryItems ?? data.benefits.map((benefit) => benefit.label)).slice(0, 3);
  const hasSummary = summaryItems.length > 0;

  return (
    <section
      className="w-full bg-linear-to-b from-surface-subtle to-surface py-10 md:py-12 lg:py-16"
      aria-labelledby="service-title"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <ServiceBreadcrumb currentPage={data.shortTitle} />

        <div
          className={cn(
            'grid grid-cols-1 gap-8 items-start',
            hasSummary && 'xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:gap-8',
          )}
        >
          <div className={cn('min-w-0', !hasSummary && 'max-w-4xl')}>
            <span className="inline-flex text-label uppercase text-primary mb-3">
              Krisha Women&apos;s Hospital · Narol, Ahmedabad
            </span>

            <h1
              id="service-title"
              className="text-[28px] sm:text-[34px] lg:text-[42px] font-extrabold text-text-base leading-tight max-w-190"
            >
              {data.title}
            </h1>

            <div className="flex flex-col gap-3 mt-5 max-w-3xl">
              {introParagraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] lg:text-[16px] text-text-muted leading-7">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-6">
              <Button
                variant="secondary"
                asChild
                className="rounded-md px-6 py-3 h-auto text-[14px] font-semibold hover:bg-secondary-600 shadow-sm"
              >
                <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                  Book Appointment
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="rounded-md px-6 py-3 h-auto text-[14px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
              >
                <a href="tel:+917862950676">+91 78629 50676</a>
              </Button>
            </div>
          </div>

          {hasSummary && <ServiceSummaryPanel items={summaryItems} />}
        </div>
      </div>
    </section>
  );
}

function ServiceOverview({ data }: { data: ServicePageData }) {
  const paragraphs = normalizeParagraphs(data.overview);

  return (
    <section
      className="w-full bg-surface py-10 md:py-12 lg:py-16"
      aria-labelledby="service-overview"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        {data.overviewDetails ? (
          <>
            <SectionHeading id="service-overview">Service Overview</SectionHeading>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1.8fr)_minmax(16rem,1fr)] gap-8 items-start">
              <div className="flex flex-col gap-4 min-w-0">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[15px] text-text-muted leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>

              <aside className="rounded-lg border border-border-muted bg-surface-subtle p-5">
                <h3 className="font-bold text-[15px] text-text-base">
                  {data.overviewDetails.title}
                </h3>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {data.overviewDetails.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13px] text-text-muted leading-5.5">
                      <CheckIcon
                        size={15}
                        className="text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </>
        ) : (
          // No sidebar for this service: put the heading beside the copy,
          // matching ServiceApproach's grid below, instead of capping the
          // paragraphs to max-w-3xl and leaving the rest of the row empty.
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,2fr)] gap-6 lg:gap-8 items-start">
            <SectionHeading id="service-overview">Service Overview</SectionHeading>

            <div className="flex flex-col gap-4 min-w-0">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-[15px] text-text-muted leading-7">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceBenefitsGrid({ benefits }: { benefits: ServiceBenefit[] }) {
  const fourCardLayout = benefits.length === 4;

  return (
    <section
      className="w-full bg-surface-subtle py-10 md:py-12 lg:py-16"
      aria-labelledby="key-benefits"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <SectionHeading id="key-benefits">Key Benefits</SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 mt-6">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.label}
              className={cn(
                'group min-w-0 h-full bg-surface rounded-lg p-5 md:p-6 border border-border-muted flex flex-col gap-3 transition-[transform,background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none motion-reduce:hover:transform-none hover:-translate-y-0.5 hover:bg-primary hover:border-primary hover:shadow-card',
                fourCardLayout ? 'xl:col-span-3' : 'xl:col-span-2',
                benefits.length === 5 && index === 3 && 'xl:col-start-2',
              )}
            >
              <div className="w-9 h-9 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-white/15 group-hover:text-text-inverse">
                <CheckIcon size={16} aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-text-base leading-5 mb-1.5 transition-colors duration-200 group-hover:text-text-inverse">
                  {benefit.label}
                </h3>
                <p className="text-[13px] text-text-muted leading-5.5 transition-colors duration-200 group-hover:text-text-inverse/85">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceApproach({ paragraphs }: { paragraphs: string | string[] }) {
  const approachParagraphs = normalizeParagraphs(paragraphs);

  return (
    <section
      className="w-full bg-surface py-10 md:py-12 lg:py-16"
      aria-labelledby="service-approach"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,2fr)] gap-6 lg:gap-8 items-start">
          <SectionHeading id="service-approach">
            Our Approach at Krisha Women&apos;s Hospital
          </SectionHeading>

          <div className="rounded-lg border border-border-muted bg-surface-subtle overflow-hidden">
            {approachParagraphs.map((paragraph, index) => (
              <article
                key={index}
                className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 md:gap-4 p-5 md:p-6 border-b border-border-muted last:border-b-0"
              >
                <span
                  aria-hidden="true"
                  className="font-display text-[18px] font-semibold text-primary leading-6"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-[15px] text-text-muted leading-7 min-w-0">
                  {paragraph}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  return (
    <>
      <ServiceHero data={data} />
      <ServiceOverview data={data} />
      <ServiceBenefitsGrid benefits={data.benefits} />
      <ServiceApproach paragraphs={data.approach} />
      <CTAStrip />
    </>
  );
}
