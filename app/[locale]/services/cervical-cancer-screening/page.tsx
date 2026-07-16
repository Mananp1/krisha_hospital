import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Cervical Cancer Screening & HPV Vaccination in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert cervical cancer screening and HPV vaccination led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Pap smears, HPV DNA testing, and preventive immunization for lifelong protection.",
  alternates: { canonical: '/services/cervical-cancer-screening' },
};

const data: ServicePageData = {
  title: "Comprehensive Cervical Cancer Screening & HPV Vaccination in Narol, Ahmedabad",
  shortTitle: "Cervical Cancer Screening & HPV Vaccination",
  intro:
    "Guarding your long-term health begins with preventive care. Cervical cancer is highly preventable through timely clinical intervention. At Krisha Women's Hospital in Narol, Ahmedabad, we offer specialized Cervical Cancer Screening and HPV Vaccination to protect women at every stage of life. Led by Dr. Alhad Pande, our hospital provides a safe, confidential environment for Pap smears, liquid-based cytology, and HPV DNA testing, alongside advanced HPV vaccines. We replace apprehension with clear education and gentle care. By catching cellular changes early and building robust immunity against the Human Papillomavirus, we empower you to take control of your reproductive health, giving you and your family absolute peace of mind.",
  overview: [
    "Cervical cancer screening and Human Papillomavirus (HPV) vaccination constitute a dual-layered approach to preventing cancer of the cervix. Screening involves quick, specialized tests like Pap smears or HPV DNA tests that check for abnormal cell changes or high-risk viral strains before cancer can even develop. The HPV vaccine is a highly effective immunization that prompts the immune system to block the specific strains of the virus responsible for the vast majority of cervical cancer cases.",
    "This service is a cornerstone of preventative gynecology because cervical cancer often develops silently without any noticeable symptoms in its early stages. Every woman can benefit from this life-saving care. The HPV vaccine is most effective when administered to adolescents and young adults before any viral exposure, while routine screenings are critically important for all women starting in their mid-20s, regardless of their family history or current lifestyle.",
    "By integrating regular screenings and vaccination into your routine healthcare, this service shields a woman's holistic well-being. It transforms a serious health risk into a highly manageable, preventable condition. At Krisha Women's Hospital, we focus on educating women that an abnormal test result is not a cancer diagnosis, but an early warning sign that allows Dr. Alhad Pande to intervene proactively, ensuring a lifetime of health and security.",
  ],
  benefits: [
    {
      label: "Life-Saving Prevention",
      description:
        "The HPV vaccine offers robust protection against the primary viral strains known to cause cervical cancer.",
    },
    {
      label: "Early Detection Precision",
      description:
        "Advanced screenings identify microscopic cellular changes years before they can progress into a serious condition.",
    },
    {
      label: "Highly Accurate Testing",
      description:
        "Utilization of modern liquid-based cytology and HPV DNA testing for dependable diagnostic results.",
    },
    {
      label: "Gentle and Quick Procedures",
      description:
        "Screenings are non-invasive, take only a few minutes, and are performed with minimal physical discomfort.",
    },
    {
      label: "Tailored Screening Schedules",
      description:
        "Personalized routine timelines based strictly on your age, medical history, and specific risk factors.",
    },
    {
      label: "Comprehensive Guidance",
      description:
        "Complete counseling by Dr. Alhad Pande to address vaccine timelines and clarify screening results.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, we recognize that discussions around cancer screening can naturally cause vulnerability and anxiety. Our approach is entirely patient-centered, ensuring a warm, respectful, and completely private environment. During your consultation, Dr. Alhad Pande evaluates your age, vaccine history, and specific health profile to explain precisely which screening tool or vaccination schedule is ideal for your body.",
    "If a screening reveals any cellular abnormalities, our management approach shifts to precise, proactive care rather than unnecessary panic. Dr. Alhad Pande walks you through evidence-based protocols, which may include closer observational tracking or minor, minimally invasive procedures to protect your cervical health. We focus intensely on comfort, strict safety standards, and excellent long-term health outcomes, ensuring every woman in Narol, Ahmedabad, feels protected, reassured, and deeply cared for.",
  ],
};

export default function CervicalCancerScreening() {
  return <ServicePageLayout data={data} />;
}
