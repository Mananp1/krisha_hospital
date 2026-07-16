import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Pregnancy & Maternity Care in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert maternity care led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Comprehensive prenatal check-ups, safe delivery & postpartum support.",
  alternates: { canonical: '/services/pregnancy-maternity-care' },
};

const data: ServicePageData = {
  title: "Comprehensive Pregnancy & Maternity Care in Narol, Ahmedabad",
  shortTitle: "Pregnancy & Maternity Care",
  intro:
    "Welcoming a new life into the world is one of the most profound journeys a woman can experience. At Krisha Women’s Hospital, we understand that this beautiful phase requires expert medical supervision blended with a deeply compassionate environment. Led by Dr. Alhad Pande, our dedicated maternity team in Narol, Ahmedabad, provides world-class pregnancy care tailored to your unique needs. From pre-conception counselling through every trimester of pregnancy, to safe delivery and postpartum support, we ensure you and your baby receive the highest standard of clinical excellence.",
  overview: [
    "Pregnancy and maternity care encompasses comprehensive medical, emotional, and educational support provided to women from the planning stages of pregnancy through childbirth and the early postpartum weeks. At Krisha Women’s Hospital, this service is designed for expectant mothers at any stage of their journey, whether navigating a smooth first-time pregnancy, managing a high-risk condition, or seeking expert guidance on postnatal recovery.",
    "Routine and specialized maternity care is vital for ensuring the health and safety of both mother and baby. Regular prenatal check-ups allow for the early detection and management of potential complications such as gestational hypertension, diabetes, or fetal growth restrictions. By monitoring these critical factors closely, we minimize risks and pave the way for a safer delivery experience.",
    "Beyond clinical checkups, holistic maternity care supports a woman’s long-term well-being. Dr. Alhad Pande and our expert team focus on cultivating physical resilience and psychological comfort. We empower mothers with essential knowledge regarding nutrition, lifestyle adjustments, and mental health, ensuring you feel confident, informed, and genuinely cared for as you prepare to welcome your newborn.",
  ],
  benefits: [
    {
      label: "Expert Clinical Leadership",
      description:
        "Personalized care pathways guided by the extensive expertise of Dr. Alhad Pande.",
    },
    {
      label: "Advanced Prenatal Screening",
      description:
        "State-of-the-art ultrasound and diagnostic monitoring to track your baby’s development accurately.",
    },
    {
      label: "High-Risk Pregnancy Management",
      description:
        "Specialized protocols to safely manage pre-existing conditions or unexpected maternal complications.",
    },
    {
      label: "24/7 Emergency Readiness",
      description:
        "Round-the-clock medical availability for critical maternal or fetal care when you need it most.",
    },
    {
      label: "Comprehensive Postpartum Support",
      description:
        "Continuous guidance on maternal recovery, newborn wellness, and breastfeeding techniques.",
    },
  ],
  approach: [
    "Our approach is rooted in patient-centered empathy, recognizing that no two pregnancy journeys are identical. Your care begins with a thorough initial evaluation, where Dr. Alhad Pande reviews your medical history, discusses your personal preferences, and establishes a healthy baseline. This meticulous assessment allows us to co-create a personalized prenatal roadmap that aligns with your medical requirements and personal comfort.",
    "Throughout your pregnancy, our management approach prioritizes clinical safety and transparent communication. We conduct regular screenings and continuous fetal monitoring, dynamically adjusting care plans as your pregnancy progresses. Our decisions are always guided by evidence-based practices, ensuring maximum safety while keeping you and your family informed at every stage to alleviate any anxiety.",
    "We deeply emphasize optimal long-term health outcomes by providing robust postnatal care. Our commitment to your well-being extends well past delivery, offering pelvic floor recovery guidance, emotional health screenings, and lifestyle counseling. By fostering a nurturing environment at our Narol facility, we ensure you step into motherhood with physical strength and confidence.",
  ],
};

export default function PregnancyMaternityCare() {
  return <ServicePageLayout data={data} />;
}
