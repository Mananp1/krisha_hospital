import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ActivityIcon,
  SunIcon,
  UserIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  SearchIcon,
  CalendarIcon,
} from 'lucide-react';
import {
  PregnancyIcon,
  SonographyIcon,
  LaparoscopyIcon,
  FertilityIcon,
  TuboplastyIcon,
  CerclageIcon,
} from '@/components/brand/icons';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

interface Service {
  title: string;
  slug: string;
  desc: string;
  icon: ReactNode;
}

const services: Service[] = [
  {
    title: 'Pregnancy & Maternity Care',
    slug: 'pregnancy-maternity-care',
    desc: 'Comprehensive care throughout pregnancy, delivery, and postpartum to ensure the health of both mother and baby.',
    icon: (<PregnancyIcon size={28} />),
  },
  {
    title: 'High-Risk Pregnancy Management',
    slug: 'high-risk-pregnancy',
    desc: 'Expert monitoring and treatment for pregnancies with medical complications or increased risk factors.',
    icon: (<ActivityIcon size={28} />),
  },
  {
    title: 'Antenatal & Gynecological Sonography',
    slug: 'antenatal-gynecological-sonography',
    desc: 'Advanced ultrasound services including NT/NB scans, anomaly scans, and routine pregnancy imaging for accurate diagnosis and monitoring.',
    icon: (<SonographyIcon size={28} />),
  },
  {
    title: 'Infertility Treatment (IUI/IVF)',
    slug: 'infertility-treatment',
    desc: 'Personalized fertility evaluation and assisted reproductive treatments to help couples achieve parenthood.',
    icon: (<FertilityIcon size={28} />),
  },
  {
    title: 'Advanced Laparoscopic & Hysteroscopic Surgery',
    slug: 'laparoscopic-hysteroscopic-surgery',
    desc: 'Minimally invasive procedures for fibroids, ovarian cysts, uterine abnormalities, and other gynecological conditions with faster recovery.',
    icon: (<LaparoscopyIcon size={28} />),
  },
  {
    title: 'Menopause Consultation & Treatment',
    slug: 'menopause-consultation',
    desc: 'Compassionate care and effective treatment for hormonal changes, hot flashes, osteoporosis prevention, and other menopausal concerns.',
    icon: (<SunIcon size={28} />),
  },
  {
    title: 'Adolescent Gynecology',
    slug: 'adolescent-gynecology',
    desc: 'Specialized healthcare for teenage girls, addressing menstrual disorders, hormonal issues, and reproductive health concerns.',
    icon: (<UserIcon size={28} />),
  },
  {
    title: 'Preconception Counseling',
    slug: 'preconception-counseling',
    desc: 'Medical guidance and health optimization for couples planning a safe and healthy pregnancy.',
    icon: (<ClipboardListIcon size={28} />),
  },
  {
    title: 'Painless Vaginal Delivery',
    slug: 'painless-vaginal-delivery',
    desc: 'Modern labor management with pain relief options to provide a safer and more comfortable childbirth experience.',
    icon: (<ShieldCheckIcon size={28} />),
  },
  {
    title: 'Tuboplasty & Fertility Procedures',
    slug: 'tuboplasty-fertility-procedures',
    desc: 'Surgical correction of blocked or damaged fallopian tubes to improve natural fertility where appropriate.',
    icon: (<TuboplastyIcon size={28} />),
  },
  {
    title: 'Cervical Cerclage',
    slug: 'cervical-cerclage',
    desc: 'A preventive procedure to strengthen the cervix and reduce the risk of premature birth in selected pregnancies.',
    icon: (<CerclageIcon size={28} />),
  },
  {
    title: 'Cervical Cancer Screening & HPV Vaccination',
    slug: 'cervical-cancer-screening',
    desc: 'Early detection through screening and preventive vaccination to reduce the risk of cervical cancer.',
    icon: (<SearchIcon size={28} />),
  },
  {
    title: 'Family Planning & Contraceptive Counseling',
    slug: 'family-planning-contraceptive-counseling',
    desc: 'Personalized advice on birth control methods, spacing pregnancies, and reproductive health planning.',
    icon: (<CalendarIcon size={28} />),
  },
];

const LAST = services.length - 1;

export default function Services() {
  return (
    <section id="services" className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
        <SectionHeader
          eyebrow="WHAT WE OFFER"
          title="Specialised women's healthcare services"
          subtitle="Comprehensive care under one roof — from routine consultations to the most advanced fertility and surgical treatments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {services.map((s, i) => (
            <FadeIn
              key={s.title}
              direction="up"
              delay={i < 3 ? i * 0.08 : 0}
              className={i === LAST ? 'lg:col-start-2' : undefined}
            >
              <div className="group flex flex-col p-7 rounded-[18px] bg-primary border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-float h-full">
                <div className="w-[54px] h-[54px] bg-white/15 text-white rounded-[14px] flex items-center justify-center shrink-0 transition-colors group-hover:bg-white/25">
                  {s.icon}
                </div>

                <h3 className="mt-4 font-bold text-[17px] text-white leading-snug">
                  {s.title}
                </h3>

                <p className="mt-2 text-[14px] text-white/70 leading-5.5 grow">
                  {s.desc}
                </p>

                <Link
                  href={`/services/${s.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 no-underline group-hover:text-white transition-colors"
                >
                  Learn more
                  <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
