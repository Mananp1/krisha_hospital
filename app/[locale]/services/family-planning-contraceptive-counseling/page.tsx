import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Family Planning & Contraceptive Counseling in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert family planning and contraceptive counseling led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Personalized birth control guidance, IUD insertion, and reproductive health planning.",
  alternates: { canonical: '/services/family-planning-contraceptive-counseling' },
};

const data: ServicePageData = {
  title: "Family Planning & Contraceptive Counseling in Narol, Ahmedabad",
  shortTitle: "Family Planning & Contraceptive Counseling",
  intro:
    "Taking control of your reproductive health is a powerful step toward securing your future, your career, and your family's overall well-being. At Krisha Women's Hospital in Narol, Ahmedabad, we provide comprehensive Family Planning and Contraceptive Counseling tailored to your specific life stage and personal goals. Led by the compassionate expertise of Dr. Alhad Pande, our hospital offers a safe, entirely confidential space to discuss, explore, and choose the most suitable birth control methods for your body. Whether you are looking to delay pregnancy, space out childbirth for maternal recovery, or find long-term contraceptive solutions, we combine evidence-based medical guidance with absolute respect for your choices. We believe that informed women make the most confident health decisions, and our dedicated team is here to educate, reassure, and support you every step of the way.",
  overview: [
    "Family planning and contraceptive counseling is a personalized healthcare service dedicated to helping women make informed decisions about if, when, and how many children they wish to have. At Krisha Women's Hospital, this service involves expert clinical consultations where we discuss a wide array of birth control options, including short-term methods, long-acting reversible contraceptives (LARCs) like intrauterine devices (IUDs), and permanent reproductive solutions.",
    "This service is essential for women at various stages of their reproductive lives — from young adults navigating their options for the first time, to couples looking to space out their pregnancies for optimal physical recovery. It is equally critical for women managing pre-existing medical conditions where a planned, well-monitored pregnancy is vital for safety. Finding the right contraceptive method requires evaluating your daily lifestyle, medical background, and future family goals under expert clinical guidance.",
    "Ultimately, structured family planning supports a woman's holistic well-being by protecting her health autonomy and reducing the anxiety associated with unplanned pregnancies. Dr. Alhad Pande focuses on dispelling common myths about birth control, managing potential side effects, and aligning contraceptive options with your body's natural hormonal cycle. This proactive approach ensures you feel empowered, physically healthy, and entirely in control of your reproductive journey.",
  ],
  benefits: [
    {
      label: "Personalized Method Selection",
      description:
        "Tailored advice from Dr. Alhad Pande to find a contraceptive method that matches your unique medical profile and lifestyle.",
    },
    {
      label: "Comprehensive Birth Control Options",
      description:
        "Access to a full spectrum of modern choices, including oral pills, patches, injectables, hormonal/copper IUDs, and permanent family planning solutions.",
    },
    {
      label: "Myth Dispelling & Education",
      description:
        "Clear, honest guidance to correct widespread misinformation regarding hormonal side effects, safety, and long-term fertility.",
    },
    {
      label: "Safe Maternal Spacing",
      description:
        "Expert support to plan optimal birth intervals, which is vital for the physical healing of the mother and the long-term health of future children.",
    },
    {
      label: "Confidential & Judgment-Free Environment",
      description:
        "A private, welcoming clinical space at our Narol facility where your personal preferences and life choices are always treated with utmost respect.",
    },
    {
      label: "Non-Contraceptive Health Management",
      description:
        "Expert counseling on how certain contraceptive methods can be intentionally used to manage painful periods, heavy bleeding, or hormonal acne.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to family planning is thoroughly patient-centered and rooted in open, honest dialogue. We understand that your reproductive choices are deeply personal and subjective. The evaluation process begins with Dr. Alhad Pande conducting a meticulous health assessment, reviewing your complete medical history, blood pressure, lifestyle habits, and future family timelines to rule out any clinical contraindications before recommending a method.",
    "Once an ideal contraceptive path is selected, our focus shifts to proper administration, tracking, and your ongoing physical comfort. Whether it involves the precise, gentle insertion of a long-acting implant or a routine oral contraceptive prescription, we ensure the process is entirely stress-free. We emphasize long-term health outcomes, scheduling regular follow-ups at our Narol, Ahmedabad facility to monitor how your body adapts, manage any initial hormonal adjustments, and safely alter your plan whenever your lifestyle or fertility needs evolve.",
  ],
};

export default function FamilyPlanningContraceptiveCounseling() {
  return <ServicePageLayout data={data} />;
}
