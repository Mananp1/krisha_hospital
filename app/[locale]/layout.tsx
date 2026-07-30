import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import '../globals.css';
import { cn } from "@/lib/utils";
import { SITE_URL } from '@/lib/site-config';
import { routing } from '@/i18n/routing';
import { fontClassNamesFor } from '@/app/fonts';
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
        url: '/gallery/reception-waiting-lounge.jpg',
        width: 4000,
        height: 1716,
        alt: "Reception and waiting lounge at Krisha Women's Hospital, Narol Ahmedabad",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Krisha Women's Hospital",
    description: "Expert women's healthcare in Ahmedabad",
    images: ['/gallery/reception-waiting-lounge.jpg'],
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

  // Opts this subtree into static rendering. Also required before any
  // translation lookup, for when the sections start reading from `messages`.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={cn("font-sans", fontClassNamesFor(locale))}>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
        <WhatsAppFABWrapper />
      </body>
    </html>
  );
}
