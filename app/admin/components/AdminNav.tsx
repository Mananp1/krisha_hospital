'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';
import { NAV } from './controls';

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
    <aside className={cn('hidden lg:flex w-60 shrink-0 flex-col h-full border-r', NAV.shell, NAV.divider)}>
      {/* Logo */}
      <div className={cn('px-4 py-3 border-b', NAV.divider)}>
        <Link href="/admin">
          <Image
            src="/krisha-logo.png"
            alt="Krisha Women's Hospital"
            width={100}
            height={48}
            loading="eager"
            className={NAV.logo}
            style={{ width: 84, height: 'auto' }}
          />
        </Link>
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
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
                isActive ? NAV.itemActive : NAV.item,
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
      <div className={cn('px-3 py-4 border-t', NAV.divider)}>
        <button
          onClick={handleLogout}
          className={cn('flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors cursor-pointer', NAV.signOut)}
        >
          <LogOutIcon size={17} strokeWidth={1.8} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}