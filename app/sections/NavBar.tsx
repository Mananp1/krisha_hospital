'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MenuIcon, XIcon, ChevronDownIcon, PhoneIcon } from 'lucide-react';
import { services } from '@/app/data/services';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@/components/ui/sheet';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Doctor', href: '/doctor' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const pathname = usePathname();
  const active = pathname.startsWith('/services')
    ? 'Services'
    : pathname.startsWith('/gallery')
      ? 'Gallery'
      : pathname.startsWith('/doctor')
        ? 'Doctor'
        : pathname.startsWith('/contact')
          ? 'Contact'
          : 'Home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-all duration-300 border-b border-border-muted h-22 md:h-24 lg:h-25 xl:h-27 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-surface'
      }`}
    >
      <div className="flex items-center justify-between h-full max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Logo.png"
            alt="Krisha Women's Hospital"
            width={358}
            height={184}
            className="w-28 sm:w-30 md:w-33 lg:w-34 xl:w-40 h-auto"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8.5">
          {navLinks.map((link) =>
            link.label === 'Services' ? (
              <div key="Services" className="relative group">
                <button
                  type="button"
                  className={`flex items-center gap-1 text-[14px] xl:text-[15px] whitespace-nowrap transition-all duration-200 pb-0.5 border-b-[2.5px] group-hover:text-primary group-hover:border-secondary ${
                    active === 'Services'
                      ? 'text-primary font-semibold border-secondary'
                      : 'text-text-base font-medium border-transparent'
                  }`}
                >
                  Services
                  <ChevronDownIcon
                    size={13}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>

                <div className="absolute top-full left-0 pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 ease-out">
                  <div className="bg-surface border border-border-muted rounded-md shadow-card px-5 py-4 w-160">
                    <div className="flex items-start">
                      <div className="flex flex-col gap-2 flex-1">
                        {services.slice(0, 7).map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="text-[13.5px] text-text-base font-medium leading-snug hover:text-secondary hover:translate-x-0.5 transition-all duration-150"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                      <div className="w-px bg-border-muted mx-4 self-stretch" />
                      <div className="flex flex-col gap-2 flex-1">
                        {services.slice(7).map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="text-[13.5px] text-text-base font-medium leading-snug hover:text-secondary hover:translate-x-0.5 transition-all duration-150"
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
                className={`text-[14px] xl:text-[15px] whitespace-nowrap transition-colors pb-0.5 border-b-[2.5px] hover:text-primary hover:border-secondary ${
                  active === link.label
                    ? 'text-primary font-semibold border-secondary'
                    : 'text-text-base font-medium border-transparent'
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
          {/* Below xl the bigger logo needs the room — the number stays one tap
              away in the TopBar and on the WhatsApp FAB. */}
          <Button
            variant="outline"
            asChild
            className="hidden xl:inline-flex rounded-md px-6 py-3 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
          >
            <a href="tel:+917862950676">Call Now</a>
          </Button>
          <Button
            variant="secondary"
            asChild
            className="rounded-md px-4.5 xl:px-6 py-3 h-auto text-[14px] xl:text-[15px] font-semibold hover:bg-secondary-600 shadow-sm whitespace-nowrap"
          >
            <Link href="/book-appointment">
              Book Appointment
            </Link>
          </Button>
        </div>

        {/* Mobile: Call + Hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <a
            href="tel:+917862950676"
            className="flex items-center gap-1.5 text-primary text-[13.5px] font-semibold"
            aria-label="Call us"
          >
            <PhoneIcon size={15} />
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
              className="w-72 sm:w-80 bg-surface p-8 gap-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <Image
                  src="/Logo.png"
                  alt="Krisha Women's Hospital"
                  width={358}
                  height={184}
                  className="w-30 h-auto"
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
                  <div
                    key="Services"
                    className="border-b border-border-muted pb-4"
                  >
                    <button
                      onClick={() => setServicesOpen((o) => !o)}
                      className={`w-full flex items-center justify-between text-[16px] font-medium ${
                        active === 'Services'
                          ? 'text-primary'
                          : 'text-text-base'
                      }`}
                    >
                      Services
                      <ChevronDownIcon
                        size={16}
                        className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="flex flex-col mt-3 pl-2 gap-0.5">
                        {services.map((s) => (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            onClick={() => {
                              setDrawerOpen(false);
                              setServicesOpen(false);
                            }}
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
                ),
              )}

              <div className="flex flex-col gap-3 mt-2">
                <Button
                  variant="outline"
                  asChild
                  className="rounded-md py-3 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
                >
                  <a href="tel:+917862950676">Call Now</a>
                </Button>
                <Button
                  variant="secondary"
                  asChild
                  className="rounded-md py-3 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Link href="/book-appointment">
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
