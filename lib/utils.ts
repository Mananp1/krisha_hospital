import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge ships with Tailwind's stock scale and has no way to learn
 * about our custom `--text-*` type-scale tokens (globals.css) on its own. Left
 * unconfigured, it falls back to shape-matching `text-{word}` classNames and
 * puts every one of them — font-size or color — in the same conflict group.
 * That silently deleted real color classes: `cn("text-secondary-foreground",
 * "text-body")` merged down to just `text-body`, because tailwind-merge
 * treated our font-size token as a competing color and kept whichever
 * argument came last. Every shadcn Button/Badge that combined a
 * `variant`-supplied text color with one of these size tokens rendered with
 * no text color at all — the pink "Book Appointment" button in the hero was
 * one instance, inheriting near-black from an ancestor instead of showing the
 * white `text-secondary-foreground` the variant sets.
 *
 * Registering the token names under the built-in `font-size` group is the
 * fix: it tells tailwind-merge these compete with each other, not with color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display-lg",
        "text-display",
        "text-display-sm",
        "text-title",
        "text-lead",
        "text-body",
        "text-meta",
        "text-label",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
