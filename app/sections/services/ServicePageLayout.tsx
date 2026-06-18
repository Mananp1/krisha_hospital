import Link from 'next/link';
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

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SectionAccent() {
  return <span className="w-1 h-7 rounded-full bg-secondary shrink-0" />;
}

export default function ServicePageLayout({ data }: { data: ServicePageData }) {
  return (
    <>
      {/* Hero */}
      <section className="w-full bg-surface-subtle border-b border-border-muted py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[13px] text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronIcon />
            <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
            <ChevronIcon />
            <span className="text-text-base font-medium">{data.shortTitle}</span>
          </nav>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary bg-secondary/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
            Krisha Women&apos;s Hospital · Narol, Ahmedabad
          </span>

          {/* Title */}
          <h1 className="text-[28px] sm:text-[34px] lg:text-[42px] font-extrabold text-text-base leading-tight max-w-[760px] mb-5">
            {data.title}
          </h1>

          {/* Intro */}
          <p className="text-[15px] lg:text-[16px] text-text-muted leading-[27px] max-w-[680px] mb-8">
            {data.intro}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://wa.me/917862950676"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-[14px] font-semibold text-text-inverse bg-secondary rounded-full hover:opacity-90 transition-opacity"
            >
              Book Appointment
            </a>
            <a
              href="tel:+917862950676"
              className="px-6 py-3 text-[14px] font-semibold text-primary border-[1.5px] border-primary rounded-full hover:bg-primary hover:text-text-inverse transition-colors"
            >
              +91 78629 50676
            </a>
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
          <div className="flex flex-col gap-5 max-w-[800px]">
            {data.overview.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-[27px]">{para}</p>
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
              <div key={i} className="bg-surface rounded-2xl p-6 border border-border-muted flex flex-col gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary flex items-center justify-center shrink-0">
                  <CheckIcon />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-text-base mb-1.5">{b.label}</h3>
                  <p className="text-[13px] text-text-muted leading-[22px]">{b.description}</p>
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
          <div className="flex flex-col gap-5 max-w-[800px]">
            {data.approach.map((para, i) => (
              <p key={i} className="text-[15px] text-text-muted leading-[27px]">{para}</p>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
