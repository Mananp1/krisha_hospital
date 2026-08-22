/**
 * A small in-process throttle for the public form endpoints.
 *
 * ## What this is not
 *
 * State lives in the memory of one server instance. Serverless deployments run
 * several instances and recycle them freely, so a determined flood spread
 * across instances will get through, and the counters reset on every cold
 * start. This is a speed bump against naive scripted abuse, not a security
 * control.
 *
 * It earns its place because the public forms now trigger outbound email:
 * unthrottled, one loop could fill the clinic's inbox and burn the Resend
 * quota. Stopping the obvious version of that is worth ~40 lines.
 *
 * The durable fix is a counter in Postgres keyed by IP and window, which every
 * instance would share. That needs a migration applied by hand like the rest of
 * `docs/`, so it is deliberately left for later.
 */

/** Hit timestamps (ms) per key, oldest first. */
const hits = new Map<string, number[]>();

/**
 * Above this many tracked keys, expired entries are swept before the next
 * check. Sweeping on every call would be wasted work at low traffic; never
 * sweeping would let the map grow without bound.
 */
const SWEEP_THRESHOLD = 1_000;

function sweep(now: number, windowMs: number): void {
  for (const [key, timestamps] of hits) {
    const live = timestamps.filter((t) => now - t < windowMs);
    if (live.length === 0) {
      hits.delete(key);
    } else {
      hits.set(key, live);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** How long until the caller may retry, in whole seconds. 0 when allowed. */
  retryAfterSeconds: number;
}

/**
 * Records an attempt against `key` and reports whether it is permitted.
 *
 * Callers should namespace the key by action as well as caller —
 * `appointment:1.2.3.4` — so booking and contact traffic get separate budgets
 * and a burst of one does not lock out the other.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  if (hits.size > SWEEP_THRESHOLD) sweep(now, windowMs);

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const oldest = recent[0];
    hits.set(key, recent);

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  return { allowed: true, retryAfterSeconds: 0 };
}
