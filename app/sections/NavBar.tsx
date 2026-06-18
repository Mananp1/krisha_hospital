'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';
import { services } from '@/app/data/services';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Doctor', href: '/doctor' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const pathname = usePathname();
  const active =
    pathname.startsWith('/services') ? 'Services' :
    pathname.startsWith('/doctor')   ? 'Doctor'   :
    pathname.startsWith('/contact')  ? 'Contact'  :
    'Home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-border-muted h-21 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-surface'
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
                  className={`flex items-center gap-1 text-[15px] transition-colors pb-0.5 border-b-[2.5px] ${
                    active === 'Services'
                      ? 'text-primary font-semibold border-secondary'
                      : 'text-text-base font-medium border-transparent'
                  }`}
                >
                  Services
                  <ChevronDownIcon
                    size={13}
                    strokeWidth={2.5}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </Link>

                {/* Mega menu — pt-2 brings panel 8px closer; colored top border anchors it to the nav link */}
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                  <div className="bg-surface border-l border-r border-b border-border-muted border-t-2 border-t-secondary rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] px-6 py-5 w-160">
                    <div className="flex">
                      <div className="flex flex-col flex-1">
                        {services.slice(0, 7).map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="text-[13.5px] text-text-base font-medium leading-5 py-1 hover:text-secondary hover:translate-x-1 transition-all duration-200"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                      <div className="w-px bg-border-muted mx-5 self-stretch" />
                      <div className="flex flex-col flex-1">
                        {services.slice(7).map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="text-[13.5px] text-text-base font-medium leading-5 py-1 hover:text-secondary hover:translate-x-1 transition-all duration-200"
                          >
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
          <Button
            variant="outline"
            asChild
            className="rounded-full px-6 py-3 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
          >
            <a href="tel:+917862950676">Call Now</a>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="rounded-full px-6 py-3 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
          >
            <a
              href="https://wa.me/917862950676"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Appointment
            </a>
          </Button>
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

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-base"
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              showCloseButton={false}
              className="w-72 bg-surface p-8 gap-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <Image
                  src="/Logo.png"
                  alt="Krisha Women's Hospital"
                  width={90}
                  height={44}
                  className="w-22.5 h-auto"
                />
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-text-base"
                    aria-label="Close menu"
                  >
                    <XIcon />
                  </Button>
                </SheetClose>
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
                      <ChevronDownIcon
                        size={16}
                        strokeWidth={2.5}
                        className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="flex flex-col mt-3 pl-2 gap-0.5">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            onClick={() => { setDrawerOpen(false); setServicesOpen(false); }}
                            className="text-[13.5px] text-text-muted font-medium hover:text-secondary py-1.5 transition-colors leading-snug"
                          >
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
                    onClick={() => setDrawerOpen(false)}
                    className={`text-[16px] font-medium border-b border-border-muted pb-4 last:border-0 ${
                      active === link.label ? 'text-primary' : 'text-text-base'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="flex flex-col gap-3 mt-2">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full py-3 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
                >
                  <a href="tel:+917862950676">Call Now</a>
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="rounded-full py-3 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  <a
                    href="https://wa.me/917862950676"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Appointment
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
