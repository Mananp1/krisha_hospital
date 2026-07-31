'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * A media query is an external, mutable source rather than React state, so
 * it is subscribed to rather than mirrored into `useState` from an effect —
 * that pattern renders once with a wrong value before correcting itself,
 * and React flags it.
 */
function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onStoreChange);
  return () => query.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** `matchMedia` does not exist while server rendering; assume motion is allowed. */
function getServerSnapshot() {
  return false;
}

/**
 * Reads the reduced-motion preference, and keeps reading it — the
 * subscription matters because the setting can be changed while the page is
 * open.
 *
 * This exists so the site does not ship two animation libraries. GSAP is the
 * animation system, and everything under app/animations reads the preference
 * through `gsap.matchMedia()`. One component still pulled `useReducedMotion`
 * from framer-motion, which made that package a dependency of the hero — the
 * first thing loaded on every page — to answer a single media query.
 */
export default function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
