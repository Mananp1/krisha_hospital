/**
 * Splash timing. Lives here rather than in SplashScreen because the entry
 * animations have to agree with it, and two hand-tuned numbers in two files
 * do not stay in agreement.
 *
 * They already drifted: the splash was retuned twice while `routeEntryDelay`
 * stayed at a fixed 0.78s, so entry animations were starting 780ms in, when
 * the splash had been fading for only 80ms of its 350ms and was still ~77%
 * opaque. The animations ran — mostly behind an opaque overlay.
 */
const SPLASH_HOLD_MS = 700;
const SPLASH_FADE_MS = 350;

export const splash = {
  holdMs: SPLASH_HOLD_MS,
  fadeMs: SPLASH_FADE_MS,
} as const;

export const motion = {
  duration: {
    fast: 0.24,
    base: 0.56,
    slow: 0.9,
    image: 1.05,
  },
  ease: {
    enter: 'power3.out',
    standard: 'power2.out',
    exit: 'power2.inOut',
  },
  distance: {
    mobile: 16,
    desktop: 24,
  },
  stagger: {
    tight: 0.055,
    base: 0.085,
  },
  triggerStart: 'top 86%',

  /**
   * Hover intent, in milliseconds — a pause before a hover commits either
   * way. These cards sit flush in a grid, so a pointer crossing to somewhere
   * else sweeps through several of them; without a wait, each one pops and
   * unpops in passing. Waiting means a card only reacts to a pointer that
   * stopped on it.
   *
   * Opening waits longer than closing: a card that is slow to let go feels
   * stuck, while a card that is slightly slow to react feels considered.
   */
  hoverDelayMs: {
    open: 90,
    close: 60,
  },

  /**
   * Two-stage background fill, in seconds. The card moves before it changes
   * colour — `offset` is how long the fill waits after the scale begins, so
   * the two read as one gesture with an order to it rather than as
   * everything firing at once.
   *
   * `rise` runs to a lighter purple and `settle` carries it the rest of the
   * way, which is why this is a timeline and not a CSS transition: a
   * transition can only interpolate between two colours, so the fill either
   * arrives at full strength immediately or takes the whole duration to get
   * there. Landing on the pale stage first makes the colour look like it is
   * filling in.
   */
  hoverFill: {
    offset: 0.08,
    rise: 0.07,
    settle: 0.1,
    reset: 0.18,
  },

  /**
   * How long above-the-fold entry animations wait for the splash to clear.
   *
   * Derived, not typed in: retuning the splash now moves this with it. Set
   * at 60% through the fade rather than the very end — by then the overlay
   * is mostly transparent, so the reveal reads as one continuous motion
   * with the splash clearing instead of starting after a dead beat.
   */
  routeEntryDelay: (SPLASH_HOLD_MS + SPLASH_FADE_MS * 0.6) / 1000,
} as const;
