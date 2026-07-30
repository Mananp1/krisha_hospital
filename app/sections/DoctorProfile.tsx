import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, ClockIcon, MapPinIcon, GraduationCapIcon, AwardIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

const tags = [
  'High-Risk Pregnancy',
  'Normal & Painless Delivery',
  'Cesarean Section',
  'IVF & Infertility',
  'Pregnancy Ultrasound',
  'Laparoscopic Surgery',
  'Menopause Management',
  'Adolescent Gynecology',
  'Family Planning',
];

const metaItems = [
  {
    icon: (
      <ClockIcon size={18} />
    ),
    bold: 'OPD Hours',
    regular: 'Mon – Sat: 8:00 AM – 8:00 PM',
  },
  {
    icon: (
      <MapPinIcon size={18} />
    ),
    bold: 'Hospital',
    regular: "Krisha Women's Hospital, Narol, Ahmedabad",
  },
  {
    icon: (
      <GraduationCapIcon size={18} />
    ),
    bold: 'Qualifications',
    regular:
      'MBBS (GMC Vadodara) · DGO (Stanley Medical college , Chennai) · MD (GMC Rajkot)',
  },
  {
    icon: (
      <AwardIcon size={18} />
    ),
    bold: 'Fellowships',
    regular:
      "ART – Wings IVF, Ahmedabad · Advanced Laparoscopy – Eva Women's Hospital Ahmedabad",
  },
];

export default function DoctorProfile() {
  return (
    <section
      id="doctor"
      className="w-full bg-surface-subtle py-section-sm lg:py-section relative overflow-hidden"
    >

      <div className="relative max-w-page mx-auto px-5 lg:px-gutter flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        {/* Left — Photo Frame */}
        <FadeIn
          direction="right"
          className="relative flex-shrink-0 w-full max-w-[380px] lg:w-[470px] mx-auto lg:mx-0 pb-6 pr-2"
        >
          {/* Arch — brand device B1. Photography only. */}
          <div className="relative w-full aspect-[47/49] arch overflow-hidden bg-primary-50">
            <Image
              src="/doctor.jpeg"
              alt="Dr. Alhad Pande — Obstetrician, Gynecologist & Fertility Specialist"
              fill
              sizes="(min-width: 1024px) 470px, 380px"
              className="object-cover object-top z-10"
              priority
            />

            {/* Available badge */}
            <div className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-primary top-5 left-5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-text-inverse font-semibold text-[13px] whitespace-nowrap">
                Available for Consultation
              </span>
            </div>
          </div>

          {/* Experience badge — floats outside the photo frame */}
          <div className="absolute right-0 bottom-0 z-20 flex flex-col items-center justify-center bg-secondary rounded-lg px-5 py-4 shadow-float">
            <span className="font-extrabold text-text-inverse text-[28px] lg:text-[30px] leading-none">
              20+
            </span>
            <span className="text-text-inverse text-center text-[11px] mt-0.5">
              Years of care
            </span>
          </div>
        </FadeIn>

        {/* Right — Info */}
        <FadeIn delay={0.15} className="flex-1 min-w-0">
          <SectionHeader
            eyebrow="MEET YOUR SPECIALIST"
            title="Dr. Alhad Pande"
            centered={false}
          />

          <p className="mt-1 text-[15px] font-semibold text-primary leading-[23px]">
            Consultant Obstetrician, Gynecologist &amp; Fertility Specialist
          </p>

          <Badge
            variant="outline"
            className="h-auto overflow-visible rounded-pill mt-3 px-4 py-1.5 text-meta font-bold bg-primary-100 border-primary-200/60 text-primary-700"
          >
            MBBS · MD · DGO
          </Badge>

          {/*
            The cap only binds above ~1250px, where it would leave the bio stopping
            short of the tag row and meta grid directly beneath it. Released at xl so
            every block in this column shares one right edge.
          */}
          <p className="mt-4 mb-5 text-[15px] text-text-muted leading-6.5 max-w-[520px] xl:max-w-none">
            Dr. Alhad Pande is an experienced Obstetrician and Gynecologist with
            specialized training in infertility management, ultrasonography, and
            advanced laparoscopic surgery. With qualifications from reputed
            medical institutions and fellowships in assisted reproductive
            techniques and minimally invasive gynecology, Dr. Pande is committed
            to providing compassionate, evidence-based care for women at every
            stage of life.
          </p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="h-auto overflow-visible rounded-sm px-3 py-1 text-meta font-semibold border-border-muted text-primary-700 bg-surface"
              >
                {t}
              </Badge>
            ))}
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {metaItems.map((item) => (
              <div key={item.bold} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-primary-50 flex items-center justify-center flex-shrink-0 text-primary">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-text-base">
                    {item.bold}
                  </p>
                  <p className="text-[13px] text-text-muted leading-5">
                    {item.regular}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-6 py-3 h-auto text-[15px] font-semibold hover:bg-secondary-600 shadow-sm"
            >
              <a
                href="https://wa.me/917862950676"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Appointment
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-md px-6 py-3 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
            >
              <a href="tel:+917862950676">Call Now</a>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="rounded-md px-6 py-3 h-auto text-[15px] font-semibold text-text-muted hover:text-primary hover:bg-primary-50 shadow-none gap-1.5"
            >
              <Link href="/doctor">
                View Full Profile
                <ArrowRightIcon size={14} />
              </Link>
            </Button>
          </div>

          <p className="mt-3 text-[13px] text-text-muted">
            ગુજરાતીમાં સેવા ઉપલબ્ધ છે
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
