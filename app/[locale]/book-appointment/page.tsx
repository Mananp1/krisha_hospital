import type { Metadata } from 'next';
import Link from 'next/link';
import AppointmentForm from '@/app/sections/AppointmentForm';

export const metadata: Metadata = {
  title: 'Book Appointment | Krisha Women\'s Hospital',
  description: 'Schedule an appointment with Dr. Alhad Pande at Krisha Women\'s Hospital. Specialising in obstetrics, gynaecology, infertility, and IVF.',
  alternates: { canonical: '/book-appointment' },
};

const contactDetails = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
      </svg>
    ),
    label: 'Call Us',
    value: '+91 78629 50676',
    note: '24×7 Emergency Available',
    href: 'tel:+917862950676',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email Us',
    value: 'info@krishahospital.com',
    note: 'Response within 24 hours',
    href: 'mailto:info@krishahospital.com',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Visit Us',
    value: 'Nr. Akshar Chowk, Narol, Ahmedabad — 382405',
    note: 'Gujarat, India',
    href: 'https://maps.google.com/?q=Narol,Ahmedabad',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: 'OPD Hours',
    value: 'Mon – Sat: 9:00 AM – 7:30 PM',
    note: 'Sunday: Closed',
    href: null,
  },
];

export default function BookAppointmentPage() {
  return (
    <section className="max-w-360 mx-auto px-5 lg:px-25 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-text-muted mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-base font-medium">Book Appointment</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
        {/* Form */}
        <div>
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
        </div>

        {/* Contact sidebar */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-28">
          <h2 className="text-[16px] font-bold text-text-base">Contact Information</h2>
          {contactDetails.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-4 rounded-2xl border border-border-muted bg-surface-subtle"
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
        </div>
      </div>
    </section>
  );
}