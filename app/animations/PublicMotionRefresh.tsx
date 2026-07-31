'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from './gsap';

/**
 * Recomputes ScrollTrigger positions after anything that can change page
 * height — images finishing, webfonts swapping, a resize. Without it,
 * triggers keep measuring against the layout as it stood at hydration.
 */
export default function PublicMotionRefresh() {
  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // `load` fires once per document. On a client-side navigation this
    // mounts long after that has been and gone, so the listener alone would
    // never run — check whether loading has already finished.
    if (document.readyState === 'complete') {
      refresh();
    } else {
      window.addEventListener('load', refresh, { once: true });
    }

    window.addEventListener('resize', refresh);

    // Guarded by `cancelled` rather than left to settle on its own: a
    // promise cannot be removed like a listener, so on a quick navigation
    // away this would otherwise resolve into a refresh after unmount.
    document.fonts?.ready.then(refresh);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, []);

  return null;
}
