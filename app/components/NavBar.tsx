'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/app/data/services';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Doctor', href: '/#doctor' },
  { label: 'Contact', href: '/#contact' },
];


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState('Home');
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-border-muted h-21 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm' : 'bg-surface'
        }`}
      >
        <div className="flex items-center justify-between h-full max-w-360 mx-auto px-5 lg:px-25">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/Logo.png"
              alt="Krisha Women's Hospital"
              width={107}
              height={52}
              className="w-21.25 lg:w-26.75 h-auto"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8.5">
            {navLinks.map((link) =>
              link.label === 'Services' ? (
                <div key="Services" className="relative group">
                  <Link
                    href="/#services"
                    onClick={() => setActive('Services')}
                    className={`flex items-center gap-1 text-[15px] transition-colors pb-0.5 border-b-[2.5px] ${
                      active === 'Services'
                        ? 'text-primary font-semibold border-secondary'
                        : 'text-text-base font-medium border-transparent'
                    }`}
                  >
                    Services
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>

                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-surface border border-border-muted rounded-2xl shadow-xl p-5 w-145">
                      <div className="flex">
                        <div className="flex flex-col flex-1">
                          {services.slice(0, 7).map((s) => (
                            <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-2 text-[13px] text-text-muted hover:text-primary py-1.5 transition-colors leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                              {s.name}
                            </Link>
                          ))}
                        </div>
                        <div className="w-px bg-border-muted mx-5 self-stretch" />
                        <div className="flex flex-col flex-1">
                          {services.slice(7).map((s) => (
                            <Link key={s.slug} href={`/services/${s.slug}`} className="flex items-center gap-2 text-[13px] text-text-muted hover:text-primary py-1.5 transition-colors leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                              {s.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`text-[15px] transition-colors pb-0.5 border-b-[2.5px] ${
                    active === link.label
                      ? 'text-primary font-semibold border-secondary'
                      : 'text-text-base font-medium border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+917862950676"
              className="flex items-center px-6 py-3 text-[15px] font-semibold rounded-full border-[1.5px] border-primary text-primary transition-colors hover:bg-primary hover:text-text-inverse"
            >
              Call Now
            </a>
            <Link
              href="/#appointment"
              className="flex items-center px-6 py-3 text-[15px] font-semibold text-text-inverse bg-secondary rounded-full transition-all hover:bg-secondary-600"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile: Call + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="tel:+917862950676"
              className="flex items-center gap-1.5 text-primary text-[13.5px] font-semibold"
              aria-label="Call us"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
              </svg>
              <span className="hidden sm:inline">+91 78629 50676</span>
            </a>
            <button
              className="p-2 rounded-md text-text-base"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-100 flex lg:hidden">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="w-72 bg-surface h-full flex flex-col p-8 gap-6 shadow-2xl animate-slide-in overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <Image
                src="/Logo.png"
                alt="Krisha Women's Hospital"
                width={90}
                height={44}
                className="w-22.5 h-auto"
              />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="text-text-base p-1"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {navLinks.map((link) =>
              link.label === 'Services' ? (
                <div key="Services" className="border-b border-border-muted pb-4">
                  <button
                    onClick={() => setServicesOpen((o) => !o)}
                    className={`w-full flex items-center justify-between text-[16px] font-medium ${
                      active === 'Services' ? 'text-primary' : 'text-text-base'
                    }`}
                  >
                    Services
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {servicesOpen && (
                    <div className="flex flex-col mt-3 pl-2 gap-1">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          onClick={() => { setDrawerOpen(false); setServicesOpen(false); }}
                          className="flex items-center gap-2 text-[14px] text-text-muted hover:text-primary py-1.5 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setDrawerOpen(false); }}
                  className={`text-[16px] font-medium border-b border-border-muted pb-4 last:border-0 ${
                    active === link.label ? 'text-primary' : 'text-text-base'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}

            <div className="flex flex-col gap-3 mt-2">
              <a
                href="tel:+917862950676"
                className="text-center py-3 rounded-full text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse transition-colors"
              >
                Call Now
              </a>
              <Link
                href="/#appointment"
                className="text-center py-3 rounded-full text-[15px] font-semibold text-text-inverse bg-secondary hover:bg-secondary-600 transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
