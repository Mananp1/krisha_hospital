import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon, ClockIcon, MapPinIcon, MessageSquareIcon, PhoneIcon } from 'lucide-react';
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
      <ClockIcon size={20} />
    ),
    label: 'OPD Hours',
    value: 'Monday – Saturday',
    sub: '8:00 AM – 8:00 PM',
  },
  {
    icon: (
      <PhoneIcon size={20} />
    ),
    label: 'Appointments',
    value: '+91 78629 50676',
    sub: 'Emergency care 24×7',
  },
  {
    icon: (
      <MapPinIcon size={20} />
    ),
    label: 'Location',
    value: "Krisha Women's Hospital",
    sub: '231–235, A Block, 2nd Floor, Arbuda Trade Centre, Narol, Ahmedabad – 382405',
  },
  {
    icon: (
      <MessageSquareIcon size={20} />
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
      <section
        className="w-full bg-linear-to-b from-surface-subtle to-surface py-10 md:py-12 lg:py-16"
        aria-labelledby="doctor-name"
      >
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[13px] text-text-muted mb-7 flex-wrap"
          >
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRightIcon size={13} className="text-text-muted shrink-0" />
            <span className="text-text-base font-medium">Dr. Alhad Pande</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10 xl:gap-14">
            <div className="lg:col-span-5 w-full max-w-md lg:max-w-none">
              <div className="relative w-full aspect-4/5 arch overflow-hidden bg-primary-50">
                <Image
                  src="/doctor.jpeg"
                  alt="Dr. Alhad Pande — Obstetrician, Gynecologist & Fertility Specialist"
                  fill
                  sizes="(min-width: 1440px) 500px, (min-width: 1024px) 40vw, (min-width: 640px) 448px, calc(100vw - 40px)"
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>

            <div className="lg:col-span-7 min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-semibold text-secondary-600 bg-secondary/10 mb-4">
                FOGSI Member · Krisha Women&apos;s Hospital
              </span>

              <h1
                id="doctor-name"
                className="font-display text-display-lg text-text-base mb-2"
              >
                Dr. Alhad Pande
              </h1>

              <p className="text-[16px] font-semibold text-primary mb-4">
                Consultant Obstetrician, Gynecologist &amp; Fertility Specialist
              </p>

              <div className="flex flex-wrap gap-2 mb-4" aria-label="Qualifications">
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
                  className="h-auto overflow-visible rounded-full px-3.5 py-1 text-[12.5px] font-bold bg-secondary/10 border-secondary/20 text-secondary-600"
                >
                  Fellowship in ART &amp; Laparoscopy
                </Badge>
              </div>

              <p className="text-[15px] text-text-muted leading-7 max-w-155 mb-6">
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
                  className="rounded-md px-6 py-3 h-auto text-[14px] font-semibold hover:bg-secondary-600 shadow-sm"
                >
                  <a href="https://wa.me/917862950676" target="_blank" rel="noopener noreferrer">
                    Book Appointment
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-md px-6 py-3 h-auto text-[14px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
                >
                  <a href="tel:+917862950676">+91 78629 50676</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-surface py-10 md:py-12 lg:py-16">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] gap-10 xl:gap-8 items-start">
            <div className="min-w-0 flex flex-col gap-10 md:gap-12 lg:gap-16">
              <section aria-labelledby="about-doctor">
                <div className="flex items-center gap-3 mb-6">
                  <SectionAccent />
                  <h2
                    id="about-doctor"
                    className="text-[22px] lg:text-[26px] font-bold text-text-base"
                  >
                    About Dr. Alhad Pande
                  </h2>
                </div>

                <div className="flex flex-col gap-4 max-w-measure">
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

                <div className="grid grid-cols-1 min-[340px]:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
                  {highlights.map((highlight) => (
                    <article
                      key={highlight.label}
                      className="min-w-0 h-full bg-surface-subtle rounded-lg border border-border-muted p-4 md:p-5"
                    >
                      <p className="font-display text-[24px] md:text-[26px] font-semibold text-primary leading-none">
                        {highlight.stat}
                      </p>
                      <p className="text-[12px] text-text-muted leading-4.5 mt-2">
                        {highlight.label}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="education-training">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,0.8fr)] gap-8 lg:gap-6 items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-6">
                      <SectionAccent />
                      <h2
                        id="education-training"
                        className="text-[22px] lg:text-[26px] font-bold text-text-base"
                      >
                        Education &amp; Training
                      </h2>
                    </div>

                    <div className="rounded-lg border border-border-muted bg-surface-subtle overflow-hidden">
                      {qualifications.map((qualification) => (
                        <article
                          key={qualification.degree}
                          className="p-5 border-b border-border-muted last:border-b-0"
                        >
                          <h3 className="font-bold text-[15px] text-text-base leading-snug">
                            {qualification.degree}
                          </h3>
                          <p className="text-[13.5px] text-primary font-semibold mt-1">
                            {qualification.institute}
                          </p>
                          <p className="text-[13px] text-text-muted leading-5.5 mt-1.5">
                            {qualification.detail}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-[18px] font-bold text-text-base mb-6 lg:mt-1">
                      Professional Affiliations
                    </h2>
                    <div className="flex flex-col gap-3">
                      {affiliations.map((affiliation) => (
                        <article
                          key={affiliation.short}
                          className="bg-surface-subtle rounded-lg border border-border-muted p-4"
                        >
                          <span className="inline-flex text-[11px] font-extrabold text-secondary-600 bg-secondary/10 rounded-sm px-2 py-1 leading-none">
                            {affiliation.short}
                          </span>
                          <h3 className="font-semibold text-[13px] text-text-base leading-5 mt-2.5">
                            {affiliation.full}
                          </h3>
                          <p className="text-[12.5px] text-text-muted leading-5 mt-1">
                            {affiliation.desc}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section aria-labelledby="areas-expertise">
                <div className="flex items-center gap-3 mb-6">
                  <SectionAccent />
                  <h2
                    id="areas-expertise"
                    className="text-[22px] lg:text-[26px] font-bold text-text-base"
                  >
                    Areas of Expertise
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                  {expertise.map((item) => (
                    <article
                      key={item.label}
                      className="group h-full bg-surface-subtle rounded-lg p-5 border border-border-muted flex flex-col gap-3 transition-[transform,border-color,box-shadow] duration-200 motion-reduce:transition-none motion-reduce:hover:transform-none hover:-translate-y-0.5 hover:shadow-card hover:border-primary/20"
                    >
                      <div className="w-9 h-9 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0">
                        <CheckIcon size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[14px] text-text-base leading-5 mb-1.5">
                          {item.label}
                        </h3>
                        <p className="text-[13px] text-text-muted leading-5.5">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section aria-labelledby="clinical-philosophy">
                <div className="flex items-center gap-3 mb-6">
                  <SectionAccent />
                  <h2
                    id="clinical-philosophy"
                    className="text-[22px] lg:text-[26px] font-bold text-text-base"
                  >
                    Clinical Philosophy
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-7 lg:gap-6 items-start">
                  <div className="flex flex-col gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {principles.map((principle) => (
                      <article
                        key={principle.label}
                        className="h-full bg-surface-subtle rounded-lg border border-border-muted p-4"
                      >
                        <div className="w-2 h-2 rounded-full bg-secondary mb-3" aria-hidden="true" />
                        <h3 className="font-bold text-[13.5px] text-text-base">
                          {principle.label}
                        </h3>
                        <p className="text-[13px] text-text-muted leading-5.5 mt-1">
                          {principle.desc}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside
              aria-labelledby="consultation-details"
              className="xl:sticky xl:top-28 rounded-lg border border-border-muted bg-surface-subtle p-5 md:p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <SectionAccent />
                <h2
                  id="consultation-details"
                  className="text-[20px] font-bold text-text-base"
                >
                  Consultation Details
                </h2>
              </div>

              <div className="flex flex-col">
                {consultDetails.map((item) => (
                  <article
                    key={item.label}
                    className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0 border-b border-border-muted last:border-b-0"
                  >
                    <div className="w-10 h-10 rounded-md bg-primary-100 text-primary flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[11px] font-bold uppercase tracking-[1px] text-text-muted mb-1">
                        {item.label}
                      </h3>
                      <p className="font-bold text-[14px] text-text-base leading-snug break-words">
                        {item.value}
                      </p>
                      <p className="text-[12.5px] text-text-muted leading-5 mt-1 break-words">
                        {item.sub}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      <CTAStrip />
    </>
  );
}
