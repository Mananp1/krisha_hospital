'use client';

import { useRef, useState } from 'react';
import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitInquiry } from '@/app/actions/public-forms';
import {
  inquirySchema,
  HONEYPOT_FIELD,
  type InquiryFormData,
} from '@/lib/schemas/public-forms';
import { gsap, useGSAP } from '@/app/animations/gsap';
import { motion } from '@/app/animations/motion-config';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({ resolver: zodResolver(inquirySchema) });

  useGSAP(
    () => {
      const form = formRef.current;
      if (!form) return;

      const fields = form.querySelectorAll('[data-form-field]');
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(fields, { clearProps: 'all' });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          fields,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motion.duration.base,
            stagger: motion.stagger.tight,
            ease: motion.ease.enter,
            clearProps: 'opacity,visibility,transform',
            scrollTrigger: {
              trigger: form,
              start: motion.triggerStart,
              once: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: formRef },
  );

  async function onSubmit(data: InquiryFormData) {
    setStatus('loading');
    setErrorMsg('');

    // Goes through a server action rather than straight to Supabase: the write
    // still lands via the same security-definer function, but the server can
    // then notify the clinic by email, which the browser cannot do without
    // holding the Resend key. See app/actions/public-forms.ts.
    const result = await submitInquiry(data);

    if (!result.ok) {
      setErrorMsg(result.message);
      setStatus('error');
      return;
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center">
          <CheckIcon size={28} />
        </div>
        <h3 className="text-[20px] font-bold text-text-base">Message Sent!</h3>
        <p className="text-[14px] text-text-muted max-w-[300px] leading-[23px]">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => { reset(); setStatus('idle'); }}
          className="mt-2 text-[13px] font-semibold text-primary hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Decoy field. Out of flow, zero-sized, hidden from screen readers and
          skipped by the tab key, so no person can reach it — anything that
          fills it is automated, and the server drops the submission silently.
          No `data-form-field`, so it stays out of the entry animation. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <input
          {...register(HONEYPOT_FIELD)}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div data-form-field className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="name">
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Priya Shah"
            {...register('name')}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {errors.name && (
            <p className="text-[12px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div data-form-field className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="phone">
            Phone Number <span className="text-secondary">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {errors.phone && (
            <p className="text-[12px] text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div data-form-field className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
        {errors.email && (
          <p className="text-[12px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div data-form-field className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="message">
          How can we help? <span className="text-secondary">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe your concern or what you'd like to book an appointment for..."
          {...register('message')}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
        />
        {errors.message && (
          <p className="text-[12px] text-destructive">{errors.message.message}</p>
        )}
      </div>

      {status === 'error' && (
        <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-[13px] text-destructive">
          {errorMsg}
        </div>
      )}

      <button
        data-form-field
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <LoaderCircleIcon className="animate-spin h-4 w-4" />
            Sending...
          </>
        ) : 'Send Message'}
      </button>

      <p className="text-[12px] text-text-muted text-center leading-[18px]">
        We typically respond within 24 hours. For urgent concerns, please call&nbsp;
        <a href="tel:+917862950676" className="text-primary font-semibold">+91 78629 50676</a>.
      </p>
    </form>
  );
}
