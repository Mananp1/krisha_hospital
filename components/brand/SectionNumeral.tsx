import { cn } from '@/lib/utils';

interface SectionNumeralProps {
  /** 1-based position. Rendered zero-padded: 1 → "01". */
  n: number;
  className?: string;
}

/**
 * Editorial section marker, set in the display face — the second of the two
 * brand devices (docs/redesign-plan.md, B2). The FAQ accordion prototyped this
 * inline; this is that pattern promoted so every section numbers the same way.
 *
 * Decorative: the number conveys nothing a screen reader needs, so it is hidden
 * from the accessibility tree rather than read out before every heading.
 */
export default function SectionNumeral({ n, className }: SectionNumeralProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'font-display tabular-nums leading-none text-secondary/40 select-none',
        className,
      )}
    >
      {String(n).padStart(2, '0')}
    </span>
  );
}
