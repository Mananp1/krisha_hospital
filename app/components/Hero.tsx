import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="w-full bg-surface-subtle lg:min-h-160">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-15 max-w-360 mx-auto py-12 px-5 lg:py-17.5 lg:px-25">
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:max-w-140">
          {/* Eyebrow */}
          <p className="text-[12.5px] font-bold uppercase tracking-[1.5px] text-secondary">
            FOGSI MEMBER · NABH ACCREDITED
          </p>

          {/* H1 */}
          <h1 className="mt-3 leading-tight lg:leading-14">
            <span className="block text-[34px] lg:text-[50px] font-extrabold text-text-base">
              Gentle hands &amp; expert care,
            </span>
            <span className="block text-[34px] lg:text-[50px] font-extrabold text-secondary">
              because she matters
            </span>
          </h1>

          {/* Lead */}
          <p className="mt-6 mb-8 text-lg text-text-muted leading-[29px] max-w-125">
            Your trusted partner for gynaecology, safe motherhood, high-risk
            pregnancy and advanced fertility care — with a team that truly cares
            for every woman.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <Link
              href="/#appointment"
              className="flex items-center px-7 py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-full transition-all hover:bg-secondary-600"
            >
              Book Appointment
            </Link>
            <Link
              href="/#services"
              className="flex items-center px-7 py-3.5 text-[15px] font-semibold rounded-full border-[1.5px] border-primary text-primary transition-all hover:bg-primary hover:text-text-inverse"
            >
              Explore Services
            </Link>
          </div>

          {/* Trust Pills */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mt-9 flex-wrap">
            {['NABH Accredited', 'ISO 9001:2015', 'NABL Lab'].map((pill) => (
              <span
                key={pill}
                className="px-4 py-2 text-[13px] font-semibold rounded-[30px] bg-surface border border-border-muted text-primary-700"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column — Photo */}
        <div className="relative flex-shrink-0 hidden lg:block w-140 h-125 rounded-[28px] overflow-hidden">
          <Image
            src="/hero.jpg"
            alt="Mother and newborn baby at Krisha Women's Hospital"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />

          {/* Stat badge — floating */}
          <div className="absolute animate-float left-4 bottom-8 bg-surface rounded-[20px] px-6 py-4.5 shadow-[0_8px_32px_rgba(76,41,150,0.10)] flex items-center gap-5 z-10">
            <div className="w-11 h-11 bg-secondary-50 rounded-[12px] flex items-center justify-center flex-shrink-0 text-secondary">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[19px] text-text-base leading-tight tracking-[-0.3px]">
                20k<span className="text-[13px] font-semibold text-text-muted align-top mt-0.5 inline-block">+</span>
              </p>
              <p className="text-[12.5px] text-text-muted mt-0.5 tracking-[0.1px]">
                Happy mothers
              </p>
            </div>
          </div>

          {/* Emergency pill */}
          <div className="absolute -right-2.5 top-6.5 bg-primary rounded-l-[18px] px-5 py-3.5 shadow-lg z-10">
            <p className="font-bold text-text-inverse text-[14px] whitespace-nowrap">
              24×7 Emergency
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
