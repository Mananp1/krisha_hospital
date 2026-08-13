import { cn } from '@/lib/utils';

/**
 * The one chip in the admin panel.
 *
 * Six different hand-rolled versions had drifted apart — `rounded-full` against
 * `rounded-md`, `py-0.5` against `py-1`, some with a border and some without —
 * so two chips sitting next to each other in the same table cell were visibly
 * different heights. Everything status-shaped now goes through here.
 *
 * Geometry notes, since they are what make it read as considered rather than
 * decorative:
 *
 * * **Fixed height.** A chip with an icon and one without must line up, so the
 *   height is set rather than left to padding and line-height.
 * * **`ring-inset`, not `border`.** A border adds a pixel to the outside of the
 *   box, so bordered and unbordered chips of the same nominal size end up
 *   different sizes and sit off the text baseline. An inset ring paints inside
 *   the box and leaves the geometry alone.
 * * **`rounded-md`, not `rounded-full`.** At this size a fully round chip reads
 *   as a tag or a toy; a 6px radius reads as a data field.
 * * **`tabular-nums`.** These chips carry counts that sit in a column, and
 *   proportional digits make them jitter.
 */
export type PillTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

/** Shared with `CheckInToggle`, which is the same chip rendered as a button. */
export const PILL_BASE =
  'inline-flex items-center justify-center gap-1 h-[22px] rounded-md px-2 ' +
  'text-[11px] font-semibold leading-none whitespace-nowrap tabular-nums ring-1 ring-inset';

/**
 * Tones are semantic, not decorative: `danger` is reserved for the states that
 * need somebody to act (a no-show to call back), which is why a cancelled
 * booking — settled, nothing to do — is `neutral` rather than red.
 *
 * Every pairing clears 4.5:1 at this size; the darker text shades are
 * deliberate, since 11px is below the large-text threshold.
 */
export const PILL_TONES: Record<PillTone, string> = {
  neutral: 'bg-slate-50   text-slate-600   ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50   text-amber-800   ring-amber-200',
  danger:  'bg-rose-50    text-rose-700    ring-rose-200',
  info:    'bg-sky-50     text-sky-700     ring-sky-200',
  accent:  'bg-primary-50 text-primary     ring-primary/20',
};

export function Pill({
  tone = 'neutral',
  className,
  children,
  ...props
}: React.ComponentProps<'span'> & { tone?: PillTone }) {
  return (
    <span className={cn(PILL_BASE, PILL_TONES[tone], className)} {...props}>
      {children}
    </span>
  );
}

/**
 * A count with a colour-coded dot — for rows of several figures, where a row of
 * filled chips would be louder than the data it carries. The meaning lives in
 * the tooltip, so the cell stays narrow enough for a table.
 */
export function CountDot({
  value,
  label,
  className,
}: {
  value: number;
  /** Read out on hover — "3 confirmed". */
  label: string;
  /** Dot colour, e.g. `bg-emerald-500`. */
  className: string;
}) {
  return (
    <span
      title={`${value} ${label}`}
      className="inline-flex items-center gap-1 text-[12px] tabular-nums text-text-muted"
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', className)} aria-hidden="true" />
      <span className="font-semibold text-text-base">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
