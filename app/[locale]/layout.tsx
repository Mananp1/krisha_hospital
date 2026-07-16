import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { SITE_URL } from '@/lib/site-config';
import WhatsAppFABWrapper from '@/app/sections/WhatsAppFABWrapper';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
});

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
        url: '/hero-2.jpg',
        width: 1920,
        height: 1280,
        alt: "Krisha Women's Hospital",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Krisha Women's Hospital",
    description: "Expert women's healthcare in Ahmedabad",
    images: ['/hero-2.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", manrope.variable)}>
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
