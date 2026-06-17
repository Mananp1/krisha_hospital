import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/components/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Cervical Cerclage Services in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Expert cervical cerclage led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Specialized cervical stitch procedure to prevent premature birth and late-term miscarriage.",
};

const data: ServicePageData = {
  title: "Expert Cervical Cerclage Services in Narol, Ahmedabad",
  shortTitle: "Cervical Cerclage",
  intro:
    "A successful pregnancy relies on a strong physical foundation, but sometimes the body needs extra support to carry a baby safely to full term. For women diagnosed with a weakened or shortening cervix, a structural safeguard known as cervical cerclage can make all the difference. At Krisha Women's Hospital in Narol, Ahmedabad, we offer specialized cervical cerclage procedures designed to prevent premature birth and late-term miscarriage. Led by the compassionate expertise of Dr. Alhad Pande, our dedicated maternity team provides this essential intervention with the highest level of clinical precision. We understand the profound anxiety that often accompanies a high-risk pregnancy. By combining advanced maternal-fetal care with a warm, reassuring environment, we work closely with you to protect your pregnancy and help you safely welcome your healthy newborn.",
  overview: [
    "Cervical cerclage, often referred to as a cervical stitch, is a brief surgical procedure performed during pregnancy where a strong suture is placed around the cervix (the neck of the womb). This stitch reinforces the cervical tissue, helping it remain tightly closed under the increasing weight of the growing baby and amniotic fluid. It is typically performed in the late first or early second trimester and is later removed safely as the mother approaches her due date.",
    "This procedure is vital for managing cervical insufficiency, a condition where the cervix begins to shorten, soften, and open too early without painful labor contractions. Without timely medical intervention, cervical weakness can lead to premature labor or late-term pregnancy loss. A cervical cerclage provides crucial structural reinforcement, effectively extending gestation and giving the baby vital additional time to grow and mature safely in the womb.",
    "Women who can benefit significantly from this service include those with a history of second-trimester miscarriages, previous spontaneous preterm births, or those whose routine ultrasound scans reveal a short cervix during their current pregnancy. By proactively addressing structural vulnerabilities, cervical cerclage directly supports a woman's reproductive health and psychological well-being. It transforms a highly stressful scenario into a well-managed pregnancy, significantly reducing maternal anxiety and fostering a strong sense of security.",
  ],
  benefits: [
    {
      label: "Prevents Preterm Labor",
      description:
        "Effectively lowers the risk of early delivery by physically supporting a weakened cervix.",
    },
    {
      label: "Reduces Pregnancy Loss",
      description:
        "Provides a vital clinical intervention to prevent mid-trimester miscarriages caused by cervical insufficiency.",
    },
    {
      label: "Expert Placement",
      description:
        "Performed with extreme precision and gentle care by advanced maternity specialist Dr. Alhad Pande.",
    },
    {
      label: "Minimally Invasive Care",
      description:
        "A brief, highly effective procedure associated with minimal discomfort and a quick recovery time.",
    },
    {
      label: "Continuous Ultrasound Tracking",
      description:
        "Complemented by advanced sonography at our Narol facility to monitor cervical changes before and after placement.",
    },
    {
      label: "24/7 Emergency Support",
      description:
        "Complete peace of mind with round-the-clock emergency services available for any unexpected maternal needs.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to cervical cerclage is deeply patient-centered and rooted in clinical vigilance. We recognize that every high-risk pregnancy requires individualized attention and absolute clarity. Our evaluation process begins with a comprehensive review of your obstetric history, followed by precise transvaginal ultrasound screenings. This allows Dr. Alhad Pande to accurately assess the length and strength of your cervix, ensuring we determine the optimal timing for the procedure.",
    "Once the need for a cerclage is confirmed, our management approach focuses entirely on maximizing your safety and personal comfort. The procedure is performed under safe anesthesia in our modern operating theaters in Narol, Ahmedabad, ensuring a pain-free experience. Following the placement, we provide detailed guidance on activity levels, symptom tracking, and wellness, keeping you and your family fully informed. Our commitment continues with regular check-ups, culminating in the safe, painless removal of the stitch around the 37th week of pregnancy to pave the way for a smooth delivery.",
  ],
};

export default function CervicalCerclage() {
  return <ServicePageLayout data={data} />;
}
