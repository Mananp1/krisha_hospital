import type { ComponentType } from 'react';
import {
  ActivityIcon,
  SunIcon,
  UserIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  SearchIcon,
  CalendarIcon,
} from 'lucide-react';
import {
  PregnancyIcon,
  SonographyIcon,
  LaparoscopyIcon,
  FertilityIcon,
  TuboplastyIcon,
  CerclageIcon,
} from '@/components/brand/icons';

/**
 * The single source of truth for the service catalogue.
 *
 * Structure lives here; **copy does not**. Names and descriptions come from
 * `messages.servicesSection.cards[slug]`, and the per-service page bodies from
 * `messages.servicesData[slug]`, so all thirteen exist once per locale rather
 * than once per component. This replaces three parallel lists — a 13-entry
 * array with its own descriptions and inline SVGs inside Services.tsx, a
 * name+slug list here, and the message catalogue.
 */
export type ServiceGroup = 'pregnancy' | 'fertility' | 'gynaecology' | 'preventive';

export interface ServiceEntry {
  slug: string;
  /** Featured services get the large bento cards; the rest form the compact grid. */
  featured: boolean;
  group: ServiceGroup;
  Icon: ComponentType<{ size?: number; className?: string }>;
}

/**
 * Order is load-bearing for the featured set: the first entry takes the wide
 * bento cell, so it should be the speciality the hospital most wants read first.
 */
export const services: ServiceEntry[] = [
  // ── Featured ──────────────────────────────────────────────────────────
  { slug: 'pregnancy-maternity-care',            featured: true,  group: 'pregnancy',   Icon: PregnancyIcon },
  { slug: 'high-risk-pregnancy',                 featured: true,  group: 'pregnancy',   Icon: ActivityIcon },
  { slug: 'infertility-treatment',               featured: true,  group: 'fertility',   Icon: FertilityIcon },
  { slug: 'antenatal-gynecological-sonography',  featured: true,  group: 'gynaecology', Icon: SonographyIcon },
  { slug: 'laparoscopic-hysteroscopic-surgery',  featured: true,  group: 'gynaecology', Icon: LaparoscopyIcon },

  // ── Secondary ─────────────────────────────────────────────────────────
  { slug: 'painless-vaginal-delivery',           featured: false, group: 'pregnancy',   Icon: ShieldCheckIcon },
  { slug: 'cervical-cerclage',                   featured: false, group: 'pregnancy',   Icon: CerclageIcon },
  { slug: 'tuboplasty-fertility-procedures',     featured: false, group: 'fertility',   Icon: TuboplastyIcon },
  { slug: 'preconception-counseling',            featured: false, group: 'fertility',   Icon: ClipboardListIcon },
  { slug: 'adolescent-gynecology',               featured: false, group: 'gynaecology', Icon: UserIcon },
  { slug: 'cervical-cancer-screening',           featured: false, group: 'preventive',  Icon: SearchIcon },
  { slug: 'family-planning-contraceptive-counseling', featured: false, group: 'preventive', Icon: CalendarIcon },
  { slug: 'menopause-consultation',              featured: false, group: 'preventive',  Icon: SunIcon },
];

export const featuredServices = services.filter((s) => s.featured);
export const secondaryServices = services.filter((s) => !s.featured);

/** Group order for the compact grid. */
export const serviceGroups: ServiceGroup[] = [
  'pregnancy',
  'fertility',
  'gynaecology',
  'preventive',
];

export const servicesInGroup = (group: ServiceGroup) =>
  secondaryServices.filter((s) => s.group === group);
