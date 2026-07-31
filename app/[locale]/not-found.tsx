import Image from 'next/image';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';

/**
 * Reached via the `[...rest]` catch-all for unmatched URLs, and by any
 * `notFound()` call inside the locale segment.
 *
 * Full chrome — TopBar, NavBar, Footer — on purpose. A dead end is the
 * worst possible place to strip a visitor of navigation, and someone who
 * mistyped a URL for a hospital is often looking for a phone number, which
 * the TopBar carries.
 *
 * Links use the locale-aware `Link` from `i18n/navigation`, not `next/link`:
 * a visitor who hits a bad URL under `/hi` should stay in Hindi rather than
 * being silently dropped back into English.
 */
export default function NotFound() {
  const suggestions = [
    { href: '/#services', label: 'Our Services' },
    { href: '/doctor', label: 'Meet the Doctor' },
    { href: '/gallery', label: 'Hospital Gallery' },
    { href: '/contact', label: 'Contact & Directions' },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavBar />

      <main className="flex-1 flex items-center justify-center bg-surface py-section-sm lg:py-section px-5">
        <div className="w-full max-w-2xl text-center">
          <Image
            src="/krisha-logo.png"
            alt=""
            aria-hidden="true"
            width={358}
            height={184}
            className="w-32 h-auto mx-auto opacity-90"
          />

          {/*
            Decorative, and already stated by the heading below — announcing
            "404" to a screen reader before the plain-language explanation
            adds nothing.
          */}
          <p
            aria-hidden="true"
            className="mt-8 font-display text-[88px] lg:text-[116px] leading-none text-primary-100 tabular-nums select-none"
          >
            404
          </p>

          <h1 className="mt-2 font-display text-display text-text-base">
            This page doesn&apos;t exist
          </h1>

          <p className="mt-4 text-body text-text-muted max-w-measure mx-auto">
            The page you&apos;re looking for may have been moved or removed.
            Everything else is still where you left it.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mt-8">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-body font-semibold hover:bg-secondary-600 shadow-none"
            >
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-body font-semibold border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <Link href="/book-appointment">Book an Appointment</Link>
            </Button>
          </div>

          {/*
            The likely destinations, since the visitor arrived here without
            one. Rule-separated rather than boxed — this is a footnote to the
            message above, not a second call to action competing with it.
          */}
          <div className="mt-12 pt-8 border-t border-border-muted">
            <p className="text-label uppercase text-text-subtle">
              Or head straight to
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 mt-4">
              {suggestions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-meta font-semibold text-primary no-underline hover:text-secondary transition-colors"
                  >
                    {item.label}
                    <ArrowRightIcon
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
