import type { Metadata } from 'next';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/app/animations/FadeIn';
import MotionGroup from '@/app/animations/MotionGroup';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site-config';

export const metadata: Metadata = {
  title: "Privacy Policy | Krisha Women's Hospital",
  description:
    "How Krisha Women's Hospital, Narol Ahmedabad collects, uses, and protects your personal and health information.",
  alternates: { canonical: '/privacy-policy' },
};

function ChevronIcon() {
  return (
    <ChevronRightIcon size={12} />
  );
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section data-motion-item className="flex flex-col gap-3">
      <h2 className="text-[18px] lg:text-[20px] font-bold text-text-base">{title}</h2>
      <div className="flex flex-col gap-3 text-[14px] text-text-muted leading-7">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="w-full bg-surface-subtle border-b border-border-muted py-section-sm lg:py-section">
        <div className="max-w-page mx-auto px-5 lg:px-gutter">
          <FadeIn>
          <nav className="flex items-center gap-1.5 text-[13px] text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronIcon />
            <span className="text-text-base font-medium">Privacy Policy</span>
          </nav>

          <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-text-base leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[15px] lg:text-[16px] text-text-muted leading-6.75 max-w-155">
            Last updated: 16 July 2026. This policy explains what information Krisha
            Women&apos;s Hospital collects through this website, why we collect it,
            and how it is stored and protected.
          </p>
          </FadeIn>
        </div>
      </section>

      <section className="w-full bg-surface py-section-sm lg:py-section">
        <div className="max-w-190 mx-auto px-5 lg:px-0">
          <MotionGroup className="flex flex-col gap-10">

            <Section title="1. Introduction">
              <p>
                Krisha Women&apos;s Hospital (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates this website to
                provide information about our services and to let visitors request
                appointments or get in touch with our care team. This Privacy Policy
                describes our practices regarding the personal information you may
                share with us through the website, in line with the Digital Personal
                Data Protection Act, 2023 (DPDP Act) and applicable Indian law.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>We collect information you voluntarily provide when you:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>Submit the <strong className="text-text-base font-semibold">Contact Us</strong> form — your name, phone number, email address (optional), and message.</li>
                <li>Submit an <strong className="text-text-base font-semibold">Appointment Request</strong> — your name, phone number, email address (optional), preferred date and time, and any symptoms or reason for visit you choose to share.</li>
                <li>Contact us directly via phone, email, or WhatsApp.</li>
              </ul>
              <p>
                We do not use third-party analytics, advertising, or tracking
                cookies on this website.
              </p>
            </Section>

            <Section title="3. How We Use Your Information">
              <ul className="list-disc pl-5 flex flex-col gap-1.5">
                <li>To respond to your inquiry or confirm your appointment request.</li>
                <li>To contact you by phone, email, or WhatsApp regarding your visit.</li>
                <li>To maintain records of appointments and inquiries for clinical and administrative purposes.</li>
              </ul>
              <p>
                We do not use your information for marketing communications, and we
                do not sell or rent your personal information to any third party.
              </p>
            </Section>

            <Section title="4. Where Your Information Is Stored">
              <p>
                Information submitted through our forms is stored using Supabase, a
                third-party database and authentication provider, which acts as our
                data processor. Access to appointment and inquiry records is
                restricted to authorized hospital staff through a password-protected
                admin panel.
              </p>
              <p>
                Our website also embeds a Google Maps view of our location and links
                to WhatsApp for messaging. These third-party services operate under
                their own privacy policies, and we encourage you to review them
                separately.
              </p>
            </Section>

            <Section title="5. Data Security">
              <p>
                We take reasonable technical and organizational measures to protect
                your information, including restricted admin access and encrypted
                connections (HTTPS) between your browser and our servers. However, no
                method of electronic transmission or storage is completely secure,
                and we cannot guarantee absolute security.
              </p>
            </Section>

            <Section title="6. Health Information">
              <p>
                Any symptoms or medical details you choose to share with us through
                the appointment form or in person are treated as sensitive personal
                information. This information is used solely for the purpose of
                providing you medical care and is accessible only to authorized
                clinical and administrative staff.
              </p>
            </Section>

            <Section title="7. Children &amp; Minors">
              <p>
                Some of our services (such as adolescent gynecology) may involve
                minors. Where a patient is a minor, we expect appointment requests
                and related information to be submitted by, or with the consent of,
                a parent or legal guardian.
              </p>
            </Section>

            <Section title="8. Your Rights">
              <p>
                You may request access to, correction of, or deletion of your
                personal information held by us, subject to our legal and clinical
                record-keeping obligations. To make a request, please contact us
                using the details below.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. The &quot;Last
                updated&quot; date at the top of this page reflects the most recent
                revision. Continued use of the website after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>
                For questions about this Privacy Policy or to make a data request,
                contact us at{' '}
                <a href={CONTACT_EMAIL_HREF} className="text-primary font-semibold hover:underline underline-offset-2">
                  {CONTACT_EMAIL}
                </a>{' '}
                or call{' '}
                <a href="tel:+917862950676" className="text-primary font-semibold hover:underline underline-offset-2">
                  +91 78629 50676
                </a>.
              </p>
            </Section>

            {/* muted/70 was 3.11:1 at this size, under the 4.5:1 floor; full opacity clears 5.94:1. */}
            <p data-motion-item className="text-[12.5px] text-text-muted italic leading-6 pt-4 border-t border-border-muted">
              This page is provided as a general privacy notice and does not
              constitute legal advice. We recommend having it reviewed by a
              qualified legal professional to confirm compliance with applicable
              healthcare and data protection regulations before relying on it.
            </p>
          </MotionGroup>
        </div>
      </section>
    </>
  );
}
