import { Button } from '@/components/ui/button';
import FadeIn from './FadeIn';

export default function CTAStrip() {
  return (
    <section className="w-full bg-linear-to-br from-secondary to-secondary-700 py-section-sm lg:py-section relative overflow-hidden">
      {/* Ambient depth */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-secondary-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-page mx-auto px-5 lg:px-gutter flex flex-col items-center text-center">
        <FadeIn>
          <h2 className="font-extrabold text-text-inverse text-[28px] sm:text-[32px] lg:text-[36px] leading-9.5 lg:leading-11 max-w-160">
            Your health journey begins with one call
          </h2>
          <p className="mt-4 text-text-inverse/90 text-[15px] lg:text-[17px] leading-6.5 max-w-130">
            Book an appointment today or speak with our care team — we&apos;re here for you 24×7.
          </p>

          <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
            <Button
              variant="ghost"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold bg-surface text-secondary hover:bg-surface/90 shadow-sm"
            >
              <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                Book Appointment
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold text-text-inverse border-[1.5px] border-white/60 bg-transparent hover:bg-white/10 hover:border-white hover:text-text-inverse shadow-none"
            >
              <a href="tel:+917862950676">+91 78629 50676</a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
