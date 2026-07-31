import Link from 'next/link';
import { QuoteIcon, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MotionGroup from '@/app/animations/MotionGroup';
import SectionHeader from './SectionHeader';

interface Testimonial {
  name?: string;
  initials?: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    initials: 'SS',
    name: 'Sneha Shinde',
    role: 'Maternity Patient',
    quote:
      "My experience with Dr. Alhad Pandey was truly excellent throughout my pregnancy journey. During my 1st to 6th month, I was visiting another doctor for regular check-ups who was quite costly, but I never received enough time, proper guidance, or detailed explanations there. After consulting Dr. Alhad Pandey, I felt much more comfortable and satisfied. The doctor patiently explained every small detail, answered all my questions calmly, and gave enough time during every visit. What I appreciated the most was the positive approach and continuous effort towards a normal delivery. Thanks to the doctor's support, care, and confidence, my normal delivery was successful. I highly recommend Dr. Alhad Pandey to anyone looking for a caring, supportive, and experienced gynecologist.",
  },
  {
    initials: 'MY',
    name: 'Mahimaben Yogi',
    role: 'VBAC Patient',
    quote:
      'मेरी पिछली डिलीवरी सिजेरियन से हुई थी... मैं नॉर्मल डिलीवरी चाहती थी... इसलिए मैंने डॉक्टर अलहाद से सलाह ली... वे बहुत दयालु थे और उन्होंने मुझे प्रक्रिया के साथ-साथ नॉर्मल डिलीवरी के जोखिमों के बारे में भी समझाया... लेकिन उन्हें मुझ पर पूरा भरोसा था... और उन्होंने सिजेरियन के बाद नॉर्मल डिलीवरी में मेरी मदद की... मेरा बेटा भी स्वस्थ और ठीक है। डॉक्टर अलहाद को उनके सहयोग के लिए धन्यवाद 🙏',
  },
  {
    role: 'Maternity Patient',
    quote:
      "My normal delivery journey was truly a beautiful and unforgettable experience, all thanks to Dr. Alhad Pandey. From the very beginning, he gave me confidence, comfort, and the right guidance throughout my pregnancy and delivery. His calm nature, positive words, and supportive care made me feel safe during every moment. Normal delivery is not easy, but because of his expertise and encouragement, I felt strong enough to go through it. I'm deeply grateful for the way he handled everything with patience and care. Thank you, Dr. Alhad Pandey, for making one of the most important moments of my life so special. Forever thankful for bringing my little miracle into this world safely. 🤍",
  },
];

export default function Testimonials() {
  return (
    // Bottom 15% blends toward FAQ's bg-surface.
    <section id="testimonials" className="w-full bg-linear-to-b from-surface-subtle from-85% to-surface py-section-sm lg:py-section relative overflow-hidden">

      <div className="relative max-w-page mx-auto px-5 lg:px-gutter">

        <div className="flex flex-col items-center">
          <SectionHeader
            eyebrow="PATIENT STORIES"
            title="What our patients say"
            subtitle="Real stories from women who trusted us with their most precious moments — their health, their pregnancies, their dreams of parenthood."
          />
          {/* Google Reviews rating pill */}
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/60">
            <span className="text-amber-400 text-[14px]">★</span>
            <span className="font-bold text-[13px] text-text-base">4.9</span>
            <span className="text-[13px] text-text-muted">on Google Reviews</span>
          </div>
        </div>

        <MotionGroup className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {testimonials.map((t, i) => (
            <div key={i} data-motion-item>
              <div className="group flex flex-col rounded-lg p-7 bg-surface border border-border-muted gap-3.5 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-card hover:border-primary/20">
                {/* Quote icon + stars */}
                <div className="flex items-start justify-between">
                  <QuoteIcon size={28} className="text-primary/20" />
                  <div className="text-amber-400 text-[15px] tracking-[2px]">★★★★★</div>
                </div>

                <p className="text-[14px] text-text-base leading-6 grow line-clamp-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary text-text-inverse flex items-center justify-center flex-shrink-0">
                    {t.initials
                      ? <span className="text-[13px] font-bold">{t.initials}</span>
                      : <UserIcon size={18} />
                    }
                  </div>
                  <div>
                    {t.name && <p className="font-bold text-[14px] text-text-base">{t.name}</p>}
                    <p className="text-[12px] text-text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </MotionGroup>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            asChild
            className="rounded-md px-7 py-3.5 h-auto text-[15px] font-semibold border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse shadow-none"
          >
            <Link href="/#contact">Share Your Story</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
