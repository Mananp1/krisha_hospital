import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Infertility Treatment (IUI/IVF) in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert IUI and IVF fertility treatment led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Personalized fertility protocols, advanced diagnostics, and compassionate care.",
  alternates: { canonical: '/services/infertility-treatment' },
};

const data: ServicePageData = {
  title: "Comprehensive Infertility Treatment (IUI & IVF) in Narol, Ahmedabad",
  shortTitle: "Infertility Treatment (IUI/IVF)",
  intro:
    "The dream of building a family is a deeply personal journey, but navigating fertility challenges can often feel isolating and overwhelming. At Krisha Women's Hospital in Narol, Ahmedabad, we offer a sanctuary of hope, advanced reproductive technology, and compassionate medical expertise. Led by fertility specialist Dr. Alhad Pande, our dedicated clinic provides evidence-based treatments, including Intrauterine Insemination (IUI) and In Vitro Fertilization (IVF). We understand that every couple's path to parenthood is unique, which is why we design personalized fertility pathways tailored to your specific reproductive health profile. Combining modern diagnostic facilities with a nurturing environment, we aim to demystify fertility care and optimize your chances of a safe, successful pregnancy. Trust Krisha Women's Hospital to support you with advanced clinical care and steadfast emotional guidance as we work together to turn your dream of parenthood into reality.",
  overview: [
    "Infertility treatment encompassing Intrauterine Insemination (IUI) and In Vitro Fertilization (IVF) involves medical and advanced technological interventions designed to help couples overcome biological barriers to conception. IUI is a minimally invasive procedure where prepared sperm is placed directly into the uterus during ovulation to facilitate fertilization. IVF is a more advanced assisted reproductive technology involving the retrieval of mature eggs, fertilizing them with sperm within a specialized laboratory setting, and carefully transferring the resulting embryo back into the uterus.",
    "This service is vital for couples who have been unable to conceive naturally after a year or more of unprotected intercourse. It benefits individuals facing diverse reproductive challenges, including blocked fallopian tubes, male factor infertility, ovulation disorders like Polycystic Ovary Syndrome (PCOS), endometriosis, advanced maternal age, or unexplained infertility. Modern reproductive medicine opens up viable, highly successful avenues for couples seeking to safely expand their families.",
    "Beyond physiological support, infertility management preserves a woman's psychological well-being. Fertility struggles often introduce immense stress and vulnerability into a relationship. By providing structured clinical guidance, clear diagnostic answers, and proactive treatment options, Krisha Women's Hospital alleviates the anxiety of the unknown, empowering couples with renewed confidence and hope throughout their parenthood journey.",
  ],
  benefits: [
    {
      label: "Tailored Fertility Protocols",
      description:
        "Customized IUI and IVF treatment lines based strictly on your unique reproductive profile.",
    },
    {
      label: "Advanced Laboratory Setup",
      description:
        "Modern embryology equipment ensuring optimal, highly controlled conditions for embryo culture.",
    },
    {
      label: "Comprehensive Diagnostics",
      description:
        "Detailed hormone profiling, advanced semen analysis, and pelvic scans to identify hidden reproductive roadblocks.",
    },
    {
      label: "Expert Clinical Direction",
      description:
        "Advanced treatments directly overseen by the experienced Dr. Alhad Pande.",
    },
    {
      label: "Holistic Patient Care",
      description:
        "Dedicated emotional counseling and support systems to help couples manage treatment stress smoothly.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, we approach fertility care with deep empathy, acknowledging the delicate emotional landscape couples navigate. Our process begins with a transparent, exhaustive evaluation of both partners. Dr. Alhad Pande conducts precise physical assessments, ovarian reserve testing, and specialized semen analysis to accurately pinpoint reproductive challenges, ensuring you are fully educated on the findings before any intervention begins.",
    "Once diagnosed, we create a stepwise management plan tailored to your body's natural response. We monitor hormone levels and follicular growth closely to optimize the timing of IUI or IVF cycles. Our clinical team emphasizes precision and gentleness during every step — from egg retrieval to embryo transfer — ensuring minimal discomfort while keeping you updated at every milestone.",
    "Patient safety, physical comfort, and excellent long-term health outcomes guide all protocols at our facility in Narol, Ahmedabad. We maintain strict medical measures to minimize complications like Ovarian Hyperstimulation Syndrome (OHSS), prioritizing maternal wellness throughout the cycle. By combining rigorous medical science with compassionate care, we strive to achieve the safest transition from successful conception to a healthy, full-term pregnancy.",
  ],
};

export default function InfertilityTreatment() {
  return <ServicePageLayout data={data} />;
}
