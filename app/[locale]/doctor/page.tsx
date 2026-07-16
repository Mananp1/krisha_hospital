import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CTAStrip from '@/app/sections/CTAStrip';

export const metadata: Metadata = {
  title:
    "Dr. Alhad Pande — Obstetrician, Gynecologist & Fertility Specialist | Krisha Women's Hospital",
  description:
    "Meet Dr. Alhad Pande, MBBS MD DGO — Obstetrician, Gynecologist and Fertility Specialist at Krisha Women's Hospital, Narol, Ahmedabad with 20+ years of expertise in high-risk pregnancy, IVF, and laparoscopic surgery.",
  alternates: { canonical: '/doctor' },
};

function SectionAccent() {
  return <span className="w-1 h-7 rounded-full bg-secondary shrink-0" />;
}

const qualifications = [
  {
    degree: 'MBBS',
    institute: 'Government Medical College, Vadodara',
    detail: 'Foundation in clinical medicine and surgery',
  },
  {
    degree: 'DGO',
    institute: 'Stanley Medical College, Chennai',
    detail:
      "Diploma in Gynaecology & Obstetrics — specialty training in women's health",
  },
  {
    degree: 'MD — Obstetrics & Gynaecology',
    institute: 'Government Medical College, Rajkot',
    detail:
      'Advanced postgraduate degree in obstetrics, high-risk pregnancy, and gynaecological disorders',
  },
  {
    degree: 'Fellowship in ART',
    institute: 'Wings IVF, Ahmedabad',
    detail:
      'Hands-on training in IUI, IVF, and ICSI protocols under senior reproductive medicine specialists',
  },
  {
    degree: 'Fellowship in Advanced Laparoscopy',
    institute: "Eva Women's Hospital, Ahmedabad",
    detail:
      'Minimally invasive surgical techniques for complex gynaecological conditions',
  },
];

const expertise = [
  {
    label: 'High-Risk Pregnancy Management',
    description:
      'Expert supervision for pregnancies complicated by gestational diabetes, hypertension, twin or multiple pregnancies, placenta previa, and previous cesarean sections.',
  },
  {
    label: 'Normal & Painless Delivery',
    description:
      'Skilled advocate of physiological birth with access to modern pain-relief options including epidural analgesia for a safer, more comfortable labour experience.',
  },
  {
    label: 'IVF & Infertility Treatment',
    description:
      'Fellowship-trained in Assisted Reproductive Techniques (ART) — providing complete fertility workups, IUI, IVF, and ICSI with compassionate, personalised care.',
  },
  {
    label: 'Advanced Laparoscopic Surgery',
    description:
      'Minimally invasive procedures for fibroids, ovarian cysts, endometriosis, ectopic pregnancies, and uterine abnormalities with faster recovery and minimal scarring.',
  },
  {
    label: 'Hysteroscopic Procedures',
    description:
      "Diagnostic and operative hysteroscopy for uterine polyps, submucous fibroids, intrauterine adhesions (Asherman's syndrome), and uterine septa.",
  },
  {
    label: 'Antenatal Ultrasonography',
    description:
      'On-site obstetric and gynaecological ultrasound including NT/NB scan, anomaly scan, growth scan, and fetal Doppler for accurate monitoring throughout pregnancy.',
  },
  {
    label: 'Adolescent Gynecology',
    description:
      'Sensitive, specialised care for teenage girls navigating menstrual irregularities, PCOS, hormonal imbalances, and reproductive health concerns.',
  },
  {
    label: 'Menopause Management',
    description:
      'Holistic approach to perimenopause and menopause including hormone therapy counseling, bone health evaluation, and lifestyle-based symptom management.',
  },
  {
    label: 'Family Planning & Contraception',
    description:
      'Full spectrum of contraceptive counseling, IUD insertion, hormonal methods, and permanent family planning solutions — all in a confidential, judgment-free environment.',
  },
];

