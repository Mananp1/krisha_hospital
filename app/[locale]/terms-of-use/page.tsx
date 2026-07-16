import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Terms of Use | Krisha Women's Hospital",
  description:
    "Terms and conditions governing the use of the Krisha Women's Hospital website, Narol Ahmedabad.",
  alternates: { canonical: '/terms-of-use' },
};

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function Section({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[18px] lg:text-[20px] font-bold text-text-base">{title}</h2>
      <div className="flex flex-col gap-3 text-[14px] text-text-muted leading-7">{children}</div>
    </section>
  );
}

export default function TermsOfUsePage() {
  return (
    <>
      <section className="w-full bg-surface-subtle border-b border-border-muted py-14 lg:py-20">
        <div className="max-w-360 mx-auto px-5 lg:px-25">
          <nav className="flex items-center gap-1.5 text-[13px] text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronIcon />
            <span className="text-text-base font-medium">Terms of Use</span>
          </nav>

          <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-text-base leading-tight mb-4">
            Terms of Use
          </h1>
          <p className="text-[15px] lg:text-[16px] text-text-muted leading-6.75 max-w-155">
            Last updated: 16 July 2026. Please read these terms carefully before
            using the Krisha Women&apos;s Hospital website.
          </p>
        </div>
      </section>

      <section className="w-full bg-surface py-14 lg:py-20">
        <div className="max-w-190 mx-auto px-5 lg:px-0">
          <div className="flex flex-col gap-10">

            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using this website, you agree to be bound by these
                Terms of Use. If you do not agree with any part of these terms,
                please do not use this website.
              </p>
            </Section>

            <Section title="2. Use of This Website">
              <p>
                This website is provided to share information about Krisha
                Women&apos;s Hospital, our services, and our doctor, and to let
                visitors request appointments or contact us. You agree to use this
                website only for lawful purposes and not to submit false,
                misleading, or fraudulent information through our forms.
              </p>
            </Section>

            <Section title="3. Not a Substitute for Medical Advice">
              <p>
                The content on this website — including service descriptions and
                general health information — is provided for informational purposes
                only and does not constitute medical advice, diagnosis, or
                treatment. It is not a substitute for an in-person consultation with
                a qualified physician.
              </p>
              <p>
                <strong className="text-text-base font-semibold">
                  If you are experiencing a medical emergency, call your local
                  emergency services or go to the nearest hospital immediately.
                </strong>{' '}
                For urgent concerns, you may also call us directly at{' '}
                <a href="tel:+917862950676" className="text-primary font-semibold hover:underline underline-offset-2">
                  +91 78629 50676
                </a>.
              </p>
            </Section>

            <Section title="4. Appointment Requests">
              <p>
                Submitting the appointment form or messaging us on WhatsApp is a
                request for an appointment, not a confirmed booking. Our team will
                contact you by phone, email, or WhatsApp to confirm your date and
                time. Actual availability is subject to confirmation by hospital
                staff.
              </p>
            </Section>

            <Section title="5. Third-Party Links and Services">
              <p>
                This website links to or embeds third-party services, including
                Google Maps and WhatsApp. We are not responsible for the content,
                privacy practices, or availability of these third-party services,
                which are governed by their own terms and policies.
              </p>
            </Section>

            <Section title="6. Intellectual Property">
              <p>
                All text, images, and other content on this website, unless
                otherwise noted, are the property of Krisha Women&apos;s Hospital and
                may not be reproduced, distributed, or used without our prior
                written consent.
              </p>
            </Section>

            <Section title="7. Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Krisha Women&apos;s Hospital
                shall not be liable for any indirect, incidental, or consequential
                damages arising from your use of, or inability to use, this website,
                including reliance on any information contained on it.
              </p>
            </Section>

            <Section title="8. Governing Law">
              <p>
                These Terms of Use are governed by the laws of India. Any disputes
                arising from these terms or your use of this website shall be
                subject to the exclusive jurisdiction of the courts in Ahmedabad,
                Gujarat.
              </p>
            </Section>

            <Section title="9. Changes to These Terms">
              <p>
                We may update these Terms of Use from time to time. The &quot;Last
                updated&quot; date at the top of this page reflects the most recent
                revision. Continued use of the website after changes are posted
                constitutes acceptance of the updated terms.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>
                For questions about these Terms of Use, contact us at{' '}
                <a href="mailto:care@krishawomenshospital.in" className="text-primary font-semibold hover:underline underline-offset-2">
                  care@krishawomenshospital.in
                </a>{' '}
                or call{' '}
                <a href="tel:+917862950676" className="text-primary font-semibold hover:underline underline-offset-2">
                  +91 78629 50676
                </a>.
              </p>
            </Section>

            <p className="text-[12.5px] text-text-muted/70 italic leading-6 pt-4 border-t border-border-muted">
              This page is provided as a general terms notice and does not
              constitute legal advice. We recommend having it reviewed by a
              qualified legal professional to confirm compliance with applicable
              regulations before relying on it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
