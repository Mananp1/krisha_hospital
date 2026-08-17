import type { Metadata } from 'next';
import { ChevronRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import FadeIn from '@/app/animations/FadeIn';
import MotionGroup from '@/app/animations/MotionGroup';
import ContactForm from '@/app/sections/ContactForm';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site-config';

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
    primary: CONTACT_EMAIL,
    secondary: 'We reply within 24 hours',
    href: CONTACT_EMAIL_HREF,
  },
  {
    icon: (
      <MapPinIcon size={22} />
    ),
    label: 'Visit Us',
    primary: 'Narol, Ahmedabad — 382405',
    secondary: 'A 231–235, SF, Arbuda Trade Centre, Opposite Swaminarayan Complex, Narol – Vatva Turning',
    href: null,
  },
  {
    icon: (
      <ClockIcon size={22} />
    ),
    label: 'OPD Hours',
    primary: 'Mon – Sat: 11 AM–2 PM, 6 PM–8 PM',
    secondary: 'Sun: 11 AM–1 PM · Emergency 24×7',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/*
        ── Hero ──
        Tight bottom padding, not the full section rhythm. This block and
        the form below it are both `surface-subtle` and read as one unit, so
        stacking a full `py-section` on each put roughly 224px of empty
        space between the headline and the form it introduces.
      */}
      <section className="w-full bg-surface-subtle border-b border-border-muted pt-section-sm lg:pt-section pb-10 lg:pb-14">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <FadeIn>

          <nav className="flex items-center gap-1.5 text-meta text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronIcon />
            <span className="text-text-base font-medium">Contact Us</span>
          </nav>

          {/*
            Flat eyebrow, matching SectionHeader and the service pages. The
            tinted pill this replaced predates the redesign and was the last
            one left outside the doctor page.
          */}
          <span className="inline-flex text-label uppercase text-primary mb-3">
            Krisha Women&apos;s Hospital · Narol, Ahmedabad
          </span>

          <h1 className="font-display text-display-lg text-text-base text-balance">
            We&apos;re here for you — reach out anytime
          </h1>
          <p className="mt-4 text-body text-text-muted max-w-measure">
            Whether you want to book an appointment, ask about a service, or simply need to speak
            with our care team — we&apos;re always a call or message away.
          </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Form + Contact Details — bottom 15% blends toward the map's bg-surface ── */}
      <section className="w-full bg-linear-to-b from-surface-subtle from-85% to-surface pt-10 lg:pt-14 pb-section-sm lg:pb-section">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left — Form */}
            <FadeIn>
              <h2 className="font-display text-display-sm text-text-base">Send us a message</h2>
              <p className="mt-2 mb-7 text-meta text-text-muted leading-relaxed">
                Fill in the form and we will get back to you shortly. Fields marked <span className="text-secondary font-semibold">*</span> are required.
              </p>
              <ContactForm />
            </FadeIn>

            {/* Right — Contact details */}
            <MotionGroup className="flex flex-col gap-4">
              <h2 className="font-display text-display-sm text-text-base mb-1">Contact details</h2>
              {contactCards.map((card) => (
                <div
                  key={card.label}
                  data-motion-item
                  className="bg-surface rounded-lg p-5 border border-border-muted flex items-start gap-4"
                >
                  {/*
                    rounded-md, per the radius ladder — `xl` is reserved for
                    image panels, and this is a small control.
                  */}
                  <div className="w-11 h-11 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-label uppercase text-text-subtle mb-1">{card.label}</p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="block text-meta font-semibold text-text-base hover:text-primary transition-colors leading-snug"
                      >
                        {card.primary}
                      </a>
                    ) : (
                      <p className="text-meta font-semibold text-text-base leading-snug">{card.primary}</p>
                    )}
                    <p className="mt-1 text-meta text-text-muted leading-relaxed">{card.secondary}</p>
                  </div>
                </div>
              ))}
            </MotionGroup>
          </div>
        </div>
      </section>

      {/*
        ── Map ──
        No blend into Footer: this page has no CTAStrip, so Footer's
        near-black would follow directly, too big a jump from white to fade.
        Flat colour, clean cut.
      */}
      <section className="w-full bg-surface pb-14 lg:pb-20">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <FadeIn>
          <div className="rounded-lg overflow-hidden border border-border-muted shadow-sm">
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
            <p className="text-meta text-text-muted">
              A 231–235, SF, Arbuda Trade Centre, Opposite Swaminarayan Complex, Narol – Vatva Turning, Narol, Ahmedabad — 382405
            </p>
            <a
              href="https://maps.app.goo.gl/yyAN6pwSQYNny7v18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-meta font-semibold text-primary hover:underline underline-offset-2 shrink-0"
            >
              Open in Google Maps →
            </a>
          </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
