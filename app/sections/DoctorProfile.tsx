import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

const PHONE = 'tel:+917862950676';

/**
 * The strongest trust element on the page, given the room to act like it.
 *
 * Previously every credential sat in its own bordered box with an icon well —
 * four containers that fragmented one story into four. Qualifications and
 * fellowships now read as a structured definition row, and consultation details
 * as a single panel. The Gujarati-service line was a small grey footnote; it is
 * now a labelled row in that panel, because for a Narol patient it is a real
 * accessibility benefit rather than a leftover.
 */
export default function DoctorProfile() {
  const t = useTranslations('doctorProfile');
  const tLang = useTranslations('langSwitcher');

  const tags: string[] = t.raw('tags');

  const credentials = [
    { label: t('metaQualifications'), value: t('metaQualificationsValue') },
    { label: t('metaFellowships'), value: t('metaFellowshipsValue') },
  ];

  const consult = [
    { label: t('metaOpdHours'), value: t('metaOpdHoursValue') },
    { label: t('metaHospital'), value: t('metaHospitalValue') },
    { label: tLang('label'), value: t('gujaratiNote') },
  ];

  return (
    <section
      id="doctor"
      className="w-full bg-surface-subtle py-section-sm lg:py-section-lg"
    >
      <div className="max-w-page mx-auto px-5 lg:px-gutter grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-12 lg:gap-16 xl:gap-20 items-start">
        {/* ── Portrait ── */}
        <FadeIn direction="right" className="relative w-full max-w-100 lg:max-w-none mx-auto lg:mx-0">
          {/* Arch — brand device B1. Photography only. */}
          <div className="relative w-full aspect-4/5 arch overflow-hidden bg-primary-50">
            <Image
              src="/doctor.jpeg"
              alt={`${t('name')} — ${t('role')}`}
              fill
              sizes="(min-width: 1024px) 460px, (min-width: 640px) 400px, 90vw"
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Experience marker, set in the display face like the stats band. */}
          <div className="absolute left-0 bottom-6 bg-surface px-5 py-3.5 rounded-md shadow-card">
            <span className="block font-display text-display-sm text-primary leading-none tabular-nums">
              20+
            </span>
            <span className="block mt-1 text-label uppercase text-text-muted">
              {t('yearsOfCare')}
            </span>
          </div>
        </FadeIn>

        {/* ── Editorial column ── */}
        <FadeIn delay={0.15} className="min-w-0">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('name')}
            centered={false}
          />

          <p className="mt-3 text-lead font-semibold text-primary">
            {t('role')}
          </p>

          <Badge
            variant="outline"
            className="h-auto overflow-visible rounded-pill mt-4 px-4 py-1.5 text-meta font-bold bg-primary-100 border-primary-200/60 text-primary-700"
          >
            {t('qualBadge')}
          </Badge>

          <p className="mt-6 text-body text-text-muted max-w-measure">
            {t('bio')}
          </p>

          {/* Credentials — one structured row, not four boxes. */}
          <dl className="mt-9 grid sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-border-muted pt-7">
            {credentials.map((item) => (
              <div key={item.label}>
                <dt className="text-label uppercase text-text-subtle">
                  {item.label}
                </dt>
                <dd className="mt-2 text-meta text-text-base leading-relaxed">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Expertise — clean tags, squared per the radius ladder. */}
          <div className="flex flex-wrap gap-2 mt-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-border-muted bg-surface px-2.5 py-1 text-meta font-medium text-primary-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Consultation — a separate panel, as the brief asks. */}
          <dl className="mt-8 rounded-md bg-surface border border-border-muted divide-y divide-border-muted">
            {consult.map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 px-5 py-3.5"
              >
                <dt className="text-label uppercase text-text-subtle sm:w-28 shrink-0">
                  {item.label}
                </dt>
                <dd className="text-meta text-text-base">{item.value}</dd>
              </div>
            ))}
          </dl>

          {/*
            No "Book appointment" here. The home page had seven routes to the
            same WhatsApp thread; this section's job is trust, and the booking
            CTA is one scroll away in the closing strip.
          */}
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <Button
              variant="secondary"
              asChild
              className="rounded-md px-6 py-3 h-auto text-body font-semibold hover:bg-secondary-600 shadow-none"
            >
              <a href={PHONE}>{t('callNow')}</a>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="rounded-md px-4 py-3 h-auto text-body font-semibold text-text-muted hover:text-primary hover:bg-primary-50 shadow-none gap-1.5"
            >
              <Link href="/doctor">
                {t('viewFullProfile')}
                <ArrowRightIcon size={14} />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
