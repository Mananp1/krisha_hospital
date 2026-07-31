'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import BrandLoader from './BrandLoader';

/**
 * How long the mark stays fully visible before it starts clearing, and how
 * long the clear itself takes. Both in milliseconds — these two constants
 * are the only thing to change to retune the splash.
 *
 * Worth being honest about the trade: this is time the visitor spends not
 * reading the page. The pages behind it are prerendered and paint almost
 * immediately, so every millisecond here is deliberately added waiting, not
 * waiting that was already happening.
 *
 * ~1.05s total. Kept tight because this now runs on every navigation, not
 * just the first load — a duration that reads as a nice touch once becomes
 * a toll booth when it sits in front of every link the visitor clicks.
 */
const HOLD_MS = 700;
const FADE_MS = 350;

/**
 * The splash that actually shows, as distinct from the `loading.tsx` files.
 *
 * Those are Suspense fallbacks: they appear only while a navigation is
 * genuinely pending, and since every page here is prerendered and prefetched
 * on hover, that window is usually zero — which is why the loader seemed to
 * flash past or never arrive. Nothing about them is tunable; they are gone
 * the instant the route resolves.
 *
 * This owns its own clock instead, so it is visible for a known duration.
 * It is mounted from `app/[locale]/template.tsx` rather than the layout,
 * which is what makes it re-run on every navigation instead of only once
 * per full page load — see that file for why a template and not a layout.
 *
 * Note it will not re-run on a back/forward restore from the browser's
 * bfcache, which replays the saved DOM without re-executing this. That is
 * browser behaviour, not state being cached here — a normal reload always
 * shows it again.
 *
 * Rendered on the server too, not mounted in an effect: mounting late would
 * show a frame of the real page first and then cover it up, which reads as a
 * glitch. The cost is that it is the first paint, so keep HOLD_MS honest.
 */
export default function SplashScreen() {
  const [phase, setPhase] = useState<'holding' | 'fading' | 'done'>('holding');

  useEffect(() => {
    const hold = window.setTimeout(() => setPhase('fading'), HOLD_MS);
    return () => window.clearTimeout(hold);
  }, []);

  useEffect(() => {
    if (phase !== 'fading') return;

    const fade = window.setTimeout(() => setPhase('done'), FADE_MS);
    return () => window.clearTimeout(fade);
  }, [phase]);

  // Unmounted rather than left transparent, so it cannot swallow clicks or
  // sit in the accessibility tree once it has served its purpose.
  if (phase === 'done') return null;

  return (
    <div
      // Hidden from assistive tech: BrandLoader already announces itself via
      // role="status", and the page underneath is what a screen reader user
      // should be hearing — not a decorative overlay on a timer.
      aria-hidden="true"
      className={cn(
        'fixed inset-0 z-100 transition-opacity ease-out motion-reduce:transition-none',
        phase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <BrandLoader />
    </div>
  );
}
