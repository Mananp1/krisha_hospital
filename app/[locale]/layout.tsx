import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { cn } from "@/lib/utils";
import { SITE_URL } from '@/lib/site-config';
import { routing } from '@/i18n/routing';
import { fontVariableClassName } from '@/app/fonts';
import WhatsAppFABWrapper from '@/app/sections/WhatsAppFABWrapper';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title:
    "Krisha Women's Hospital — Gynaecology, Maternity & IVF Centre, Narol Ahmedabad",
  description:
    "Expert women's healthcare in Ahmedabad — gynaecology, safe maternity, IVF & infertility, high-risk pregnancy, laparoscopy and PCOS clinic led by Dr. Alhad Pande at Narol.",
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Krisha Women's Hospital",
    description: "Expert women's healthcare in Ahmedabad",
    type: 'website',
    url: '/',
    siteName: "Krisha Women's Hospital",
    locale: 'en_IN',
    images: [
      {
        url: '/gallery/reception-desk-2.jpg',
        // Keep in sync with the actual file — a wrong aspect ratio here can
        // make social crawlers render the preview cropped oddly.
        width: 1510,
        height: 1030,
        alt: "Reception desk at Krisha Women's Hospital, Narol Ahmedabad",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Krisha Women's Hospital",
    description: "Expert women's healthcare in Ahmedabad",
    images: ['/gallery/reception-desk-2.jpg'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opts this subtree into static rendering, and is required before any
  // translation lookup in the sections below.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={cn('font-sans', fontVariableClassName)}>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        {/*
          Rendered from a Server Component, so locale, messages, formats and
          timeZone are all inherited from i18n/request.ts — client sections can
          call useTranslations without being handed anything explicitly.
        */}
        <NextIntlClientProvider>
          {children}
          <WhatsAppFABWrapper />
          {/*
            The splash lives in template.tsx, not here. A layout instance
            survives client-side navigation, so mounting it at this level
            meant it ran once per full page load and never again while the
            visitor moved between pages.
          */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
