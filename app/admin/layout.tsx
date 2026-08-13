import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from '@/components/ui/sonner';
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
        {/* Where every failed admin action is reported. Six seconds rather than
            the default four: these messages are full sentences that tell the
            staff member what to do next, and they need time to be read.

            `theme` is pinned because the component defaults to "system" and this
            app has no dark palette — an OS in dark mode would otherwise drop a
            dark toast onto a light panel. */}
        <Toaster theme="light" position="top-right" richColors closeButton duration={6000} />
      </body>
    </html>
  );
}
