import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/components/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Menopause Consultation & Treatment in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert menopause consultation and treatment led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Personalized care for hot flashes, bone health, hormonal balance, and long-term wellness.",
};

const data: ServicePageData = {
  title: "Comprehensive Menopause Consultation & Treatment in Narol, Ahmedabad",
  shortTitle: "Menopause Consultation & Treatment",
  intro:
    "Menopause is a natural biological transition, marking the end of a woman's reproductive years. While it is a normal phase of aging, the accompanying physical and emotional changes can often be challenging to manage alone. At Krisha Women's Hospital in Narol, Ahmedabad, we offer specialized Menopause Consultation and Treatment to help you navigate this transition comfortably and gracefully. Led by the expert care of Dr. Alhad Pande, our dedicated team provides personalized medical support tailored to your unique symptoms. Whether you are experiencing hot flashes, sleep disturbances, mood fluctuations, or long-term bone density concerns, we provide a safe, supportive environment. We combine thorough diagnostic evaluations with holistic management strategies, ensuring you maintain your vitality, daily comfort, and long-term wellness.",
  overview: [
    "Menopause consultation and treatment is a comprehensive healthcare service dedicated to supporting women during perimenopause, menopause, and postmenopause. This specialized clinical care involves evaluating hormonal shifts and managing the multi-system symptoms that occur when the ovaries gradually decrease estrogen production. At Krisha Women's Hospital, this service combines thorough physical assessments, lifestyle guidance, and customized medical options designed to make the transition smooth and manageable.",
    "This service is vital because hormonal changes influence bone density, cardiovascular health, metabolic function, and emotional stability. Women entering their late 40s or early 50s who are experiencing irregular periods, night sweats, unexplained weight changes, or emotional shifts can benefit immensely from specialized care. It is also crucial for younger women facing premature menopause due to medical interventions or underlying genetic factors.",
    "By addressing these changes proactively, menopause management restores a woman's daily comfort and long-term health. Instead of silently enduring disruptive symptoms, patients receive targeted treatments that safeguard their bones against osteoporosis and protect heart health. Dr. Alhad Pande focuses on educating and reassuring women, ensuring they feel validated, informed, and physically resilient during this rewarding new phase of life.",
  ],
  benefits: [
    {
      label: "Expert Personalized Care",
      description:
        "Custom-tailored treatment lines created by Dr. Alhad Pande to match your specific hormonal profile and lifestyle needs.",
    },
    {
      label: "Effective Symptom Relief",
      description:
        "Targeted management strategies to alleviate hot flashes, night sweats, sleep issues, and mood shifts.",
    },
    {
      label: "Bone Health Protection",
      description:
        "Proactive monitoring and therapy to prevent bone density loss and reduce the long-term risk of osteoporosis.",
    },
    {
      label: "Cardiovascular Risk Assessment",
      description:
        "Preventive screenings and lifestyle counseling to protect heart health during postmenopausal years.",
    },
    {
      label: "Holistic Wellness Support",
      description:
        "Integration of nutritional advice, weight management strategies, and mental wellness tracking.",
    },
    {
      label: "Safe Medical Solutions",
      description:
        "Evidence-based treatment options, ranging from non-hormonal therapies to strictly monitored hormonal balancing when appropriate.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to menopause is patient-centered and rooted in deep empathy. Your care begins with a comprehensive evaluation process where Dr. Alhad Pande listens to your specific concerns and symptoms. We perform essential diagnostic tests, including hormone panels, lipid profiles, and bone density scans, to build an accurate map of your current health status and identify potential risk factors.",
    "Once your baseline is established, our management approach focuses on creating a balanced, highly individualized care pathway. Treatment plans may include tailored nutritional modifications, targeted vitamin supplements, or safe medical therapies designed to minimize your symptoms. We emphasize patient education, walking you through your physiological changes so you can actively manage your health with clarity and confidence.",
    "Patient safety, everyday comfort, and long-term health outcomes guide all our protocols at our facility in Narol, Ahmedabad. We continuously monitor your progress through regular follow-up consultations, adjusting therapies safely as your body stabilizes. Our ultimate goal is to provide a reassuring environment where you can minimize age-related health risks, reclaim control over your body, and live with absolute confidence.",
  ],
};

export default function MenopauseConsultation() {
  return <ServicePageLayout data={data} />;
}
