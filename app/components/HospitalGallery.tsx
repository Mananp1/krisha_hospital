import Image from 'next/image';
import SectionHeader from './SectionHeader';

const images = [
  {
    src: '/gallery-1.jpg',
    alt: "Reception area at Krisha Women's Hospital",
  },
  {
    src: '/gallery-2.jpg',
    alt: "Operation theatre at Krisha Women's Hospital",
  },
  {
    src: '/gallery-3.jpg',
    alt: "Patient ward at Krisha Women's Hospital",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {images.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-primary-50"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
