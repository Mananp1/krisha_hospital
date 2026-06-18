import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import SectionHeader from './SectionHeader';
import FadeIn from './FadeIn';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 'item-1',
    question: "Why do patients choose Krisha Women's Hospital?",
    answer:
      'We combine experienced clinical care with a patient-first approach, ensuring every woman receives personalized attention throughout her healthcare journey.',
  },
  {
    id: 'item-2',
    question: 'Will I see the same doctor throughout my treatment?',
    answer:
      'Whenever possible, continuity of care is maintained so patients can build a long-term relationship with their doctor.',
  },
  {
    id: 'item-3',
    question: 'Do you handle high-risk pregnancies?',
    answer:
      'Yes. We provide specialized monitoring and management for high-risk pregnancies, ensuring both mother and baby receive expert care.',
  },
  {
    id: 'item-4',
    question: 'Is fertility treatment available under one roof?',
    answer:
      "Yes. Consultation, evaluation, counseling, fertility management, and related women's healthcare services are available in one place.",
  },
  {
    id: 'item-5',
    question: 'How do you make patients feel comfortable during consultations?',
    answer:
      'We believe in clear communication, compassionate care, and involving patients in every treatment decision.',
  },
];

export default function FAQ() {
  return (
    <section className="w-full bg-surface py-14 lg:py-20">
      <div className="max-w-360 mx-auto px-5 lg:px-25">
        <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">

          {/* Left — sticky heading panel */}
          <FadeIn className="lg:w-76 shrink-0 mb-10 lg:mb-0 lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="PATIENT QUERIES"
              title="Frequently Asked Questions"
              subtitle="Find answers to common questions about our services, consultations, pregnancy care, fertility treatments, and patient experience."
              centered={false}
              maxWidth={320}
            />

            {/* Contact callout */}
            <div className="mt-8 rounded-[14px] bg-primary-50 border border-primary-100 p-5">
              <p className="text-[13.5px] font-semibold text-text-base mb-1.5">
                Still have questions?
              </p>
              <p className="text-[13px] text-text-muted leading-5.5 mb-4">
                Our care team is available Mon–Sat 8AM–8PM and for emergencies 24×7.
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="tel:+917862950676"
                  className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-primary hover:text-primary-700 transition-colors"
                >
                  <span className="w-7 h-7 rounded-[8px] bg-primary-100 flex items-center justify-center shrink-0 text-primary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
                    </svg>
                  </span>
                  +91 78629 50676
                </a>
                <a
                  href="https://wa.me/917862950676"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-secondary hover:text-secondary-600 transition-colors"
                >
                  <span className="w-7 h-7 rounded-[8px] bg-secondary-50 flex items-center justify-center shrink-0 text-secondary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.556 4.122 1.527 5.855L.06 23.47l5.799-1.44A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.015-1.378l-.36-.214-3.44.853.88-3.338-.235-.375A9.814 9.814 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z" />
                    </svg>
                  </span>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Right — Accordion */}
          <FadeIn delay={0.1} className="flex-1 min-w-0">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="flex flex-col gap-2.5"
            >
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-border-muted rounded-[14px] bg-surface-subtle hover:border-primary/20 data-[state=open]:border-primary/25 data-[state=open]:bg-primary-50/40 transition-all duration-200 overflow-hidden"
                >
                  <AccordionTrigger className="px-5 py-4 text-[15px] font-semibold text-text-base hover:no-underline hover:text-primary data-[state=open]:text-primary rounded-none border-none transition-colors">
                    <span className="flex items-start gap-3.5 pr-2.5">
                      <span className="text-[11px] font-extrabold text-secondary/50 tabular-nums shrink-0 leading-none mt-1">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 text-[14.5px] text-text-muted leading-6.5">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
