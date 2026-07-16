import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeIn from './FadeIn';

export default function Hero() {
  return (
    <section id="home" className="w-full bg-surface-subtle lg:min-h-160 relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-secondary-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-15 max-w-360 mx-auto py-12 px-5 lg:py-17.5 lg:px-25">
        {/* Left Column */}
        <FadeIn className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:max-w-140">
          {/* H1 */}
          <h1>
            <span className="block text-[30px] lg:text-[40px] font-extrabold text-text-base leading-tight">
              Supporting every stage of
            </span>
            <span className="block text-[30px] lg:text-[40px] font-extrabold text-secondary leading-tight lg:mt-1">
              a woman&apos;s health journey
            </span>
          </h1>

          {/* Lead */}
          <p className="mt-6 mb-8 text-lg text-text-muted leading-[29px] max-w-125">
            Specialist care across gynaecology, safe motherhood, high-risk
            pregnancy management, fertility treatment, and women&apos;s wellness —
            delivered with clinical excellence and compassion at every stage of
            your life.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <Button
              variant="secondary"
              asChild
              className="rounded-full px-7 py-3.5 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
            >
              <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                Book Appointment
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-full px-7 py-3.5 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <Link href="/#services">Explore Services</Link>
            </Button>
          </div>

          {/* Trust Pills */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mt-9 flex-wrap">
            {['NABH Accredited', 'ISO 9001:2015', 'NABL Lab'].map((pill) => (
              <span
                key={pill}
                className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-[30px] bg-surface border border-border-muted text-primary-700"
              >
                <CheckIcon size={11} strokeWidth={2.5} className="text-secondary shrink-0" />
                {pill}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* Right Column — Photo */}
        <FadeIn delay={0.15} direction="up" className="relative flex-shrink-0 hidden lg:block w-140 h-125 rounded-[28px] overflow-hidden ring-1 ring-primary/10">
          <Image
            src="/hero-2.jpg"
            alt="Mother and newborn baby at Krisha Women's Hospital"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />

          {/* Stat badge — floating */}
          <div className="absolute animate-float left-4 bottom-8 bg-surface rounded-[20px] px-6 py-4.5 shadow-[0_8px_32px_rgba(76,41,150,0.10)] flex items-center gap-5 z-10">
            <div className="w-11 h-11 bg-secondary-50 rounded-[12px] flex items-center justify-center flex-shrink-0 text-secondary">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[19px] text-text-base leading-tight tracking-[-0.3px]">
                20k<span className="text-[13px] font-semibold text-text-muted align-top mt-0.5 inline-block">+</span>
              </p>
              <p className="text-[12.5px] text-text-muted mt-0.5 tracking-[0.1px]">Happy Patients</p>
            </div>
          </div>

          {/* Emergency pill */}
          <div className="absolute -right-2.5 top-6.5 bg-primary rounded-l-[18px] px-5 py-3.5 shadow-lg z-10">
            <p className="font-bold text-text-inverse text-[14px] whitespace-nowrap">24×7 Emergency</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
