import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
import { services } from '@/app/data/services';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site-config';
import MotionGroup from '@/app/animations/MotionGroup';

/*
  No "Book Appointment" entry: the closing CTA strip sits directly above the
  footer with the same WhatsApp link, so the two were adjacent duplicates.
*/
const quickLinks = [
  { label: 'Find a Doctor', href: '/#doctor' },
  { label: 'Our Services', href: '/#services' },
  { label: 'Hospital Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/#contact' },
];

const contactItems = [
  {
    icon: (
      <MapPinIcon size={16} />
    ),
    text: 'A 231–235, SF, Arbuda Trade Centre, Opposite Swaminarayan Complex, Narol – Vatva Turning, Narol, Ahmedabad — 382405',
  },
  {
    icon: (
      <PhoneIcon size={16} />
    ),
    text: '+91 78629 50676',
    href: 'tel:+917862950676',
  },
  {
    icon: (
      <MailIcon size={16} />
    ),
    text: CONTACT_EMAIL,
    href: CONTACT_EMAIL_HREF,
  },
  {
    icon: (
      <ClockIcon size={16} />
    ),
    // Must match lib/opd-hours.ts and the TopBar strip.
    text: 'OPD: Mon–Sat 11AM–2PM, 6PM–8PM · Sun 11AM–1PM · Emergency 24×7',
  },
];

export default function Footer() {
  const tServices = useTranslations('servicesSection');

  return (
    <footer id="contact" className="w-full bg-primary-950 pt-14 lg:pt-16">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">

        <MotionGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10">

          {/* Col 1 — About */}
          <div data-motion-item className="max-w-70">
            <div className="inline-block bg-white/95 rounded-md px-3 py-2 mb-5">
              <Image
                src="/krisha-logo.png"
                alt="Krisha Women's Hospital"
                width={107}
                height={52}
                className="w-22 h-auto"
              />
            </div>
            <p className="text-[13px] text-white/50 leading-5.5">
              Dedicated women&apos;s hospital led by Dr. Alhad Pande — providing
              compassionate, expert care in gynaecology, obstetrics, infertility
              and laparoscopic surgery at Narol, Ahmedabad.
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div data-motion-item>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-5">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-white/50 leading-5 hover:text-secondary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3 — Services (spans 2 of 5 cols on lg) */}
          <div data-motion-item className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-5">
              Our Services
            </h4>
            <div className="flex gap-6">
              <div className="flex flex-col gap-2.5 flex-1">
                {services.slice(0, 7).map((s) => (
                  <a
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="text-[13px] text-white/50 leading-5 hover:text-secondary transition-colors"
                  >
                    {tServices(`cards.${s.slug}.title`)}
                  </a>
                ))}
              </div>
              <div className="w-px bg-white/10 self-stretch" />
              <div className="flex flex-col gap-2.5 flex-1">
                {services.slice(7).map((s) => (
                  <a
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="text-[13px] text-white/50 leading-5 hover:text-secondary transition-colors"
                  >
                    {tServices(`cards.${s.slug}.title`)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 4 — Contact */}
          <div data-motion-item>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-5">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0 text-secondary">
                    {item.icon}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-[13px] text-white/50 leading-5.5 hover:text-secondary transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <p className="text-[13px] text-white/50 leading-5.5">{item.text}</p>
                  )}
                </div>
              ))}

              {/* Mini map */}
              <a
                href="https://maps.app.goo.gl/yyAN6pwSQYNny7v18"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-1 rounded-md overflow-hidden ring-1 ring-white/10 hover:ring-secondary/60 transition-all"
                aria-label="Open Krisha Women's Hospital on Google Maps"
              >
                <iframe
                  src="https://maps.google.com/maps?q=22.9644206,72.5916213&z=15&output=embed"
                  width="100%"
                  height="130"
                  style={{ border: 0, display: 'block', pointerEvents: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Krisha Women's Hospital map"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <div className="bg-white/5 px-3 py-2 flex items-center justify-between">
                  <span className="text-[11.5px] text-white/50">Narol, Ahmedabad</span>
                  <span className="text-[11px] font-semibold text-secondary">Get directions →</span>
                </div>
              </a>
            </div>
          </div>
        </MotionGroup>

        <div className="border-t border-white/10" />

        {/* white/40 on primary-950 was 3.75:1 at 13px, under the 4.5:1 floor; /50 clears 5.32:1. */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-[13px] text-white/50">
          <p>© 2026 Krisha Women&apos;s Hospital, Narol, Ahmedabad. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms-of-use" className="hover:text-white/70 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
