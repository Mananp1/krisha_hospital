import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/app/data/services';

const quickLinks = [
  { label: 'Find a Doctor', href: '/#doctor' },
  { label: 'Book Appointment', href: 'https://wa.me/917862950676' },
  { label: 'Our Services', href: '/#services' },
  { label: 'Contact Us', href: '/#contact' },
];

const socials = [
  {
    label: 'Facebook',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.855L.06 23.47l5.799-1.44A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.015-1.378l-.36-.214-3.44.853.88-3.338-.235-.375A9.814 9.814 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z" />
      </svg>
    ),
  },
];

const contactItems = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: '231–235, A Block, 2nd Floor, Arbuda Trade Centre, Near Meldi Mata Mandir, Swami Samarth Road, Narol, Ahmedabad — 382405',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
      </svg>
    ),
    text: '+91 78629 50676',
    href: 'tel:+917862950676',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
    text: 'care@krishawomenshospital.in',
    href: 'mailto:care@krishawomenshospital.in',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    text: 'Mon–Sat 8AM–8PM · Emergency 24×7',
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-primary-950 pt-14 lg:pt-16">
      <div className="max-w-360 mx-auto px-5 lg:px-25">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10">

          {/* Col 1 — About */}
          <div className="max-w-70">
            <div className="inline-block bg-white/95 rounded-[10px] px-3 py-2 mb-5">
              <Image
                src="/Logo.png"
                alt="Krisha Women's Hospital"
                width={107}
                height={52}
                className="w-22 h-auto"
              />
            </div>
            <p className="text-[13px] text-white/50 leading-5.5 mb-5">
              Dedicated women&apos;s hospital led by Dr. Alhad Pande — providing
              compassionate, expert care in gynaecology, obstetrics, infertility
              and laparoscopic surgery at Narol, Ahmedabad.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 text-white/70 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
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
          <div className="lg:col-span-2">
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
                    {s.name}
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
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-[1.5px] mb-5">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-[8px] bg-white/10 flex items-center justify-center flex-shrink-0 text-secondary">
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
            </div>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-3 text-[13px] text-white/40">
          <p>© 2026 Krisha Women&apos;s Hospital, Narol, Ahmedabad. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="#" className="hover:text-white/70 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
