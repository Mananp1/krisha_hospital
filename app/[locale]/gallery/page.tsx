import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTAStrip from '@/app/sections/CTAStrip';
import GalleryGrid from '@/app/sections/GalleryGrid';
import SectionHeader from '@/app/sections/SectionHeader';
import { galleryImages } from '@/app/data/gallery';

export const metadata: Metadata = {
  title: "Hospital Gallery — Facilities & Infrastructure | Krisha Women's Hospital",
  description:
    "Take a look inside Krisha Women's Hospital, Narol Ahmedabad — reception and waiting lounge, consulting rooms, sonography suite, in-house pharmacy, procedure room and modular operation theatre.",
  alternates: { canonical: '/gallery' },
  openGraph: {
    title: "Hospital Gallery — Krisha Women's Hospital",
    description:
      "Photos of the facilities at Krisha Women's Hospital, Narol, Ahmedabad.",
    url: '/gallery',
    images: [{ url: galleryImages[0].src, alt: galleryImages[0].alt }],
  },
};

export default function GalleryPage() {
  return (
    <>
      {/* ── Header ── */}
      <section className="w-full bg-surface-subtle pt-10 pb-12 lg:pt-14 lg:pb-16 relative overflow-hidden">

        <div className="relative max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
          <nav className="flex items-center gap-1 text-[13px] text-text-muted mb-8 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted/50 shrink-0" />
            <span className="text-text-base font-medium">Gallery</span>
          </nav>

          <SectionHeader
            eyebrow="OUR FACILITY"
            title="Inside Krisha Women's Hospital"
            subtitle="Reception and waiting lounges, consulting rooms, an in-house pharmacy, a fully equipped sonography suite and a modular operation theatre — purpose-built for comfort, safety and advanced women's care under one roof."
            centered={false}
            maxWidth={680}
          />
        </div>
      </section>

      {/* ── Catalogue ── */}
      <section className="w-full bg-surface py-12 lg:py-16">
        <div className="max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
          <GalleryGrid images={galleryImages} />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-12">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm w-full sm:w-auto"
            >
              <Link href="/book-appointment">Book Appointment</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none w-full sm:w-auto"
            >
              <Link href="/contact">Visit Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
