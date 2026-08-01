'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckIcon, ChevronDownIcon, GlobeIcon } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

/**
 * Language picker for the TopBar. Switches locale in place — `usePathname`
 * from the i18n navigation returns the current route without its locale
 * prefix, so `router.replace(pathname, { locale })` keeps the visitor on the
 * same page in the language they chose.
 */
export default function LocaleSwitcher() {
  const t = useTranslations('langSwitcher');
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function switchTo(locale: string) {
    setOpen(false);
    if (locale === activeLocale) return;
    router.replace(pathname, { locale });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('label')}
        className="flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium hover:opacity-80 transition-opacity"
      >
        <GlobeIcon size={14} aria-hidden="true" />
        <span>{t(activeLocale)}</span>
        <ChevronDownIcon
          size={13}
          aria-hidden="true"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-[60] mt-2 w-40 overflow-hidden rounded-md border border-border-muted bg-surface py-1 shadow-float"
        >
          {routing.locales.map((locale) => {
            const selected = locale === activeLocale;
            return (
              <li key={locale} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => switchTo(locale)}
                  className={cn(
                    'flex w-full items-center justify-between px-3.5 py-2 text-left text-meta transition-colors',
                    selected
                      ? 'font-semibold text-primary'
                      : 'text-text-base hover:bg-primary-50 hover:text-primary',
                  )}
                >
                  {t(locale)}
                  {selected && <CheckIcon size={14} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
