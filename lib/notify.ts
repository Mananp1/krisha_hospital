'use client';

import { toast } from 'sonner';

/**
 * Surfaces a failed admin action.
 *
 * These messages are sentences, not labels — "This patient already has an
 * appointment in that slot. Pick another time, or cancel the existing one." —
 * so rendering them inline pushed table cells and dialog layouts out of shape,
 * and the worst offenders appeared in the tightest space. A toast carries the
 * same text without owning any layout, and it reads the same wherever the
 * action was fired from.
 *
 * Field-level validation stays inline: it belongs next to the input it is
 * about, it is short, and it has room reserved for it in the form already.
 */
export function notifyError(err: unknown, fallback: string) {
  toast.error(err instanceof Error ? err.message : fallback);
}
