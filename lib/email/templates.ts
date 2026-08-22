/**
 * Notification emails sent to the clinic when a patient acts on the public site.
 *
 * These are internal, staff-facing messages, so they are English-only — the
 * site's `next-intl` locales apply to what patients read, not to what lands in
 * the clinic inbox.
 *
 * Every interpolated value is patient-supplied and therefore escaped. A name or
 * message field is free text; without escaping, a stray `<` would silently
 * mangle the layout of the doctor's email, and deliberate markup could forge
 * convincing-looking content inside a message the clinic trusts.
 */

import { formatDateLong, formatTime } from '@/lib/format';
import { SITE_URL } from '@/lib/site-config';

export interface NotificationEmail {
  subject: string;
  html: string;
  text: string;
  /** Set when the patient left an address, so staff can reply from the inbox. */
  replyTo?: string;
}

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/**
 * Escapes free text and keeps its line breaks visible.
 *
 * Email clients collapse newlines like any other HTML whitespace, so a note a
 * patient typed across several lines would otherwise arrive as one run-on
 * paragraph. Escaping happens first — the `<br />` is the only markup allowed
 * through.
 */
function multiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

/**
 * Joins plain-text body lines, dropping only the ones a caller opted out of.
 *
 * `null` means "this line does not apply" — an absent email address, say.
 * `''` is a deliberate blank separator and is kept. Filtering on truthiness
 * would erase both and run the message together into a single block.
 */
function lines(parts: (string | null)[]): string {
  return parts.filter((part): part is string => part !== null).join('\n');
}

/**
 * Flattens whitespace for values interpolated into the subject.
 *
 * Resend is a JSON API, so it builds the MIME headers itself and a newline in
 * a patient's name cannot smuggle in a header the way raw SMTP concatenation
 * would. This is cheap insurance against a subject line that simply renders
 * broken in the clinic's inbox.
 */
function singleLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** A labelled row in the details table. Values are escaped by the caller. */
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #ecebef;color:#6b6878;font-size:13px;width:132px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #ecebef;color:#1c1a24;font-size:14px;font-weight:600;vertical-align:top;">${value}</td>
    </tr>`;
}

/**
 * Shared chrome. Inline styles and a table layout, because email clients strip
 * <style> blocks and have no meaningful flexbox support.
 */
function layout({
  heading,
  intro,
  rows,
  ctaHref,
  ctaLabel,
}: {
  heading: string;
  intro: string;
  rows: string;
  ctaHref: string;
  ctaLabel: string;
}): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px 12px;background:#f6f5f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ecebef;border-radius:12px;">
      <tr>
        <td style="padding:28px 28px 0;">
          <p style="margin:0 0 4px;color:#8b5cf6;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Krisha Women's Hospital</p>
          <h1 style="margin:0 0 6px;color:#1c1a24;font-size:20px;font-weight:700;">${heading}</h1>
          <p style="margin:0 0 20px;color:#6b6878;font-size:14px;line-height:21px;">${intro}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px 28px;">
          <a href="${ctaHref}" style="display:inline-block;padding:11px 20px;background:#8b5cf6;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">${ctaLabel}</a>
          <p style="margin:20px 0 0;color:#9a97a6;font-size:12px;line-height:18px;">
            Sent automatically from the Krisha Women's Hospital website. Actions taken
            inside the admin panel do not generate email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ── Appointment ─────────────────────────────────────────────────────────────

export interface AppointmentNotificationInput {
  patientName: string;
  phone: string;
  /** Empty or null when the patient did not give one. */
  email?: string | null;
  /** "yyyy-MM-dd" */
  date: string;
  /** "HH:mm" */
  time: string;
  message?: string | null;
}

export function appointmentNotificationEmail(
  input: AppointmentNotificationInput,
): NotificationEmail {
  const { patientName, phone, email, date, time, message } = input;

  const readableDate = formatDateLong(date);
  const readableTime = formatTime(time);
  const contactEmail = email?.trim() || '';

  const rows = [
    row('Patient', escapeHtml(patientName)),
    row('Phone', `<a href="tel:${escapeHtml(phone)}" style="color:#8b5cf6;text-decoration:none;">${escapeHtml(phone)}</a>`),
    contactEmail
      ? row('Email', `<a href="mailto:${escapeHtml(contactEmail)}" style="color:#8b5cf6;text-decoration:none;">${escapeHtml(contactEmail)}</a>`)
      : '',
    row('Date', escapeHtml(readableDate)),
    row('Time', escapeHtml(readableTime)),
    message?.trim() ? row('Note', multiline(message.trim())) : '',
  ].join('');

  const html = layout({
    heading: 'New appointment request',
    intro:
      'A patient booked through the website. It is saved as <strong>pending</strong> until someone confirms it.',
    rows,
    ctaHref: `${SITE_URL}/admin/appointments`,
    ctaLabel: 'Open appointments',
  });

  // Omitted lines are `null`, never `''` — the empty strings here are the blank
  // separator lines, and a truthiness filter would strip those too, collapsing
  // the message into one unbroken block.
  const text = lines([
    'New appointment request',
    '',
    `Patient: ${patientName}`,
    `Phone:   ${phone}`,
    contactEmail ? `Email:   ${contactEmail}` : null,
    `Date:    ${readableDate}`,
    `Time:    ${readableTime}`,
    message?.trim() ? `Note:    ${message.trim()}` : null,
    '',
    'Status is pending until confirmed.',
    `${SITE_URL}/admin/appointments`,
  ]);

  return {
    subject: singleLine(
      `New appointment — ${patientName}, ${readableDate} at ${readableTime}`,
    ),
    html,
    text,
    replyTo: contactEmail || undefined,
  };
}

// ── Contact inquiry ─────────────────────────────────────────────────────────

export interface InquiryNotificationInput {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
}

export function inquiryNotificationEmail(
  input: InquiryNotificationInput,
): NotificationEmail {
  const { name, phone, email, message } = input;
  const contactEmail = email?.trim() || '';

  const rows = [
    row('From', escapeHtml(name)),
    row('Phone', `<a href="tel:${escapeHtml(phone)}" style="color:#8b5cf6;text-decoration:none;">${escapeHtml(phone)}</a>`),
    contactEmail
      ? row('Email', `<a href="mailto:${escapeHtml(contactEmail)}" style="color:#8b5cf6;text-decoration:none;">${escapeHtml(contactEmail)}</a>`)
      : '',
    row('Message', multiline(message.trim())),
  ].join('');

  const html = layout({
    heading: 'New website enquiry',
    intro: 'Someone submitted the contact form on the website.',
    rows,
    ctaHref: `${SITE_URL}/admin/inquiries`,
    ctaLabel: 'Open enquiries',
  });

  const text = lines([
    'New website enquiry',
    '',
    `From:  ${name}`,
    `Phone: ${phone}`,
    contactEmail ? `Email: ${contactEmail}` : null,
    '',
    message.trim(),
    '',
    `${SITE_URL}/admin/inquiries`,
  ]);

  return {
    subject: singleLine(`New enquiry — ${name}`),
    html,
    text,
    replyTo: contactEmail || undefined,
  };
}
