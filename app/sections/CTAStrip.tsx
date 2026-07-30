import { Button } from '@/components/ui/button';
import FadeIn from './FadeIn';

/**
 * Solid plum, full-bleed, square. This was a magenta gradient — a large block
 * of the 10% accent colour, which is what made the whole palette read as
 * pink-dominant. Magenta now survives here only as the primary button.
 */
export default function CTAStrip() {
  return (
    <section className="w-full bg-primary py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter flex flex-col items-center text-center">
        <FadeIn>
          <h2 className="font-display text-display text-text-inverse max-w-160">
            Your health journey begins with one call
          </h2>
          <p className="mt-4 text-text-inverse/90 text-[15px] lg:text-[17px] leading-6.5 max-w-130">
            Book an appointment today or speak with our care team — we&apos;re here for you 24×7.
          </p>

          <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-body font-semibold hover:bg-secondary-600 shadow-none"
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