const consultDetails = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    label: 'OPD Hours',
    value: 'Monday – Saturday',
    sub: '8:00 AM – 8:00 PM',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
      </svg>
    ),
    label: 'Appointments',
    value: '+91 78629 50676',
    sub: 'Emergency care 24×7',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Location',
    value: "Krisha Women's Hospital",
    sub: '231–235, A Block, 2nd Floor, Arbuda Trade Centre, Narol, Ahmedabad – 382405',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    label: 'Languages',
    value: 'Gujarati · Hindi · English',
    sub: 'ગુજરાતીમાં સેવા ઉપલબ્ધ છે',
  },
];

const principles = [
  {
    label: 'Patient-First Approach',
    desc: "Every decision is made with the individual woman's physical and emotional well-being as the top priority.",
  },
  {
    label: 'Evidence-Based Practice',
    desc: 'Treatment protocols grounded in the latest clinical research and FOGSI guidelines.',
  },
  {
    label: 'Minimal Intervention',
    desc: 'Surgical and pharmaceutical intervention only when clearly necessary — never routine.',
  },
  {
    label: 'Continuity of Care',
    desc: 'From the first OPD visit through delivery, surgery, or fertility treatment — one trusted doctor throughout.',
  },
];

const highlights = [
  { stat: '20+', label: 'Years of Practice' },
  { stat: '10,000+', label: 'Deliveries Conducted' },
  { stat: '2,000+', label: 'Surgical Procedures' },
  { stat: '500+', label: 'Fertility Treatments' },
];

const affiliations = [
  {
    short: 'FOGSI',
    full: 'Federation of Obstetric and Gynaecological Societies of India',
    desc: "Active member upholding evidence-based practice in women's health and obstetrics.",
  },
  {
    short: 'IMA',
    full: 'Indian Medical Association',
    desc: 'Registered practitioner maintaining national standards of medical ethics and care.',
  },
  {
    short: 'ISAR',
    full: 'Indian Society for Assisted Reproduction',
    desc: 'Engaged with the latest IVF research, guidelines, and fertility medicine advances.',
  },
];

