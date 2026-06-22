'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number').regex(/^[\d\s\-+]{10,}$/, 'Enter a valid phone number'),
  email: z.union([z.string().email('Enter a valid email address'), z.literal('')]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus('loading');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.from('contact_inquiries').insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message,
      is_resolved: false,
    });

    if (error) {
      setErrorMsg('Something went wrong. Please try again or call us directly.');
      setStatus('error');
      return;
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 py-16 px-6">
        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="name">
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Priya Shah"
            {...register('name')}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
          />
          {errors.name && (
            <p className="text-[12px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="phone">
            Phone Number <span className="text-secondary">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            {...register('phone')}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
          />
          {errors.phone && (
            <p className="text-[12px] text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
        />
        {errors.email && (
          <p className="text-[12px] text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="message">
          How can we help? <span className="text-secondary">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Describe your concern or what you'd like to book an appointment for..."
          {...register('message')}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors resize-none"
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
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
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