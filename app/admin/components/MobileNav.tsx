'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { MenuIcon, LogOutIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';
import { NAV } from './controls';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className={cn('lg:hidden flex items-center gap-3 px-4 py-3 border-b shrink-0', NAV.shell, NAV.divider)}>
      <button
        onClick={() => setOpen(true)}
        className={cn('p-2 rounded-md transition-colors cursor-pointer', NAV.item)}
        aria-label="Open menu"
      >
        <MenuIcon size={20} strokeWidth={1.8} />
      </button>

      <Link href="/admin">
        <Image
          src="/krisha-logo.png"
          alt="Krisha Women's Hospital"
          width={80}
          height={38}
          loading="eager"
          className={NAV.logo}
          style={{ width: 80, height: 'auto' }}
        />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className={cn(
            'w-60 p-0 flex flex-col border-r',
            '[&>button]:text-slate-400 [&>button:hover]:bg-white/10 [&>button:hover]:text-white',
            NAV.shell, NAV.divider,
          )}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo */}
          <div className={cn('px-6 py-5 border-b', NAV.divider)}>
            <Image
              src="/krisha-logo.png"
              alt="Krisha Women's Hospital"
              width={100}
              height={48}
              className={NAV.logo}
              style={{ width: 100, height: 'auto' }}
            />
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
                    isActive ? NAV.itemActive : NAV.item,
                  )}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
