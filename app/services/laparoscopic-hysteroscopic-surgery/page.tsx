import type { Metadata } from 'next';
import ServicePageLayout, { type ServicePageData } from '@/app/sections/services/ServicePageLayout';

export const metadata: Metadata = {
  title: "Laparoscopic & Hysteroscopic Surgery in Narol, Ahmedabad | Krisha Women's Hospital",
  description:
    "Advanced minimally invasive gynecological surgery led by Dr. Alhad Pande at Krisha Women's Hospital, Narol Ahmedabad. Laparoscopy and hysteroscopy for fibroids, cysts, endometriosis, and more.",
};

const data: ServicePageData = {
  title: "Advanced Laparoscopic & Hysteroscopic Surgery in Narol, Ahmedabad",
  shortTitle: "Laparoscopic & Hysteroscopic Surgery",
  intro:
    "Surgical interventions in women's healthcare have been revolutionized by modern technology, shifting away from large incisions toward precise, minimally invasive techniques. At Krisha Women's Hospital in Narol, Ahmedabad, we offer advanced laparoscopic and hysteroscopic surgeries designed to treat complex gynecological conditions with minimal disruption to your life. Led by the renowned expertise of Dr. Alhad Pande, our surgical team utilizes cutting-edge medical technology to perform highly accurate procedures through tiny incisions or natural pathways. This state-of-the-art approach translates to significantly less postoperative pain, shorter hospital stays, and a much faster return to your daily routine. We combine surgical excellence with a compassionate, reassuring environment, prioritizing your safety, comfort, and long-term recovery every step of the way.",
  overview: [
    "Advanced laparoscopic and hysteroscopic surgeries are modern, minimally invasive techniques used to diagnose and treat conditions affecting the female reproductive system. Laparoscopy, often called \"keyhole surgery,\" involves inserting a thin, lighted instrument through tiny abdominal incisions to view and operate on pelvic organs. Hysteroscopy allows the surgeon to examine and treat the inside of the uterus by passing a specialized scope through the natural opening of the cervix, requiring no external incisions at all.",
    "These advanced procedures are vitally important because they replace traditional open surgeries that involve large abdominal incisions and lengthy, painful recovery periods. Women dealing with uterine fibroids, ovarian cysts, endometriosis, pelvic adhesions, abnormal uterine bleeding, or structural issues causing unexplained infertility can benefit immensely from these treatments. It allows for highly precise corrections while preserving maximum healthy surrounding tissue.",
    "By minimizing physical trauma to the body, this service directly supports a woman's holistic health and long-term well-being. Reduced blood loss during surgery and lower risks of postoperative complications mean a safer medical experience overall. Furthermore, preserving uterine and ovarian integrity whenever possible helps safeguard future fertility, helping women eliminate chronic pelvic pain and regain their quality of life with confidence.",
  ],
  benefits: [
    {
      label: "Minimal Scarring",
      description:
        "Tiny incisions result in virtually unnoticeable cosmetic scars compared to traditional open surgery.",
    },
    {
      label: "Faster Recovery Time",
      description:
        "Most patients return to their normal daily activities within a fraction of the traditional healing timeframe.",
    },
    {
      label: "Reduced Postoperative Pain",
      description:
        "Less tissue disruption translates directly to significantly less discomfort during the healing process.",
    },
    {
      label: "Shorter Hospital Stays",
      description:
        "Many hysteroscopic and laparoscopic procedures are safely performed on a day-care or short-stay basis.",
    },
    {
      label: "Enhanced Precision",
      description:
        "High-definition camera systems provide Dr. Alhad Pande with a magnified, crystal-clear view of the pelvic anatomy.",
    },
    {
      label: "Lower Risk of Infection",
      description:
        "Smaller wounds drastically reduce exposure and the likelihood of post-surgical wound complications.",
    },
  ],
  approach: [
    "At Krisha Women's Hospital, our approach to advanced gynecological surgery is deeply patient-centered and rooted in empathy. We recognize that the prospect of surgery can cause anxiety. Our process begins with a meticulous diagnostic evaluation, where Dr. Alhad Pande utilizes detailed medical histories and advanced imaging to confirm whether a minimally invasive surgical path is the most effective choice for your specific condition.",
    "Once surgery is determined to be the optimal solution, our management approach focuses on absolute safety and your personal comfort. We walk you through every step of the upcoming procedure, ensuring you and your family fully understand the process. Our operating theaters are equipped with modern endoscopic technologies, enabling us to deliver exceptional clinical results while adhering to strict international safety protocols.",
    "Our commitment to your health extends far beyond the operating room. We focus intensely on long-term health outcomes, providing structured post-operative tracking, personalized rehabilitation advice, and continuous wellness guidance. By combining specialized medical expertise with a warm, caring touch at our facility in Narol, Ahmedabad, we ensure your transition from diagnosis to complete recovery is seamless and stress-free.",
  ],
};

export default function LaparoscopicHysteroscopicSurgery() {
  return <ServicePageLayout data={data} />;
}
