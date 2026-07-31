import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
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
      {/* ── Header — bottom 15% blends toward the catalogue's bg-surface ── */}
      <section className="w-full bg-linear-to-b from-surface-subtle from-85% to-surface pt-10 pb-12 lg:pt-14 lg:pb-16 relative overflow-hidden">

        <div className="relative max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
          <nav className="flex items-center gap-1 text-[13px] text-text-muted mb-8 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted shrink-0" />
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

      {/*
        ── Catalogue ──
        No blend into CTAStrip — white into deep plum is too big a jump.
        Flat bg-surface, clean cut.
      */}
      <section className="w-full bg-surface py-12 lg:py-16">
        <div className="max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
          {/*
            No Book Appointment / Visit Us pair here — CTAStrip sits directly
            below with the same booking action, so this was a duplicate.
          */}
          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
