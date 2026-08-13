'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inputClass } from './controls';

/**
 * Typing pauses long enough to mean "I have finished this word". Every filter
 * change is a server round trip — on the patients screen it re-reads and
 * re-groups the whole appointments table — so firing one per keystroke made a
 * ten-character name cost ten of them.
 */
const DEBOUNCE_MS = 300;

interface SearchFieldProps {
  /** Query-string key this field owns, e.g. `name`. */
  param: string;
  placeholder: string;
  icon: LucideIcon;
  className?: string;
}

/**
 * A text filter bound to one URL search parameter, shared by the appointments
 * and patients screens so the two cannot drift apart.
 *
 * The input is uncontrolled: it holds what was typed while the debounced URL
 * update is still pending, so a slow navigation can never yank characters back
 * out from under the typist.
 */
export function SearchField({ param, placeholder, icon: Icon, className }: SearchFieldProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get(param) ?? '');

  useEffect(() => {
    const current = searchParams.get(param) ?? '';
    // Nothing to push: either the URL already says this, or this render *is*
    // the result of the last push. Checking first is also what stops the effect
    // from looping, since applying the value changes `searchParams`.
    if (value === current) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(param, value); else params.delete(param);
      params.delete('page'); // any filter change puts you back on page 1
      router.replace(`${pathname}?${params.toString()}`);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, param, searchParams, router, pathname]);

  return (
    <div className={cn('relative flex-1 min-w-[160px]', className)}>
      <Icon
        size={15}
        strokeWidth={1.8}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn(inputClass, 'pl-9 pr-3')}
      />
    </div>
  );
}
