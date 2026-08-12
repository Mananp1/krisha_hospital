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
    <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-surface border-b border-border-muted shrink-0">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl text-text-muted hover:bg-surface-subtle transition-colors"
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
          style={{ width: 80, height: 'auto' }}
        />
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-60 p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Logo */}
          <div className="px-6 py-5 border-b border-border-muted">
            <Image
              src="/krisha-logo.png"
              alt="Krisha Women's Hospital"
              width={100}
              height={48}
              style={{ width: 100, height: 'auto' }}
            />
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary'
                      : 'text-text-muted hover:bg-surface-subtle hover:text-text-base',
                  )}
                >
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
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
        </SheetContent>
      </Sheet>
    </div>
  );
}
