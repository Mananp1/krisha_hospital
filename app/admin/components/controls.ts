/**
 * Shared control styling for the admin panel — the same consolidation `Pill`
 * did for chips, applied to inputs and buttons.
 *
 * The identical `inputClass` string had been copied into four files and the
 * dialog button classes into eight, so they had drifted: three radii and two
 * heights across controls that sit on the same row.
 *
 * Two things are deliberately aligned with `components/ui/select.tsx` rather
 * than with what was here before, because a `SelectTrigger` sits directly
 * beside these in the appointments filter bar:
 *
 * * **`h-9`** — the hand-rolled inputs were `py-2` (~34px) against the Select's
 *   36px, so the filter row was a couple of pixels out of true at every field.
 * * **`rounded-md`** — they were `rounded-xl` (10px) against the Select's 6px.
 *
 * The focus treatment is not a port of the old one. Every admin input carried
 * `focus:outline-none` with nothing but a faint border change to replace it,
 * which leaves a keyboard user with almost no idea where they are. These
 * restore a real ring.
 */

/** Text and date inputs. Pair with `w-full` at the call site if needed. */
export const inputClass =
  'h-9 w-full px-3 text-[13px] bg-surface border border-border-muted rounded-md ' +
  'text-text-base placeholder:text-text-muted transition-[color,box-shadow] ' +
  'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20';

/** Same, minus the fixed height — a textarea is sized by its `rows`. */
export const textareaClass =
  'w-full px-3 py-2 text-[13px] bg-surface border border-border-muted rounded-md ' +
  'text-text-base placeholder:text-text-muted transition-[color,box-shadow] ' +
  'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20';

const buttonBase =
  'inline-flex items-center justify-center gap-1.5 rounded-md py-2.5 px-4 text-[13px] font-semibold ' +
  'transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30 ' +
  'disabled:opacity-60 disabled:pointer-events-none';

export const btnPrimary = `${buttonBase} bg-primary text-white hover:opacity-90`;
export const btnOutline = `${buttonBase} border border-border-muted text-text-base hover:bg-surface-subtle`;

/**
 * Rose rather than the red-300/red-700 this used to be, so destructive controls
 * and the `danger` pill tone are the same red.
 */
export const btnDanger =
  `${buttonBase} border border-rose-300 text-rose-700 hover:bg-rose-50 focus-visible:ring-rose-300/40`;

/** The small square buttons in table rows. */
export const iconButton =
  'w-7 h-7 inline-flex items-center justify-center rounded-md bg-surface-subtle text-text-muted ' +
  'border border-border-muted transition-colors cursor-pointer hover:text-primary hover:border-primary/40 ' +
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/30';

/**
 * The admin sidebar is dark on purpose: the panel is otherwise white on white,
 * so nothing separated the navigation from the page it was navigating. A dark
 * rail gives the working area an edge to sit against.
 *
 * Shared by the desktop `AdminNav` and the mobile `MobileNav` sheet, which are
 * two renderings of the same navigation and must not drift apart.
 *
 * The colours are literals rather than theme tokens because this project has no
 * dark palette — `bg-surface` and friends are all light. Inventing a half dark
 * theme to serve one component would be worse than naming the four values here.
 */
export const NAV = {
  /** Near-black with a violet cast, so it belongs to the brand rather than reading as grey. */
  shell: 'bg-[#14121c] text-slate-300',
  /** Hairlines on dark have to be light-on-dark, not the light theme's border token. */
  divider: 'border-white/10',
  item: 'text-slate-400 hover:bg-white/5 hover:text-white',
  /** Solid brand fill: the strongest available signal against this background. */
  itemActive: 'bg-primary text-white',
  signOut: 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-300',
  /**
   * The logo is dark ink on transparency — 86% of its visible pixels are dark —
   * so it all but disappears on this background. Flattening it to white keeps it
   * legible; a light-on-dark logo asset would be better if one exists.
   */
  logo: 'brightness-0 invert',
} as const;

export const iconButtonDanger =
  'w-7 h-7 inline-flex items-center justify-center rounded-md bg-rose-50 text-rose-700 ' +
  'transition-colors cursor-pointer hover:bg-rose-100 ' +
  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-rose-300/40';
