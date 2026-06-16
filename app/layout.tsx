import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title:
    "Krisha Women's Hospital — Gynaecology, Maternity & IVF Centre, Narol Ahmedabad",
  description:
    "Expert women's healthcare in Ahmedabad — gynaecology, safe maternity, IVF & infertility, high-risk pregnancy, laparoscopy and PCOS clinic led by Dr. Alhad Pande at Narol.",
  openGraph: {
    title: "Krisha Women's Hospital",
    description: "Expert women's healthcare in Ahmedabad",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
