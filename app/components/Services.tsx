import type { ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface Service {
  title: string;
  desc: string;
  icon: ReactNode;
}

const services: Service[] = [
  {
    title: 'Pregnancy & Maternity Care',
    desc: 'Comprehensive care throughout pregnancy, delivery, and postpartum to ensure the health of both mother and baby.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.5" />
        <path d="M7 11c0 4.5 2.3 7.5 5 8.5 2.7-1 5-4 5-8.5" />
        <path d="M9.5 19.5l-1 2M14.5 19.5l1 2" />
      </svg>
    ),
  },
  {
    title: 'High-Risk Pregnancy Management',
    desc: 'Expert monitoring and treatment for pregnancies with medical complications or increased risk factors.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: 'Antenatal & Gynecological Sonography',
    desc: 'Advanced ultrasound services including NT/NB scans, anomaly scans, and routine pregnancy imaging for accurate diagnosis and monitoring.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="m8 21 4-4 4 4" />
        <path d="M7 10.5c1.5-3 4.5-3 5 0s3.5 3 5 0" />
      </svg>
    ),
  },
  {
    title: 'Infertility Treatment (IUI/IVF)',
    desc: 'Personalized fertility evaluation and assisted reproductive treatments to help couples achieve parenthood.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: 'Advanced Laparoscopic & Hysteroscopic Surgery',
    desc: 'Minimally invasive procedures for fibroids, ovarian cysts, uterine abnormalities, and other gynecological conditions with faster recovery.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
        <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
        <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
        <path d="M14 14.5h2.5A3.5 3.5 0 0 0 20 11H4a3.5 3.5 0 0 0 3.5 3.5H10" />
      </svg>
    ),
  },
  {
    title: 'Menopause Consultation & Treatment',
    desc: 'Compassionate care and effective treatment for hormonal changes, hot flashes, osteoporosis prevention, and other menopausal concerns.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    title: 'Adolescent Gynecology',
    desc: 'Specialized healthcare for teenage girls, addressing menstrual disorders, hormonal issues, and reproductive health concerns.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    title: 'Preconception Counseling',
    desc: 'Medical guidance and health optimization for couples planning a safe and healthy pregnancy.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Painless Vaginal Delivery',
    desc: 'Modern labor management with pain relief options to provide a safer and more comfortable childbirth experience.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Tuboplasty & Fertility Procedures',
    desc: 'Surgical correction of blocked or damaged fallopian tubes to improve natural fertility where appropriate.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M6 15V9a6 6 0 0 1 6-6" />
        <path d="M18 9v6a6 6 0 0 1-6 6" />
      </svg>
    ),
  },
  {
    title: 'Cervical Cerclage',
    desc: 'A preventive procedure to strengthen the cervix and reduce the risk of premature birth in selected pregnancies.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
  },
  {
    title: 'Cervical Cancer Screening & HPV Vaccination',
    desc: 'Early detection through screening and preventive vaccination to reduce the risk of cervical cancer.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    title: 'Family Planning & Contraceptive Counseling',
    desc: 'Personalized advice on birth control methods, spacing pregnancies, and reproductive health planning.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
  },
];

const LAST = services.length - 1;

export default function Services() {
  return (
    <section id="services" className="w-full bg-surface py-10 lg:py-16">
      <div className="max-w-360 mx-auto px-5 lg:px-25">
        <SectionHeader
          eyebrow="WHAT WE OFFER"
          title="Specialised women's healthcare services"
          subtitle="Comprehensive care under one roof — from routine consultations to the most advanced fertility and surgical treatments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`flex flex-col p-7 rounded-[18px] bg-surface border border-border-muted${i === LAST ? ' lg:col-start-2' : ''}`}
            >
              <div className="w-[54px] h-[54px] bg-primary-50 text-primary rounded-[14px] flex items-center justify-center flex-shrink-0">
                {s.icon}
              </div>

              <h3 className="mt-4 font-bold text-[17px] text-text-base leading-snug">
                {s.title}
              </h3>

              <p className="mt-2 text-[14px] text-text-muted leading-[22px] grow">
                {s.desc}
              </p>

              <a
                href="#services"
                className="mt-4 text-[13px] font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                Learn more →
              </a>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="#services"
            className="px-7 py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-full hover:bg-secondary-600 transition-colors"
          >
            View All Services →
          </a>
        </div>
      </div>
    </section>
  );
}
