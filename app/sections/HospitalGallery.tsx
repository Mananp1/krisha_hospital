import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { galleryPreview } from '@/app/data/gallery';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

export default function HospitalGallery() {
  return (
    <section id="gallery" className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 md:px-10 lg:px-gutter">
        <SectionHeader
          eyebrow="OUR FACILITY"
          title="A glimpse of our hospital"
          subtitle="Purpose-built spaces designed for comfort, safety, and advanced care — all under one roof."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mt-10">
          {galleryPreview.map((img, i) => (
            <FadeIn
              key={img.src}
              direction="up"
              delay={i * 0.1}
              className={i === 2 ? 'sm:col-span-2 lg:col-span-1' : undefined}
            >
              <Link
                href="/gallery"
                aria-label={`${img.caption} — open the full hospital gallery`}
                className="group relative block aspect-4/3 rounded-lg overflow-hidden bg-primary-50 ring-1 ring-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  style={{ objectPosition: img.position ?? 'center' }}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Subtle black gradient — always visible for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
                {/* Brand-tinted overlay — reveals on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300" />
                {/* Caption — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 transition-all duration-300">
                  <p className="text-text-inverse text-[13px] font-semibold">{img.caption}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            asChild
            className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
          >
            <Link href="/gallery">
              View all photos
              <ArrowRightIcon size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
