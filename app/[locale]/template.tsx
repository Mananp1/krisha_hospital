import SplashScreen from '@/components/brand/SplashScreen';

/**
 * A template, not part of the layout — that distinction is the whole point.
 *
 * A layout instance is preserved across navigation, so a splash mounted
 * there runs once per full page load and never again while the visitor
 * clicks around. A template is remounted on every navigation, so the splash
 * re-runs on each route change.
 *
 * Remounting is also what keeps it from flickering. The obvious alternative
 * — watching the pathname from inside the layout and re-showing the splash
 * when it changes — only reacts *after* the destination has rendered, so
 * the new page flashes into view and is then covered up. Here the splash is
 * part of the same subtree being mounted, so it paints together with the
 * page it is covering.
 *
 * Cost worth remembering: everything below this remounts on navigation, and
 * every internal click is gated behind SplashScreen's duration. If that
 * starts to feel like an obstacle, shortening HOLD_MS is the first dial;
 * moving this back into layout.tsx restores once-per-page-load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SplashScreen />
    </>
  );
}
