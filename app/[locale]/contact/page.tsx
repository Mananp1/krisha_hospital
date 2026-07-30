import type { Metadata } from 'next';
import { ChevronRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/app/sections/ContactForm';

export const metadata: Metadata = {
  title: "Contact Us | Krisha Women's Hospital, Narol, Ahmedabad",
  description:
    "Get in touch with Krisha Women's Hospital in Narol, Ahmedabad. Book an appointment with Dr. Alhad Pande — call +91 78629 50676 or write to us online.",
  alternates: { canonical: '/contact' },
};

function ChevronIcon() {
  return (
    <ChevronRightIcon size={12} />
  );
}

const contactCards = [
  {
    icon: (
      <PhoneIcon size={22} />
    ),
    label: 'Call Us',
    primary: '+91 78629 50676',
    secondary: 'Emergency care available 24×7',
    href: 'tel:+917862950676',
  },
  {
    icon: (
      <MailIcon size={22} />
    ),
    label: 'Email Us',
    primary: 'care@krishawomenshospital.in',
    secondary: 'We reply within 24 hours',
    href: 'mailto:care@krishawomenshospital.in',
  },
  {
    icon: (
      <MapPinIcon size={22} />
    ),
    label: 'Visit Us',
    primary: 'Narol, Ahmedabad — 382405',
    secondary: '231–235, A Block, 2nd Floor, Arbuda Trade Centre, Near Meldi Mata Mandir, Swami Samarth Road',
    href: null,
  },
  {
    icon: (
      <ClockIcon size={22} />
    ),
    label: 'OPD Hours',
    primary: 'Mon – Sat: 8:00 AM – 8:00 PM',
    secondary: 'Closed on Sundays · Emergency 24×7',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="w-full bg-surface-subtle border-b border-border-muted py-section-sm lg:py-section">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">

          <nav className="flex items-center gap-1.5 text-[13px] text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronIcon />
            <span className="text-text-base font-medium">Contact Us</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary bg-secondary/10 mb-5">
            Krisha Women&apos;s Hospital · Narol, Ahmedabad
          </span>

          <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-text-base leading-tight mb-4">
            We&apos;re here for you — reach out anytime
          </h1>
          <p className="text-[15px] lg:text-[16px] text-text-muted leading-[27px] max-w-[620px]">
            Whether you want to book an appointment, ask about a service, or simply need to speak
            with our care team — we&apos;re always a call or message away.
          </p>
        </div>
      </section>

      {/* ── Form + Contact Details ── */}
      <section className="w-full bg-surface-subtle py-section-sm lg:py-section">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left — Form */}
            <div>
              <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base mb-2">Send us a message</h2>
              <p className="text-[14px] text-text-muted mb-7 leading-[23px]">
                Fill in the form and we will get back to you shortly. Fields marked <span className="text-secondary font-semibold">*</span> are required.
              </p>
              <ContactForm />
            </div>

            {/* Right — Contact details */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base mb-1">Contact details</h2>
              {contactCards.map((card) => (
                <div key={card.label} className="bg-surface rounded-2xl p-5 border border-border-muted flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-[11.5px] font-bold uppercase tracking-[1px] text-text-muted mb-0.5">{card.label}</p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="font-bold text-[14px] text-text-base hover:text-primary transition-colors leading-snug block"
                      >
                        {card.primary}
                      </a>
                    ) : (
                      <p className="font-bold text-[14px] text-text-base leading-snug">{card.primary}</p>
                    )}
                    <p className="text-[12.5px] text-text-muted leading-[19px] mt-0.5">{card.secondary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ── */}
      <section className="w-full bg-surface pb-14 lg:pb-20">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <div className="rounded-[18px] overflow-hidden border border-border-muted shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=22.9644206,72.5916213&z=16&output=embed"
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Krisha Women's Hospital location — Narol, Ahmedabad"
            />
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <p className="text-[13px] text-text-muted">
              231–235, A Block, 2nd Floor, Arbuda Trade Centre, Near Meldi Mata Mandir, Swami Samarth Road, Narol, Ahmedabad — 382405
            </p>
            <a
              href="https://maps.app.goo.gl/yyAN6pwSQYNny7v18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-semibold text-primary hover:underline underline-offset-2 shrink-0"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
