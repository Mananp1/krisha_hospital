/**
 * The single source of truth for the service catalogue.
 *
 * Structure lives here; **copy does not**. Names and descriptions come from
 * `messages.servicesSection.cards[slug]`, and the per-service page bodies from
 * `messages.servicesData[slug]`, so all thirteen exist once per locale rather
 * than once per component.
 */
export interface ServiceEntry {
  slug: string;
}

/**
 * Order is load-bearing: the Services section takes the first entry as its
 * full-width banner tile, so it should be the speciality the hospital most
 * wants read first. The remaining twelve fill the grid below it in this order.
 */
export const services: ServiceEntry[] = [
  { slug: 'pregnancy-maternity-care' },
  { slug: 'high-risk-pregnancy' },
  { slug: 'antenatal-gynecological-sonography' },
  { slug: 'infertility-treatment' },
  { slug: 'laparoscopic-hysteroscopic-surgery' },
  { slug: 'painless-vaginal-delivery' },
  { slug: 'cervical-cerclage' },
  { slug: 'tuboplasty-fertility-procedures' },
  { slug: 'preconception-counseling' },
  { slug: 'adolescent-gynecology' },
  { slug: 'cervical-cancer-screening' },
  { slug: 'family-planning-contraceptive-counseling' },
  { slug: 'menopause-consultation' },
];
