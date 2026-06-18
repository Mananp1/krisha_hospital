import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Antenatal & Gynecological Sonography in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Advanced ultrasound imaging led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Antenatal scans, anomaly detection, pelvic sonography, and ovulation tracking.",
};

const data: ServicePageData = {
  title: "Advanced Antenatal & Gynecological Sonography in Narol, Ahmedabad",
  shortTitle: "Antenatal & Gynecological Sonography",
  intro:
    "Ultrasound imaging is an invaluable window into a woman's reproductive health and the development of a new life. At Krisha Women's Hospital in Narol, Ahmedabad, we offer state-of-the-art Antenatal and Gynecological Sonography services to provide you with absolute clarity and peace of mind. Led by the clinical expertise of Dr. Alhad Pande, our advanced imaging center utilizes modern diagnostic technology to deliver precise, real-time insights into your health. Whether you are expecting a baby and wish to monitor their growth milestones, or you require diagnostic clarity for pelvic conditions, our scans are performed to the highest medical standards. We blend technical precision with a gentle, compassionate touch, ensuring that your ultrasound experience is not only medically thorough but also deeply reassuring. Step into our facility with confidence, knowing your health is being monitored by a trusted specialist team.",
  overview: [
    "Antenatal and gynecological sonography uses advanced ultrasound waves to evaluate the female reproductive system and track fetal development safely. Antenatal scans monitor a baby's growth, anatomy, and fluid levels during pregnancy, while gynecological scans evaluate the uterus, fallopian tubes, and ovaries for non-pregnancy conditions.",
    "This service is vital for women at all stages of life. For expectant mothers, routine trimester screenings help detect anomalies, confirm gestational age, and monitor placental health. For non-pregnant women experiencing pelvic pain, abnormal bleeding, or fertility struggles, pelvic ultrasound acts as a primary diagnostic tool to identify structural irregularities.",
    "Ultimately, sonography supports long-term well-being through early detection. By replacing uncertainty with clear visual evidence, Dr. Alhad Pande can formulate accurate management paths, reducing maternal anxiety and promoting proactive preventive care to ensure health issues are addressed before they progress.",
  ],
  benefits: [
    {
      label: "Safe and Non-Invasive",
      description:
        "Uses harmless sound waves instead of radiation, ensuring complete safety for both mother and baby.",
    },
    {
      label: "Early Anomaly Detection",
      description:
        "Identifies potential fetal developmental concerns early, allowing for timely medical planning.",
    },
    {
      label: "Accurate Gynecological Diagnosis",
      description:
        "Pinpoints the root causes of pelvic pain or abnormal bleeding by identifying fibroids, cysts, or polyps.",
    },
    {
      label: "Ovulation Tracking",
      description:
        "Provides precise follicular monitoring to support couples navigating infertility evaluations.",
    },
    {
      label: "Immediate Clinical Clarity",
      description:
        "Features direct diagnostic interpretation by Dr. Alhad Pande to minimize waiting anxiety.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to sonography is thoroughly patient-centered, recognizing that diagnostic tests can cause anxiety. From the moment you enter, we prioritize your physical comfort and emotional ease. We explain the procedure beforehand, maintain complete privacy, and ensure you remain comfortable throughout the scan.",
    "During the evaluation process, Dr. Alhad Pande correlates sonographic findings directly with your unique medical history. We do not view images in isolation; we analyze them contextually to catch subtle variations early, preventing minor health concerns from developing into complex issues.",
    "Our management approach focuses strictly on safety and excellent long-term health outcomes. If a scan reveals an issue, we sit down with you to discuss the findings openly, answer your questions, and instantly draft a customized treatment or monitoring plan at our facility in Narol, Ahmedabad.",
  ],
};

export default function AntenatalGynecologicalSonography() {
  return <ServicePageLayout data={data} />;
}
