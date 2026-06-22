'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboardIcon,
  CalendarIcon,
  CalendarDaysIcon,
  MessageSquareIcon,
  LogOutIcon,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Dashboard',    href: '/admin',              icon: LayoutDashboardIcon },
  { label: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
  { label: 'Schedule',     href: '/admin/calendar',     icon: CalendarDaysIcon },
  { label: 'Inquiries',    href: '/admin/inquiries',    icon: MessageSquareIcon },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col h-full bg-surface border-r border-border-muted">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-border-muted">
        <Link href="/admin">
          <Image
            src="/Logo.png"
            alt="Krisha Women's Hospital"
            width={100}
            height={48}
            loading="eager"
            style={{ width: 84, height: 'auto' }}
          />
        </Link>
        <span className="block text-[10px] font-semibold tracking-widest uppercase text-text-muted mt-1.5">
          Admin Panel
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all',
                isActive
                  ? 'bg-primary-50 text-primary'
                  : 'text-text-muted hover:bg-surface-subtle hover:text-text-base',
              )}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className="shrink-0"
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border-muted">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[14px] font-medium text-text-muted hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOutIcon size={17} strokeWidth={1.8} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}