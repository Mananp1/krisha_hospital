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
  return <span className="w-1 h-7 rounded-full bg-secondary shrink-0" />;
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  return (
    <>
      {/* Hero */}
      <section className="w-full bg-surface-subtle py-14 lg:py-20 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-secondary-100/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-360 mx-auto px-5 lg:px-25">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[13px] text-text-muted mb-7 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted/50 shrink-0" />
            <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronRightIcon size={13} className="text-text-muted/50 shrink-0" />
            <span className="text-text-base font-medium">{data.shortTitle}</span>
          </nav>

          {/* Eyebrow badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary bg-secondary/10 mb-5">
            Krisha Women&apos;s Hospital · Narol, Ahmedabad
          </span>

          {/* Title */}
          <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] font-extrabold text-text-base leading-tight max-w-190 mb-5">
            {data.title}
          </h1>

          {/* Intro */}
          <p className="text-[15px] lg:text-[16px] text-text-muted leading-7 max-w-170 mb-8">
            {data.intro}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              asChild
              className="rounded-full px-6 py-3 h-auto text-[14px] font-semibold hover:bg-secondary-600 shadow-sm"
            >
              <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                Book Appointment
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full px-6 py-3 h-auto text-[14px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <a href="tel:+917862950676">+91 78629 50676</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-6">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">Service Overview</h2>
          </div>
          <div className="flex flex-col gap-5 max-w-200">
            {data.overview.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-7">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="w-full bg-surface-subtle py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-8">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">Key Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.benefits.map((b, i) => (
              <div
                key={i}
                className="group bg-surface rounded-[18px] p-6 border border-border-muted flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(76,41,150,0.08)] hover:border-primary/20"
              >
                <div className="w-10 h-10 rounded-[10px] bg-primary-100 text-primary flex items-center justify-center shrink-0">
                  <CheckIcon size={16} strokeWidth={2.5} />
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
      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-6">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
              Our Approach at Krisha Women&apos;s Hospital
            </h2>
          </div>
          <div className="flex flex-col gap-5 max-w-200">
            {data.approach.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-7">{para}</p>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
