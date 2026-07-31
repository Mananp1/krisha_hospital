import Link from 'next/link';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTAStrip from '@/app/sections/CTAStrip';

export interface ServiceBenefit {
  label: string;
  description: string;
}

export interface ServicePageData {
  title: string;
  shortTitle: string;
  intro: string;
  overview: string[];
  benefits: ServiceBenefit[];
  approach: string[];
}

function SectionAccent() {
  return <span className="w-1 rounded-full bg-secondary shrink-0" />;
}

/**
 * Body-copy section with a sticky heading rail on the left. Keeps paragraphs at a
 * readable measure while the row itself spans the full container width.
 */
function ProseSection({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <section className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">
          {/* Left — sticky heading rail */}
          <div className="lg:w-76 shrink-0 mb-6 lg:mb-0 lg:sticky lg:top-28">
            <div className="flex gap-3">
              <SectionAccent />
              <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base leading-snug">
                {title}
              </h2>
            </div>
          </div>

          {/* Right — paragraphs */}
          <div className="flex-1 min-w-0 flex flex-col gap-5 max-w-200">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-7">{para}</p>
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
      {/* Hero */}
      <section className="w-full bg-surface-subtle py-section-sm lg:py-section relative overflow-hidden">

        <div className="relative max-w-page mx-auto px-5 lg:px-gutter">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[13px] text-text-muted mb-7 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted shrink-0" />
            <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronRightIcon size={13} className="text-text-muted shrink-0" />
            <span className="text-text-base font-medium">{data.shortTitle}</span>
          </nav>

          {/*
            Below xl the container is narrow enough that the max-w caps barely bind,
            so the hero stacks as before. At xl+ it splits: title and CTAs on the
            left, intro on the right, filling the full container width.
          */}
          <div className="xl:grid xl:grid-cols-2 xl:gap-x-16 xl:items-start">

            {/* Eyebrow badge + title */}
            <div className="xl:col-start-1 xl:row-start-1">
              {/* secondary on secondary/10 was 3.92:1 at this size; secondary-600 clears 5.56:1. */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary-600 bg-secondary/10 mb-5">
                Krisha Women&apos;s Hospital · Narol, Ahmedabad
              </span>

              <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] font-extrabold text-text-base leading-tight max-w-190 mb-5">
                {data.title}
              </h1>
            </div>

            {/* Intro */}
            <p className="text-[15px] lg:text-[16px] text-text-muted leading-7 max-w-170 mb-8 xl:max-w-none xl:mb-0 xl:col-start-2 xl:row-start-1 xl:row-span-2">
              {data.intro}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap xl:col-start-1 xl:row-start-2">
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
        </div>
      </section>

      {/* Service Overview */}
      <ProseSection title="Service Overview" paragraphs={data.overview} />

      {/* Key Benefits */}
      <section className="w-full bg-surface-subtle py-section-sm lg:py-section">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <div className="flex gap-3 mb-8">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base leading-snug">Key Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-surface rounded-lg p-6 border border-border-muted flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-primary/20"
              >
                <div className="w-10 h-10 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0">
                  <CheckIcon size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-text-base mb-1.5">{b.label}</h3>
                  <p className="text-[13px] text-text-muted leading-5.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <ProseSection
        title="Our Approach at Krisha Women's Hospital"
        paragraphs={data.approach}
      />

      <CTAStrip />
    </>
  );
}
