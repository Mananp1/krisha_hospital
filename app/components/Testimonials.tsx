import Link from 'next/link';
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

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full bg-surface-subtle py-12 lg:py-20">
      <div className="max-w-360 mx-auto px-5 lg:px-25">

        <div className="flex flex-col items-center">
          <SectionHeader
            eyebrow="PATIENT STORIES"
            title="What our patients say"
            subtitle="Real stories from women who trusted us with their most precious moments — their health, their pregnancies, their dreams of parenthood."
          />
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-[20px] bg-surface border border-border-muted">
            <span className="text-amber-400 text-[14px]">★</span>
            <span className="font-bold text-[13px] text-text-base">4.9</span>
            <span className="text-[13px] text-text-muted">on Google Reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-[18px] p-7 bg-surface border border-border-muted gap-3.5"
            >
              <div className="text-amber-400 text-[15px] tracking-[2px]">★★★★★</div>

              <p className="text-[14px] text-text-base leading-[23px] grow line-clamp-5">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary text-text-inverse flex items-center justify-center flex-shrink-0">
                  {t.initials
                    ? <span className="text-[13px] font-bold">{t.initials}</span>
                    : <PersonIcon />
                  }
                </div>
                <div>
                  {t.name && <p className="font-bold text-[14px] text-text-base">{t.name}</p>}
                  <p className="text-[12px] text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/#contact"
            className="px-7 py-3.5 text-[15px] font-semibold rounded-[40px] border-[1.5px] border-primary text-primary hover:bg-primary hover:text-text-inverse transition-colors"
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </section>
  );
}
