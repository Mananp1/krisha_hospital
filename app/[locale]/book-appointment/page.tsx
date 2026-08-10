import type { Metadata } from 'next';
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/app/animations/FadeIn';
import MotionGroup from '@/app/animations/MotionGroup';
import AppointmentForm from '@/app/sections/AppointmentForm';

export const metadata: Metadata = {
  title: 'Book Appointment | Krisha Women\'s Hospital',
  description: 'Schedule an appointment with Dr. Alhad Pande at Krisha Women\'s Hospital. Specialising in obstetrics, gynaecology, infertility, and IVF.',
  alternates: { canonical: '/book-appointment' },
};

const contactDetails = [
  {
    icon: (
      <PhoneIcon size={22} />
    ),
    label: 'Call Us',
    value: '+91 78629 50676',
    note: '24×7 Emergency Available',
    href: 'tel:+917862950676',
  },
  {
    icon: (
      <MailIcon size={22} />
    ),
    label: 'Email Us',
    value: 'info@krishahospital.com',
    note: 'Response within 24 hours',
    href: 'mailto:info@krishahospital.com',
  },
  {
    icon: (
      <MapPinIcon size={22} />
    ),
    label: 'Visit Us',
    value: 'Nr. Akshar Chowk, Narol, Ahmedabad — 382405',
    note: 'Gujarat, India',
    href: 'https://maps.google.com/?q=Narol,Ahmedabad',
  },
  {
    icon: (
      <ClockIcon size={22} />
    ),
    label: 'OPD Hours',
    value: 'Mon – Sat: 11 AM–2 PM, 6 PM–8 PM',
    note: 'Sun: 11 AM–1 PM · Emergency 24×7',
    href: null,
  },
];

export default function BookAppointmentPage() {
  return (
    <section className="max-w-page mx-auto px-5 lg:px-gutter py-section-sm lg:py-section">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-base font-medium">Book Appointment</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
        {/* Form */}
        <FadeIn>
          <div className="mb-8">
            <span className="inline-block text-[12px] font-semibold tracking-widest uppercase text-secondary mb-3">
              Schedule a Visit
            </span>
            <h1 className="text-[28px] lg:text-[36px] font-bold text-text-base leading-tight mb-3">
              Book Your Appointment
            </h1>
            <p className="text-[15px] text-text-muted leading-relaxed max-w-xl">
              Fill in the details below and our team will confirm your appointment slot within 24 hours.
            </p>
          </div>
          <AppointmentForm />
        </FadeIn>

        {/* Contact sidebar */}
        <MotionGroup className="flex flex-col gap-4 lg:sticky lg:top-28">
          <h2 className="text-[16px] font-bold text-text-base">Contact Information</h2>
          {contactDetails.map((item) => (
            <div
              key={item.label}
              data-motion-item
              className="flex items-start gap-4 p-4 rounded-lg border border-border-muted bg-surface-subtle"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-100 text-primary flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-[14px] font-semibold text-text-base hover:text-primary transition-colors block leading-snug"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-[14px] font-semibold text-text-base leading-snug">{item.value}</p>
                )}
                <p className="text-[12px] text-text-muted mt-0.5">{item.note}</p>
              </div>
            </div>
          ))}
        </MotionGroup>
      </div>
    </section>
  );
}
