export interface ServiceEntry {
  name: string;
  slug: string;
}

export const services: ServiceEntry[] = [
  { name: 'Pregnancy & Maternity Care',                    slug: 'pregnancy-maternity-care' },
  { name: 'High-Risk Pregnancy Management',                slug: 'high-risk-pregnancy' },
  { name: 'Antenatal & Gynecological Sonography',          slug: 'antenatal-gynecological-sonography' },
  { name: 'Infertility Treatment (IUI/IVF)',               slug: 'infertility-treatment' },
  { name: 'Advanced Laparoscopic & Hysteroscopic Surgery', slug: 'laparoscopic-hysteroscopic-surgery' },
  { name: 'Menopause Consultation & Treatment',            slug: 'menopause-consultation' },
  { name: 'Adolescent Gynecology',                         slug: 'adolescent-gynecology' },
  { name: 'Preconception Counseling',                      slug: 'preconception-counseling' },
  { name: 'Painless Vaginal Delivery',                     slug: 'painless-vaginal-delivery' },
  { name: 'Tuboplasty & Fertility Procedures',             slug: 'tuboplasty-fertility-procedures' },
  { name: 'Cervical Cerclage',                             slug: 'cervical-cerclage' },
  { name: 'Cervical Cancer Screening & HPV Vaccination',   slug: 'cervical-cancer-screening' },
  { name: 'Family Planning & Contraceptive Counseling',    slug: 'family-planning-contraceptive-counseling' },
];
