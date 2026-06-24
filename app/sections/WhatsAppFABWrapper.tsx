'use client';

import { usePathname } from 'next/navigation';
import WhatsAppFAB from './WhatsAppFAB';

export default function WhatsAppFABWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <WhatsAppFAB />;
}
