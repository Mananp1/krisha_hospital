/**
 * Per-locale font loading.
 *
 * Neither Fraunces nor Manrope ships Devanagari or Gujarati glyphs, so a single
 * global stack would drop `/hi` and `/gu` headings onto the browser's default
 * serif. Each locale therefore gets its own display + body pair.
 *
 * All six `@font-face` blocks end up in the shared CSS chunk regardless of
 * locale — they are declared at module scope, which is the only way next/font
 * accepts them — but that costs bytes of CSS, not font downloads. Only the
 * active locale's `.locale-*` rule is on the page, so only its pair can be
 * matched by a rendered glyph, and a browser fetches an outline file solely
 * when something actually resolves to it. An English visitor never pulls
 * Devanagari, and a Gujarati visitor never pulls Fraunces.
 *
 * The returned class name sets `--font-display` and `--font-body`; every
 * `font-display` / `font-sans` utility resolves through those two variables.
 */
import {
  Manrope,
  Fraunces,
  Noto_Serif_Devanagari,
  Noto_Sans_Devanagari,
  Noto_Serif_Gujarati,
  Noto_Sans_Gujarati,
} from 'next/font/google';
import type { Locale } from '@/i18n/routing';

/** Body face for Latin text in every locale. */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

/** Display face — Latin only. Restricted to headings, stat numerals and quote marks. */
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-serif-deva',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-noto-sans-deva',
  display: 'swap',
});

const notoSerifGujarati = Noto_Serif_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-noto-serif-guj',
  display: 'swap',
});

const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-noto-sans-guj',
  display: 'swap',
});

/**
 * Font variable classes plus the `locale-*` hook that binds them to
 * `--font-display` / `--font-body` in globals.css.
 *
 * Manrope is loaded for every locale: Latin runs inside Hindi and Gujarati copy
 * (drug names, "IVF", phone numbers) still resolve to it, because CSS font
 * fallback is per glyph rather than per element.
 */
export function fontClassNamesFor(locale: Locale): string {
  switch (locale) {
    case 'hi':
      return [
        'locale-hi',
        manrope.variable,
        notoSerifDevanagari.variable,
        notoSansDevanagari.variable,
      ].join(' ');
    case 'gu':
      return [
        'locale-gu',
        manrope.variable,
        notoSerifGujarati.variable,
        notoSansGujarati.variable,
      ].join(' ');
    default:
      return ['locale-en', manrope.variable, fraunces.variable].join(' ');
  }
}

/** Admin panel — Latin UI only, no display face. */
export const adminFontClassName = ['locale-en', manrope.variable].join(' ');
