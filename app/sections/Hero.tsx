import Link from 'next/link';
import { HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { heroSlides } from '@/app/data/gallery';
import HeroCarousel from './HeroCarousel';
import FadeIn from './FadeIn';

export default function Hero() {
  return (
    <section id="home" className="w-full bg-surface-subtle lg:min-h-160 relative overflow-hidden">

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-12 lg:gap-15 max-w-page mx-auto py-12 px-5 md:px-10 lg:py-17.5 lg:px-gutter">
        {/* Left Column */}
        <FadeIn className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:max-w-140">
          {/* H1 */}
          <h1>
            <span className="block text-[30px] md:text-[36px] lg:text-[40px] font-extrabold text-text-base leading-tight">
              Supporting every stage of
            </span>
            <span className="block text-[30px] md:text-[36px] lg:text-[40px] font-extrabold text-secondary leading-tight lg:mt-1">
              a woman&apos;s health journey
            </span>
          </h1>

          {/* Lead */}
          <p className="mt-6 mb-8 text-base md:text-lg text-text-muted leading-[29px] max-w-125 md:max-w-160">
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
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
            >
              <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                Book Appointment
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <Link href="/#services">Explore Services</Link>
            </Button>
          </div>
        </FadeIn>

        {/* Right Column — Photo carousel (mobile, tablet and desktop) */}
        <FadeIn
          delay={0.15}
          direction="up"
          className="relative w-full max-w-160 lg:max-w-none lg:w-140 shrink-0"
        >
          <HeroCarousel
            slides={heroSlides}
            className="relative w-full aspect-[16/10] lg:aspect-[4/3] rounded-xl lg:rounded-xl overflow-hidden bg-primary-50 ring-1 ring-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          />

          {/* Stat badge — floating (redundant with StatsBar on the smallest screens) */}
          <div className="absolute animate-float left-4 top-4 lg:top-5 hidden sm:flex bg-surface rounded-xl px-5 py-3.5 lg:px-6 lg:py-4.5 shadow-float items-center gap-4 lg:gap-5 z-20">
            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-secondary-50 rounded-md flex items-center justify-center flex-shrink-0 text-secondary">
              <HeartIcon size={19} className="fill-current" />
            </div>
            <div>
              <p className="font-bold text-[19px] text-text-base leading-tight tracking-[-0.3px]">
                20k<span className="text-[13px] font-semibold text-text-muted align-top mt-0.5 inline-block">+</span>
              </p>
              <p className="text-[12.5px] text-text-muted mt-0.5 tracking-[0.1px]">Happy Patients</p>
            </div>
          </div>

          {/* Emergency pill */}
          <div className="absolute right-0 lg:-right-2.5 top-4 lg:top-6.5 bg-primary rounded-l-[18px] px-4 py-3 lg:px-5 lg:py-3.5 shadow-lg z-20">
            <p className="font-bold text-text-inverse text-[13px] lg:text-[14px] whitespace-nowrap">24×7 Emergency</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
