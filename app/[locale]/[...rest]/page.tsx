import { notFound } from 'next/navigation';

/**
 * Makes `not-found.tsx` reachable. Without this the branded 404 never
 * rendered, which is why the site looked like it had no 404 page at all.
 *
 * The proxy rewrites an unmatched path like `/nonsense` to `/en/nonsense`.
 * Nothing under `[locale]` matched that, so no route matched at all — and
 * with no route matched there is no segment for Next to resolve a
 * `not-found` boundary against, so it fell through to its own built-in
 * black-and-white 404 instead of `app/[locale]/not-found.tsx`.
 *
 * This catch-all gives those paths a route to land on. Calling `notFound()`
 * from inside the locale segment resolves to the sibling `not-found.tsx`,
 * so the 404 renders with the site's own chrome and the right locale.
 */
export default function CatchAllNotFound() {
  notFound();
}