export default function DoctorPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="w-full bg-surface-subtle py-14 lg:py-20 relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-secondary-100/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-360 mx-auto px-5 lg:px-25">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-[13px] text-text-muted mb-8 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted/50 shrink-0" />
            <span className="text-text-base font-medium">Dr. Alhad Pande</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Photo frame */}
            <div className="relative flex-shrink-0 w-full max-w-[320px] lg:w-[380px] xl:w-[440px] mx-auto lg:mx-0 pb-6 pr-2">
              <div className="relative w-full aspect-square rounded-[22px] overflow-hidden bg-primary-50">
                <div className="absolute w-[220px] h-[220px] rounded-full bg-primary/20 -top-8 -right-8" />
                <div className="absolute w-[90px] h-[90px] rounded-full bg-secondary/15 bottom-8 -right-4" />
                <Image
                  src="/doctor.jpeg"
                  alt="Dr. Alhad Pande — Obstetrician, Gynecologist & Fertility Specialist"
                  fill
                  sizes="(min-width: 1280px) 440px, (min-width: 1024px) 380px, 320px"
                  className="object-cover object-top z-10"
                  priority
                />
                <div className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-primary top-5 left-5">
                  <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-text-inverse font-semibold text-[13px] whitespace-nowrap">
                    Available for Consultation
                  </span>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 z-20 flex flex-col items-center justify-center bg-secondary rounded-[14px] px-5 py-4 shadow-[0_10px_30px_rgba(217,36,144,0.4)]">
                <span className="font-extrabold text-text-inverse text-[28px] leading-none">20+</span>
                <span className="text-text-inverse text-center text-[11px] mt-0.5">Years of care</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary bg-secondary/10 mb-4">
                FOGSI Member · Krisha Women&apos;s Hospital
              </span>

              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-text-base leading-tight mb-2">
                Dr. Alhad Pande
              </h1>

              <p className="text-[16px] font-semibold text-primary mb-3">
                Consultant Obstetrician, Gynecologist &amp; Fertility Specialist
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {['MBBS', 'DGO', 'MD'].map((q) => (
                  <Badge
                    key={q}
                    variant="outline"
                    className="h-auto overflow-visible rounded-full px-3.5 py-1 text-[12.5px] font-bold bg-primary-100 border-primary-200/60 text-primary-700"
                  >
                    {q}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className="h-auto overflow-visible rounded-full px-3.5 py-1 text-[12.5px] font-bold bg-secondary/10 border-secondary/20 text-secondary"
                >
                  Fellowship in ART &amp; Laparoscopy
                </Badge>
              </div>

              <p className="text-[15px] text-text-muted leading-7 max-w-145 xl:max-w-none mb-7">
                Dr. Alhad Pande is a highly experienced Obstetrician and
                Gynecologist with over two decades of clinical practice. Trained
                at top medical institutions across India and holding fellowships
                in Assisted Reproductive Techniques and Advanced Laparoscopic
                Surgery, he brings a rare blend of surgical expertise and
                empathetic patient care to every woman he treats — from
                adolescent health to high-risk pregnancy and fertility
                management.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="secondary"
                  asChild
                  className="rounded-full px-6 py-3 h-auto text-[14px] font-semibold hover:bg-secondary-600 shadow-sm"
                >
                  <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                    Book Appointment
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full px-6 py-3 h-auto text-[14px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
                >
                  <a href="tel:+917862950676">+91 78629 50676</a>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">

            {/* Left — heading + prose */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <SectionAccent />
                <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
                  About Dr. Alhad Pande
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-[15px] text-text-muted leading-7">
                  Dr. Alhad Pande founded Krisha Women&apos;s Hospital with a
                  single, clear vision: to bring world-class women&apos;s healthcare
                  to Narol, Ahmedabad — accessible, compassionate, and free from
                  unnecessary intervention. Over the course of a 20+ year career, he
                  has guided thousands of women through some of the most significant
                  moments of their lives — safe deliveries, fertility breakthroughs,
                  complex surgeries, and healthy recoveries.
                </p>
                <p className="text-[15px] text-text-muted leading-7">
                  His postgraduate training spans three leading government medical
                  colleges — GMC Vadodara, Stanley Medical College (Chennai), and GMC
                  Rajkot — giving him a broad clinical foundation across diverse
                  patient populations and hospital environments. He later pursued
                  advanced fellowships in Assisted Reproductive Technology at Wings
                  IVF, Ahmedabad, and in Advanced Laparoscopic Surgery at Eva
                  Women&apos;s Hospital, Ahmedabad, equipping him with the latest minimally
                  invasive techniques that reduce recovery time and surgical risk
                  for patients.
                </p>
                <p className="text-[15px] text-text-muted leading-7">
                  A proud FOGSI (Federation of Obstetric and Gynaecological
                  Societies of India) member, Dr. Pande remains committed to
                  evidence-based medicine and continuous professional development.
                  He is equally known for his patience in consultation, his
                  plain-language explanations, and his willingness to spend time
                  with every patient — ensuring that no woman leaves his clinic
                  without feeling heard, informed, and confident in her care plan.
                </p>
              </div>
            </div>

            {/* Right — lg sidebar */}
            <div className="hidden lg:flex flex-col gap-5 w-80 shrink-0">

              {/* Career at a Glance */}
              <div className="bg-surface-subtle rounded-[18px] p-5 border border-border-muted">
                <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-text-muted mb-4">
                  Career at a Glance
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  {highlights.map((h) => (
                    <div key={h.label}>
                      <p className="font-extrabold text-[24px] text-text-base leading-none">{h.stat}</p>
                      <p className="text-[12px] text-text-muted mt-1.5 leading-4">{h.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Education & Training ── */}
      <section className="w-full bg-surface-subtle py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-10">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
              Education &amp; Training
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">

            {/* Left — timeline */}
            <div className="flex-1 min-w-0 flex flex-col gap-0">
              {qualifications.map((q, i) => (
                <div key={i} className="flex gap-5">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-secondary mt-1 shrink-0" />
                    {i < qualifications.length - 1 && (
                      <div className="w-px flex-1 bg-border-muted mt-1 mb-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={i < qualifications.length - 1 ? 'pb-8' : ''}>
                    <p className="font-bold text-[15px] text-text-base leading-snug">{q.degree}</p>
                    <p className="text-[13.5px] text-primary font-semibold mt-0.5">{q.institute}</p>
                    <p className="text-[13px] text-text-muted leading-5.5 mt-1">{q.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — xl sidebar: Professional Affiliations */}
            <div className="hidden lg:flex flex-col gap-4 w-80 shrink-0">
              <div className="bg-surface rounded-[18px] p-5 border border-border-muted">
                <p className="text-[11px] font-semibold uppercase tracking-[1.5px] text-text-muted mb-4">
                  Professional Affiliations
                </p>
                <div className="flex flex-col gap-4">
                  {affiliations.map((a) => (
                    <div key={a.short} className="flex items-start gap-3">
                      <span className="text-[11px] font-extrabold text-secondary bg-secondary/10 rounded-[6px] px-2 py-1 shrink-0 leading-none mt-0.5">
                        {a.short}
                      </span>
                      <div>
                        <p className="font-semibold text-[12.5px] text-text-base leading-4.5">{a.full}</p>
                        <p className="text-[12px] text-text-muted leading-4.5 mt-0.5">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Areas of Expertise ── */}
      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-8">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
              Areas of Expertise
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
            {expertise.map((e, i) => (
              <div
                key={i}
                className="group bg-surface-subtle rounded-[18px] p-6 border border-border-muted flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(76,41,150,0.08)] hover:border-primary/20"
              >
                <div className="w-10 h-10 rounded-[10px] bg-primary-100 text-primary flex items-center justify-center shrink-0">
                  <CheckIcon size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-text-base mb-1.5">{e.label}</h3>
                  <p className="text-[13px] text-text-muted leading-5.5">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clinical Philosophy ── */}
      <section className="w-full bg-surface-subtle py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-6">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
              Clinical Philosophy
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="flex flex-col gap-5 flex-1">
              <p className="text-[15px] text-text-muted leading-7">
                Dr. Pande believes that every woman deserves to be an active,
                informed participant in her own healthcare. His approach to
                every consultation begins with listening — carefully
                understanding not just the medical complaint, but the
                patient&apos;s life circumstances, concerns, and personal goals.
                He explains every diagnosis and treatment option in clear,
                non-technical language, ensuring women can make truly informed
                decisions.
              </p>
              <p className="text-[15px] text-text-muted leading-7">
                He is a strong proponent of minimal intervention where
                clinically appropriate — favouring physiological births,
                conservative surgical approaches, and lifestyle-first management
                for hormonal conditions wherever possible. When intervention is
                necessary, he brings advanced surgical skill and precision to
                minimise risk and recovery time.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {principles.map((p) => (
                <div
                  key={p.label}
                  className="group flex items-start gap-3 bg-surface rounded-[14px] p-4 border border-border-muted transition-all duration-200 hover:border-primary/20 hover:shadow-[0_4px_12px_rgba(76,41,150,0.06)]"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-[13.5px] text-text-base">{p.label}</p>
                    <p className="text-[13px] text-text-muted leading-5.5 mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Consultation Details ── */}
      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <div className="flex items-center gap-3 mb-8">
            <SectionAccent />
            <h2 className="text-[22px] lg:text-[26px] font-bold text-text-base">
              Consultation Details
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {consultDetails.map((item) => (
              <div
                key={item.label}
                className="group bg-surface-subtle rounded-[18px] p-6 border border-border-muted flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(76,41,150,0.08)] hover:border-primary/20"
              >
                <div className="w-11 h-11 rounded-[10px] bg-primary-100 text-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[1px] text-text-muted mb-1">
                    {item.label}
                  </p>
                  <p className="font-bold text-[14px] text-text-base leading-snug">{item.value}</p>
                  <p className="text-[12.5px] text-text-muted leading-5 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
