import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BrandLoaderProps {
  /**
   * Announced to assistive tech and shown under the mark. Keep it about
   * what is being fetched, not about the act of loading.
   */
  label?: string;
  /** Fills the viewport. Off for a loader placed inside a panel or card. */
  fullScreen?: boolean;
  className?: string;
}

/**
 * The waiting state, carrying the logo rather than a generic spinner.
 *
 * Marked `role="status"` with `aria-live="polite"`: a screen reader
 * announces the label once when this appears and again when it is replaced
 * by real content, without interrupting whatever is being read. The mark
 * itself is `aria-hidden` — it conveys nothing the label does not already
 * say, and an animated decoration announced on a loop is worse than
 * silence.
 *
 * The animation is paired with `motion-reduce:animate-none`. A pulsing
 * full-screen overlay is a genuine problem for motion sensitivity, and
 * unlike decorative motion elsewhere on the site this one covers the entire
 * viewport with nothing else to look at.
 */
export default function BrandLoader({
  label = 'Loading',
  fullScreen = true,
  className,
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center bg-surface px-5',
        fullScreen && 'min-h-screen w-full',
        className,
      )}
    >
      <Image
        src="/krisha-logo.png"
        alt=""
        aria-hidden="true"
        width={358}
        height={184}
        priority
        className="w-40 sm:w-48 h-auto animate-mark-pulse motion-reduce:animate-none"
      />

      <span className="sr-only">{label}</span>
    </div>
  );
}
