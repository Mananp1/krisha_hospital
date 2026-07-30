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
    <section className="w-full bg-surface py-section-sm lg:py-section">
      <div className="max-w-page mx-auto px-5 lg:px-gutter">
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
