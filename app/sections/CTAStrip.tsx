import FadeIn from './FadeIn';

export default function CTAStrip() {
  return (
    <section className="w-full bg-secondary py-14 lg:py-20">
      <div className="max-w-360 mx-auto px-5 lg:px-25 flex flex-col items-center text-center">
        <FadeIn>
        <h2 className="font-extrabold text-text-inverse text-[28px] sm:text-[32px] lg:text-[36px] leading-[38px] lg:leading-[44px] max-w-[640px]">
          Your health journey begins with one call
        </h2>
        <p className="mt-4 text-text-inverse/90 text-[15px] lg:text-[17px] leading-[26px] max-w-[520px]">
          Book an appointment today or speak with our care team — we&apos;re here for you 24×7.
        </p>

        <div className="flex items-center gap-4 mt-8 flex-wrap justify-center">
          <a
            href="https://wa.me/917862950676"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 text-[15px] font-semibold rounded-[40px] bg-surface text-secondary hover:opacity-90 transition-opacity"
          >
            Book Appointment
          </a>
          <a
            href="tel:+917862950676"
            className="px-7 py-3.5 text-[15px] font-semibold rounded-[40px] text-text-inverse border-[1.5px] border-text-inverse hover:opacity-80 transition-opacity"
          >
            +91 78629 50676
          </a>
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
