'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
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
          onClick={() => { setForm({ name: '', phone: '', email: '', message: '' }); setSubmitted(false); }}
          className="mt-2 text-[13px] font-semibold text-primary hover:opacity-70 transition-opacity"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="name">Full Name <span className="text-secondary">*</span></label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Priya Shah"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-text-base" htmlFor="phone">Phone Number <span className="text-secondary">*</span></label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-text-base" htmlFor="message">How can we help? <span className="text-secondary">*</span></label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Describe your concern or what you'd like to book an appointment for..."
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-3 text-[14px] rounded-xl border border-border-muted bg-surface text-text-base placeholder:text-text-muted/60 focus:outline-none focus:border-primary transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 text-[15px] font-semibold text-text-inverse bg-secondary rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Send Message
      </button>

      <p className="text-[12px] text-text-muted text-center leading-[18px]">
        We typically respond within 24 hours. For urgent concerns, please call&nbsp;
        <a href="tel:+917862950676" className="text-primary font-semibold">+91 78629 50676</a>.
      </p>
    </form>
  );
}
