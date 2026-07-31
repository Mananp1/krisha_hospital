import type { Metadata } from 'next';
import '../globals.css';
import { cn } from '@/lib/utils';
import { fontVariableClassName } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'Admin — Krisha Hospital',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('font-sans', fontVariableClassName)}>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
