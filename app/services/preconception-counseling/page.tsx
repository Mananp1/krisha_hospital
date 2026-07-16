import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Preconception Counseling in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert preconception counseling led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Health optimization, risk screening, nutritional guidance, and personalized care before pregnancy.",
  alternates: { canonical: '/services/preconception-counseling' },
};

const data: ServicePageData = {
  title: "Comprehensive Preconception Counseling in Narol, Ahmedabad",
  shortTitle: "Preconception Counseling",
  intro:
    "Planning to start or expand your family is an exciting milestone, and preparing your body for pregnancy is the best first step you can take. At Krisha Women's Hospital in Narol, Ahmedabad, we offer specialized preconception counseling to help you embark on this beautiful journey with confidence. Led by the expert guidance of Dr. Alhad Pande, our preconception services focus on optimizing your health before conception occurs. We evaluate your medical history, lifestyle, and genetic factors to create a tailored roadmap for a healthy pregnancy. By addressing potential risks early and ensuring your body is in its best possible condition, we safeguard both maternal well-being and your future baby's development. Trust our compassionate team to provide the clinical excellence and steady reassurance you need as you prepare for parenthood.",
  overview: [
    "Preconception counseling is a proactive healthcare service designed for women and couples planning a pregnancy. Unlike prenatal care, which begins after conception, this service focuses entirely on the weeks and months leading up to pregnancy. At Krisha Women's Hospital, it involves detailed medical evaluations, screenings, and lifestyle assessments to identify and mitigate health conditions that could affect a future pregnancy.",
    "This service is vital because a baby's major organs begin to form in the earliest weeks of development, often before a woman confirms her pregnancy. Establishing optimal health beforehand is critical. Any couple planning to conceive can benefit from this care, but it is especially crucial for individuals with chronic conditions like diabetes or thyroid disorders, a history of pregnancy complications, or genetic concerns.",
    "Ultimately, preconception counseling supports a woman's long-term health and emotional well-being by replacing uncertainty with a clear plan. Dr. Alhad Pande guides patients through essential adjustments, such as starting vital prenatal vitamins and achieving a healthy weight. This holistic approach minimizes potential complications and provides couples with a reassuring foundation for a healthy pregnancy.",
  ],
  benefits: [
    {
      label: "Personalized Health Optimization",
      description:
        "Tailored medical and lifestyle advice from Dr. Alhad Pande to prepare your body for pregnancy.",
    },
    {
      label: "Early Risk Identification",
      description:
        "Comprehensive screenings to detect and safely manage chronic health conditions or genetic risks before conception.",
    },
    {
      label: "Medication Review",
      description:
        "Expert adjustment of existing prescriptions to ensure they are safe for early fetal development.",
    },
    {
      label: "Nutritional Guidance",
      description:
        "Guidance on essential prenatal vitamins, lifestyle modifications, and weight management to boost fertility.",
    },
    {
      label: "Reduced Pregnancy Complications",
      description:
        "Proactive interventions that lower the risks of gestational conditions and support safe outcomes.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to preconception care is thoroughly patient-centered, collaborative, and built on trust. We understand that planning a family is deeply personal, so we create a warm, stress-free environment. The process begins with a detailed diagnostic evaluation where Dr. Alhad Pande reviews your complete medical background, immunization status, and lifestyle factors to establish a healthy baseline.",
    "Once your initial assessment is complete, we design a proactive management plan tailored specifically to your body's needs. This may include optimizing current treatments, upgrading nutrition, or conducting specialized screenings. Our primary focus always remains locked on maximizing safety, enhancing your personal comfort, and securing excellent long-term health outcomes for both mother and child at our facility in Narol, Ahmedabad.",
  ],
};

export default function PreconceptionCounseling() {
  return <ServicePageLayout data={data} />;
}
