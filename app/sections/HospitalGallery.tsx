import Image from 'next/image';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

const images = [
  {
    src: '/hospital1.jpg',
    alt: "Reception area at Krisha Women's Hospital",
    caption: 'Reception & Patient Lounge',
  },
  {
    src: '/hospital2.jpg',
    alt: "Operation theatre at Krisha Women's Hospital",
    caption: 'Advanced Operation Theatre',
  },
  {
    src: '/hospital3.jpg',
    alt: "Patient ward at Krisha Women's Hospital",
    caption: 'Comfortable Patient Wards',
  },
];

export default function HospitalGallery() {
  return (
    <section id="gallery" className="w-full bg-surface py-12 lg:py-20">
      <div className="max-w-360 mx-auto px-5 lg:px-25">
        <SectionHeader
          eyebrow="OUR FACILITY"
          title="A glimpse of our hospital"
          subtitle="Purpose-built spaces designed for comfort, safety, and advanced care — all under one roof."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {images.map((img, i) => (
            <FadeIn key={img.src} direction="up" delay={i * 0.1}>
              <div className="group relative aspect-4/3 rounded-[18px] overflow-hidden bg-primary-50 ring-1 ring-primary/10">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Brand-tinted overlay — reveals on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Caption — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-text-inverse text-[13px] font-semibold">{img.caption}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
