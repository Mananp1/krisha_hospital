import SectionHeader from './SectionHeader';

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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    bold: 'OPD Hours',
    regular: 'Mon – Sat: 8:00 AM – 8:00 PM',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    bold: 'Hospital',
    regular: "Krisha Women's Hospital, Narol, Ahmedabad",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    bold: 'Qualifications',
    regular: 'MBBS (GMC Baroda) · DGO (Stanley Medical, Chennai) · MD (GMC Raipur)',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
      </svg>
    ),
    bold: 'Fellowships',
    regular: "ART – Wings IVF, Ahmedabad · Advanced Laparoscopy – Era Women's Hospital",
  },
];

export default function DoctorProfile() {
  return (
    <section id="doctor" className="w-full bg-surface-subtle py-12 lg:py-20">
      <div className="max-w-360 mx-auto px-5 lg:px-25 flex flex-col lg:flex-row items-center gap-12 lg:gap-14">

        {/* Left — Photo Frame */}
        <div className="relative flex-shrink-0 w-full max-w-[380px] lg:w-[470px] mx-auto lg:mx-0 pb-6 pr-2">
          <div className="relative w-full aspect-[47/49] rounded-[22px] overflow-hidden bg-primary-50">
            {/* Decorative circles */}
            <div className="absolute w-[260px] h-[260px] lg:w-[300px] lg:h-[300px] rounded-full bg-primary/20 -top-10 -right-10" />
            <div className="absolute w-[110px] h-[110px] lg:w-[130px] lg:h-[130px] rounded-full bg-secondary-50 bottom-10 -right-5" />

            {/* Photo placeholder */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 opacity-40 text-primary">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <p className="text-[12px]">Dr. Alhad Pande photo</p>
            </div>

            {/* Available badge */}
            <div className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-primary top-5 left-5">
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-text-inverse font-semibold text-[13px] whitespace-nowrap">
                Available for Consultation
              </span>
            </div>
          </div>

          {/* Experience badge — floats outside the photo frame */}
          <div className="absolute right-0 bottom-0 z-20 flex flex-col items-center justify-center bg-secondary rounded-[14px] px-5 py-4 shadow-[0_10px_30px_rgba(217,36,144,0.4)]">
            <span className="font-extrabold text-text-inverse text-[28px] lg:text-[30px] leading-none">20+</span>
            <span className="text-text-inverse text-center text-[11px] mt-0.5">Years of care</span>
          </div>
        </div>

        {/* Right — Info */}
        <div className="flex-1 lg:max-w-[540px]">
          <SectionHeader
            eyebrow="MEET YOUR SPECIALIST"
            title="Dr. Alhad Pande"
            centered={false}
          />

          <p className="mt-1 text-[15px] font-semibold text-primary leading-[23px]">
            Consultant Obstetrician, Gynecologist &amp; Fertility Specialist
          </p>

          <span className="inline-block mt-3 px-4 py-1.5 rounded-[20px] text-[12.5px] font-bold bg-primary-100 text-primary-700">
            MBBS · MD · DGO
          </span>

          <p className="mt-4 mb-5 text-[15px] text-text-muted leading-[26px] max-w-[520px]">
            Dr. Alhad Pande is an experienced Obstetrician and Gynecologist with specialized training
            in infertility management, ultrasonography, and advanced laparoscopic surgery. With
            qualifications from reputed medical institutions and fellowships in assisted reproductive
            techniques and minimally invasive gynecology, Dr. Pande is committed to providing
            compassionate, evidence-based care for women at every stage of life.
          </p>

          {/* Expertise tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-[30px] text-[13px] font-semibold bg-surface border border-border-muted text-primary-700"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {metaItems.map((item) => (
              <div key={item.bold} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 text-primary">{item.icon}</div>
                <div>
                  <p className="font-bold text-[14px] text-text-base">{item.bold}</p>
                  <p className="text-[13px] text-text-muted leading-[20px]">{item.regular}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#appointment"
              className="px-6 py-3 text-[15px] font-semibold text-text-inverse bg-secondary rounded-[40px] hover:bg-secondary-600 transition-colors"
            >
              Book Appointment
            </a>
            <a
              href="tel:+917862950676"
              className="px-6 py-3 text-[15px] font-semibold rounded-[40px] border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse transition-colors"
            >
              Call Now
            </a>
          </div>

          <p className="mt-3 text-[13px] text-text-muted">ગુજરાતીમાં સેવા ઉપલબ્ધ છે</p>
        </div>
      </div>
    </section>
  );
}
