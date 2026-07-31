import BrandLoader from '@/components/brand/BrandLoader';

/**
 * Deliberately per-segment rather than one `loading.tsx` at `[locale]`.
 *
 * A loading file creates a Suspense boundary, and Next flushes that shell —
 * committing an HTTP 200 — before the page inside it finishes. Placed at
 * `[locale]` it also wrapped the `[...rest]` catch-all, so the 404 page
 * rendered but the response was already committed as 200: a soft 404 that
 * search engines would happily index as a real page. Sitting one level
 * down, the boundary covers this route and leaves the catch-all alone.
 */
export default function Loading() {
  return <BrandLoader label="Loading page" />;
}
