import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "High-Risk Pregnancy Management in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert high-risk pregnancy care led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Advanced maternal-fetal monitoring, 24x7 emergency support, and personalized care plans.",
  alternates: { canonical: '/services/high-risk-pregnancy' },
};

const data: ServicePageData = {
  title: "High-Risk Pregnancy Management in Narol, Ahmedabad",
  shortTitle: "High-Risk Pregnancy Management",
  intro:
    "While every pregnancy is a unique journey, some require an extra layer of medical vigilance and specialized care. A high-risk pregnancy diagnosis can feel overwhelming, but it simply means you and your baby need closer monitoring to ensure a safe, healthy outcome. At Krisha Women's Hospital in Narol, Ahmedabad, we specialize in turning complex pregnancies into stories of hope and joy. Led by the expertise of Dr. Alhad Pande, our dedicated team provides advanced clinical supervision tailored to manage pre-existing conditions, multiple gestations, or unexpected complications that may arise. We combine cutting-edge maternal-fetal monitoring with a deeply compassionate, reassuring environment. Here, you are never alone; we walk beside you every step of the way, safeguarding your health and protecting your baby's future with precision, warmth, and 24x7 emergency support.",
  overview: [
    "High-risk pregnancy management is a specialized branch of obstetrics dedicated to monitoring and treating expectant mothers who face increased medical risks. These risks may stem from pre-existing maternal health issues, conditions that develop during gestation, or factors related to the baby's development. At Krisha Women's Hospital, this service involves intensive prenatal surveillance, specialized diagnostic testing, and highly personalized care plans designed to mitigate potential complications before they become critical.",
    "This specialized care is vital for women managing chronic conditions such as hypertension, pre-existing diabetes, thyroid disorders, or autoimmune diseases. It is equally crucial for mothers experiencing pregnancy-specific complications like gestational diabetes, preeclampsia, placental abnormalities, or carrying multiples (twins or triplets). Advanced maternal age or a history of recurrent miscarriages or premature births also benefit from this protective umbrella, ensuring risks are kept under tight control.",
    "Beyond safeguarding physical health, high-risk pregnancy management significantly supports a woman's psychological well-being. Knowing that an expert like Dr. Alhad Pande is closely tracking every biometric marker alleviates the profound anxiety that often accompanies a complicated pregnancy. By providing timely education, nutritional counseling, and symptom management, this service transforms a stressful medical period into an empowered, highly supported journey toward motherhood.",
  ],
  benefits: [
    {
      label: "Expert Clinical Oversight",
      description:
        "Direct, continuous care managed by Dr. Alhad Pande, a trusted specialist in advanced obstetrics.",
    },
    {
      label: "Tailored Surveillance Protocols",
      description:
        "Custom-designed monitoring schedules that match the exact medical needs of your specific high-risk condition.",
    },
    {
      label: "Advanced Fetal Diagnostics",
      description:
        "Access to sophisticated ultrasound imaging and fetal well-being assessments to track growth and detect anomalies early.",
    },
    {
      label: "Proactive Complication Management",
      description:
        "Timely clinical interventions to prevent conditions like preeclampsia or gestational diabetes from escalating.",
    },
    {
      label: "24/7 Emergency Readiness",
      description:
        "Complete peace of mind with round-the-clock emergency medical services available at our Narol facility.",
    },
    {
      label: "Holistic Maternal Support",
      description:
        "Integration of lifestyle advice, nutritional counseling, and emotional support to ensure comprehensive wellness.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to high-risk pregnancy is fundamentally patient-centered and rooted in open, transparent communication. We recognize that no two high-risk cases are identical. Your journey begins with an exhaustive diagnostic evaluation where Dr. Alhad Pande reviews your complete medical history, previous pregnancy outcomes, and current health status. Utilizing advanced diagnostic screenings, we map out a clear baseline to understand the exact nature of the risks involved.",
    "Once a clear assessment is made, we craft a dynamic management plan that balances clinical safety with your personal physical comfort. Treatment may involve precise medication management, tailored lifestyle modifications, and scheduled specialized scans. We walk through every step of this treatment protocol with you and your family, ensuring you understand the clinical reasoning behind every recommendation, thereby replacing fear with clarity.",
    "Our ultimate focus remains locked on securing excellent long-term health outcomes for both mother and child. We strictly adhere to international safety protocols, maintaining an environment prepared for any contingency. From your regular prenatal visits to the meticulously planned delivery in our state-of-the-art facility in Narol, Ahmedabad, we prioritize safety, comfort, and clinical excellence above all else to welcome your baby safely into the world.",
  ],
};

export default function HighRiskPregnancy() {
  return <ServicePageLayout data={data} />;
}
