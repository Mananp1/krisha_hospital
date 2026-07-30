# Krisha Women's Hospital — Design & Architecture Audit + Redesign Plan

**Date:** 2026-07-30
**Scope:** Public marketing site (`app/[locale]/**`, `app/sections/**`, `app/globals.css`). The admin panel is
touched only where it shares the token layer.
**Status:** Plan awaiting approval. No redesign code written yet.

---

## Part 1 — Audit

### 1.1 The headline finding: the site is trilingual on paper only

The i18n stack is fully built and completely disconnected.

| Layer | State |
| --- | --- |
| `i18n/routing.ts`, `request.ts`, `navigation.ts` | ✅ correct |
| `next.config.ts` next-intl plugin | ✅ wired |
| `proxy.ts` locale middleware | ✅ wired |
| `messages/{en,hi,gu}.json` | ✅ **692 leaf strings each** — complete, professional, incl. per-service SEO metadata |
| Components calling `useTranslations` / `getTranslations` | ❌ **zero** |

Verified against production:

```text
GET /gu  → <html lang="en">  … <h1>Supporting every stage of…</h1>
GET /hi  → <html lang="en">  … <h1>Supporting every stage of…</h1>
```

Every section hardcodes English. `/hi` and `/gu` are reachable, indexed, and serve English under `lang="en"`.
That is ~1,400 translated strings of finished work sitting unused, plus an accessibility and SEO defect
(screen readers and search engines are told Gujarati pages are English).

**Why this dominates the redesign plan:** the redesign rewrites the JSX of every section. That is either the
moment translations get wired, or the moment they get buried under a second layer of hardcoded English. Doing it
later means editing all the same files twice.

Two related defects in the same area:

- **Locale-unaware navigation.** `NavBar.tsx:5`, `Footer.tsx:2`, `Hero.tsx:1` etc. import `Link` from
  `next/link` and `usePathname` from `next/navigation`, not the locale-aware versions exported by
  [i18n/navigation.ts](../i18n/navigation.ts). A visitor on `/gu` who clicks any link is silently dropped back
  to English.
- **No language switcher exists**, though `messages.langSwitcher` is fully translated and waiting.

### 1.2 Design-system findings

Every number below is measured from the current tree, not estimated.

| # | Finding | Evidence |
| --- | --- | --- |
| D1 | **No type scale.** Font sizes are set per-element in arbitrary pixels. | **390 occurrences** of `text-[Npx]` across **30 distinct values** — incl. `12px`/`12.5px`/`13px`/`13.5px` as four separate sizes |
| D2 | **No display typeface.** `--font-serif` is the unstyled `ui-serif, Georgia…` default and is never used. Every heading, number and label is Manrope. | [globals.css:97](../app/globals.css#L97) |
| D3 | **Radius tokens are defined then bypassed.** | `--radius-sm/md/lg/xl` exist; sections instead use **9 distinct ad-hoc values** (`6,8,10,12,14,18,20,22,28px`) plus **75× `rounded-full`**, 20 of them on buttons |
| D4 | **Shadows are ad-hoc.** 8 shadow tokens are defined, 6 of which are near-identical, and sections bypass them anyway. | **7 distinct arbitrary `shadow-[…]`** values |
| D5 | **One section rhythm, and it is too tight.** | Only 2 padding recipes site-wide (`py-14 lg:py-20`, `py-12 lg:py-20`) = **56 / 80px**. Target for a premium feel is 112–144px desktop |
| D6 | **No warm neutral exists in the palette.** Backgrounds alternate white ↔ `#f5f3fd` cool lavender. `--light-50: #fdfcff` and `--light-100: #fafaff` are also cool (blue-leaning). | [globals.css:73-84](../app/globals.css#L73-L84) |
| D7 | **Darkness is applied to cards, not bands.** All 13 service cards are `bg-primary` deep purple on white — 13 heavy blocks reading as noise — while section backgrounds stay light. | [Services.tsx:194](../app/sections/Services.tsx#L194) |
| D8 | **Two icon systems, ten stroke weights.** Originally counted as 32 across the 9 section files; the real public-tree total is **47** — the first pass used a shell glob that silently skipped `app/[locale]/**`, which holds 15 more. | **47 hand-rolled inline `<svg>`** blocks at weights `1.8, 2, 2.5, 4`; lucide icons at `1.5, 1.75, 1.8, 2, 2.25, 2.5` |
| D9 | **One header component drives six sections**, defaulting to centred. This *is* the "label → centred heading → paragraph → cards" pattern, encoded. | [SectionHeader.tsx:15](../app/sections/SectionHeader.tsx#L15) — `centered = true`; 6 consumers, only 3 override it |
| D10 | **Logo is raster-only** (358×184 PNG). It cannot be recoloured for dark surfaces, which is why the footer wraps it in a white rounded box. | [Footer.tsx:62](../app/sections/Footer.tsx#L62) |
| D11 | **Decorative blur blobs used as a substitute for composition.** 4 sections × 2 `blur-3xl` blobs. They add cost and haze, not hierarchy. | Hero, DoctorProfile, Testimonials, CTAStrip |
| D12 | **Container width spelled two ways across the two trees.** The public site uses `max-w-360` (=1440px) ×29; the admin panel uses `max-w-[1440px]` ×4 for the same value. Content width lands at 1240px, which is correct — but by accident, not by token. | — |

### 1.3 Architecture findings

| # | Finding | Detail |
| --- | --- | --- |
| A1 | **Service data exists in three places.** | `Services.tsx` holds its own 13-entry array with descriptions + inline SVGs (222 lines); [app/data/services.ts](../app/data/services.ts) holds name+slug; `messages.servicesData` holds translated names, copy and SEO metadata for all 13. Adding a service means editing three files. |
| A2 | **13 hand-written service page files** each import `ServicePageLayout` with a local data object. Correct layout reuse, but the content is one `[slug]` route's worth of data spread across 13 files. | [app/[locale]/services/](../app/[locale]/services/) |
| A3 | **Dead code.** | [app/theme.css](../app/theme.css) (56 lines) imported nowhere; `galleryImages` imported but unused in `HospitalGallery.tsx:5` (the one lint warning); 5 unused images in `public/` (`hero.jpg`, `hero-2.jpg`, `hospital1–3.jpg`, ~1.7 MB) |
| A4 | **Homepage carries commented-out sections** (`AppointmentForm`, `WhyChooseUs`, `HealthPackages`, `Blog`). | [page.tsx:31-36](../app/[locale]/page.tsx#L31-L36) |
| A5 | **Testimonials are truncated with no way to read them.** `line-clamp-5` on 700-character stories, no expansion affordance. The most persuasive content on the site is unreadable. | [Testimonials.tsx:80](../app/sections/Testimonials.tsx#L80) |
| A6 | **Homepage facility strip shows 3 same-size rectangles** because `galleryPreview` filters to landscape images only — while the `/gallery` page already has a proper asymmetric mosaic with `wide/tall/square/feature` tiles. The good layout exists and the homepage doesn't use it. | [gallery.ts:122](../app/data/gallery.ts#L122) vs [GalleryGrid.tsx:25](../app/sections/GalleryGrid.tsx#L25) |
| A7 | *(fixed 2026-07-30, commit `43eccce`)* Admin routes had no root layout after the i18n migration → all admin panels rendered unstyled in production. | — |

### 1.4 What is already good — keep it

Worth stating plainly, because a redesign should not regress these:

- **Accessibility discipline** in the interactive components: `HeroCarousel` respects `prefers-reduced-motion`,
  pauses on hover/focus, supports arrow keys and swipe, and labels every slide. `GalleryGrid`'s lightbox has
  `sr-only` title/description and keyboard nav. Focus-visible outlines are consistent.
- **Image pipeline is done properly** — originals normalised to a 2400px long edge, EXIF rotation baked in,
  `sizes` hints computed per tile, documented in [gallery.ts:1-10](../app/data/gallery.ts#L1-L10).
- **Security headers** configured in [next.config.ts](../next.config.ts).
- **The `/gallery` mosaic and the FAQ two-column layout** are already the kind of composition this redesign
  wants more of. FAQ also already uses `01`-style numerals — a brand device with a precedent to build on.

---

## Part 2 — Redesign plan

Sequenced so each phase is independently shippable and reviewable. Phase 1 must land before 3.

### Phase 0 — Decisions

| Decision | Outcome |
| --- | --- |
| **Wire i18n during the rebuild?** | ✅ **Decided 2026-07-30: yes.** Every section rebuilt in Phase 3 reads its copy from `useTranslations`, uses locale-aware `Link`/`usePathname` from [i18n/navigation.ts](../i18n/navigation.ts), and the root layout emits `<html lang={locale}>`. A section is not "done" until `/hi` and `/gu` render it in their own language. |
| Font pairing | ✅ **Fraunces + Manrope** (the other two options in the brief are not planned for). |
| Keep the cool lavender? | ⚠️ **Open — resolve during Phase 1.** See C3: a warm off-white page background next to `#f5f3fd` cool lavender reads muddy. Needs an on-screen call between warm-neutral-throughout and staying cool. |

**Consequences of the i18n decision, folded into the phases below:**

- Phase 3's definition of done per section gains: copy from `messages`, locale-aware links, verified on all
  three locales. Budget ~20% more per section.
- The language switcher moves from "nice to have" to **required** in the NavBar rebuild — `messages.langSwitcher`
  is already translated.
- PR 1 (Phase 5) carries the `<html lang={locale}>` fix on its own, ahead of everything else, so search engines
  stop indexing English under `/hi` and `/gu` while the rest of the work proceeds.
- Any string discovered in a component but missing from `messages/*.json` must be added to **all three**
  catalogues in the same PR — they are currently in exact parity at 692 leaf strings each, and that parity is
  the only guard against drift.

### Phase 1 — Foundation: tokens

All in [app/globals.css](../app/globals.css). No visual redesign yet — this phase makes the redesign expressible.

**T1 — Type scale.** Define a named scale and delete arbitrary sizes as sections are rebuilt.

```css
--text-display-lg: 3.25rem;  /* 52px — hero h1 */
--text-display:    2.5rem;   /* 40px — section h2 */
--text-display-sm: 1.75rem;  /* 28px — card h3, stat numbers */
--text-lead:       1.125rem;  /* 18px */
--text-body:       1rem;      /* 16px */
--text-sm:         0.875rem;  /* 14px */
--text-xs:         0.8125rem; /* 13px */
--text-label:      0.75rem;   /* 12px — eyebrows, uppercase */
```

Collapses 30 values → 8. The 12/12.5/13/13.5px cluster becomes two sizes.

**T2 — Two font families, script-aware.**

```css
--font-display: var(--font-fraunces), Georgia, serif;
--font-body:    var(--font-manrope), var(--font-noto-script), ui-sans-serif, sans-serif;
```

⚠️ **Fraunces has no Devanagari or Gujarati coverage, and neither does Manrope.** A single global stack is
therefore wrong. Load per locale in the root layout, so `/gu` does not pay for Devanagari and vice versa:

| Locale | Display | Body |
| --- | --- | --- |
| `en` | Fraunces | Manrope |
| `hi` | Noto Serif Devanagari | Manrope → Noto Sans Devanagari |
| `gu` | Noto Serif Gujarati | Manrope → Noto Sans Gujarati |

CSS font fallback resolves per glyph, so Latin text inside Gujarati copy still renders in Manrope. Subsets:
`devanagari` / `gujarati` respectively. Per your note — **no decorative Latin serif is forced onto Indic text.**

Fraunces usage is restricted to: hero h1, section h2, stat numerals, and the testimonial quote mark. Everything
else — nav, buttons, service names, credentials, forms, body — stays Manrope.

**T3 — Radius system.** Replace the derived `calc()` chain with explicit values.

**Revised after review — the first ladder was too soft.** 6/10/12/16 still read as a generic rounded-card
template. Halved:

```css
--radius-sm:   4px;   /* inputs, tags, small controls */
--radius-md:   6px;   /* buttons, cards, FAQ rows */
--radius-lg:   8px;   /* larger cards, panels */
--radius-xl:   10px;  /* image panels, doctor portrait */
--radius-pill: 999px; /* badges only */
```

Five steps rather than four, because shadcn's primitives already consume `sm/md/lg/xl` and a four-step set
would have made `lg` larger than `xl`.

⚠️ **The lesson from the first attempt: tightening the tokens changed almost nothing on screen**, because 31
ad-hoc `rounded-[Npx]` values (18px on cards, 20–28px on photos) were still hardcoded in the sections and
bypassed the ladder entirely. Deferring those to the section rebuilds was the wrong call. All 31 are now swept
onto tokens, plus 13 `rounded-2xl`, so cards went 18px → 8px and hero photography 28px → 10px.

Softness now lives **only** in the photography, via the `arch` device — which is what makes "sharper components,
softly rounded pictures" legible as an intent rather than uniform roundness everywhere.

`rounded-full` survives on true circles (avatars, dots, icon buttons) and badges. It is gone from every button:
the first pass matched `rounded-full px-` and missed four buttons that use `rounded-full py-`. Decorative
floating circles behind both doctor portraits are deleted.

⚠️ **The token layer is shared with the admin panel** — `app/admin/**` uses `rounded-xl` ×26, `rounded-md` ×22,
`rounded-lg` ×22 and `rounded-sm` ×7 via shadcn primitives. The new ladder moves `md` 8→10, `lg` 10→12 and
`xl` 14→16, leaving `sm` at 6: a uniform +2px on three steps. Verified as a subtle, consistent shift rather
than a regression. `rounded-2xl` / `rounded-full` / `rounded-none` are Tailwind defaults and are untouched.

**T4 — Spacing scale.**

```css
--section-y:      7rem;    /* 112px desktop default */
--section-y-lg:   9rem;    /* 144px — hero, doctor, final CTA */
--section-y-sm:   4.5rem;  /* 72px mobile */
--measure-page:   78rem;   /* 1248px container */
--measure-prose:  40rem;   /* 640px body text */
--gap-title-desc: 1.375rem;
--gap-desc-body:  3.5rem;
--pad-card:       2rem;
```

Not every section gets `--section-y`: hero, doctor and final CTA take `--section-y-lg`.

**T5 — Colour distribution. 60 / 30 / 10, existing palette only.**

**Revised after review.** The warm off-white is dropped — it was a fourth hue the brand does not own, and it
muddied against the cool lavender. **C3 resolved: the ground stays cool**, so the whole page sits on one neutral
family.

| Share | Colour | Where |
| --- | --- | --- |
| **60** | white + `--surface-subtle` lavender tint | every content section |
| **30** | `--primary` family | full-bleed bands, footer, and the icons and headings carrying brand weight |
| **10** | `--secondary` magenta | CTAs and small highlights, nothing more |

What was actually wrong was not the palette but its distribution:

- **13 service cards were filled plum** — the brand colour spent as noise. Now white cards with a plum icon well
  and heading, so plum arrives as a few large blocks instead of 13 competing ones.
- **The final CTA was a magenta gradient** — a large field of the 10% accent, which is what made the whole site
  read pink-dominant. Now solid plum, square, full-bleed, with magenta surviving as the one button.
- **The stats band was a plum gradient** → flat `--primary-900`.
- **Ten decorative blur blobs** across five sections are deleted; they hazed the colour story and were standing
  in for composition.

Plum now appears as exactly four full-bleed blocks — top bar, stats band, final CTA, footer — and nowhere as a
card fill. The only gradients left in the public tree are the ten `bg-linear-to-t` scrims that keep captions
legible over photography, which are functional rather than decorative.

**T6 — Shadow reduction.** Collapse 8 near-identical tokens to 3 (`xs` hairline, `md` card lift, `lg` floating
panel). Delete the 7 arbitrary `shadow-[…]` values.

### Phase 2 — Brand language (pick two, not seven)

The logo already decides this. It contains an **arched tagline curving over a single-weight line-art
mother-and-child**, plus a ♀ mark. So:

**B1 — The arch.** A dome-topped mask (`border-radius: 50% 50% var(--radius-lg) var(--radius-lg) / 30% 30% …`,
or an SVG clip-path) applied to *photography only* — hero secondary image, doctor portrait, gallery feature
tile. This is the motherhood reference you asked for, it is already in the logo, and it satisfies "sharper
components + softly rounded photography."

**B2 — Fraunces section numerals.** `01 / 02 / 03` set in Fraunces at low opacity beside section headings.
Already prototyped in [FAQ.tsx:83](../app/sections/FAQ.tsx#L83) — promote it to a shared component.

Explicitly **not** doing: petal outlines, branded patterns, curved connector lines, floating shapes. Two devices
is the brief.

**B3 — Icon unification** (supporting, not a third device). Standardise on lucide at a single hairline stroke to
echo the logo's line art. All 47 hand-rolled SVGs converted: 41 map onto lucide exactly, and 6 semantically
specific ones — pregnancy, sonography, laparoscopy, fertility, tuboplasty, cerclage — live on in
[components/brand/icons.tsx](../components/brand/icons.tsx), redrawn on lucide's 24px grid at the same 1.5 so
the two sets read as one family. Forcing a generic lucide glyph onto "cervical cerclage" would have made the
service grid less meaningful, not more consistent.

Stroke weight is set **once**, in CSS: lucide emits `stroke-width` as a presentation attribute, which any CSS
declaration outranks, so a single `.lucide { stroke-width: 1.5 }` rule normalises every icon and let all 15
per-call-site `strokeWidth` props be deleted. This also standardises the admin panel's icons, which previously
ran 1.5–2.5.

**B4 — Ship an SVG logo.** Unblocks a white/plum monochrome variant and removes the footer white-box hack (D10).
*Requires the original vector artwork — asset dependency, not a code task.*

### Phase 3 — Section rebuilds

Same section order. Each row gets a distinct composition, and **no two adjacent sections share a treatment**.

**Done: hero + stats (PR 4), services + doctor (PR 5).** Translated headings now render on `/gu` for the first
four sections; gallery, testimonials and FAQ still show English and land in PR 6. These set the pattern:

- `NextIntlClientProvider` is now in the root layout, rendered from a Server Component so locale, messages,
  formats and timeZone are all inherited from `i18n/request.ts` — client sections call `useTranslations` with
  nothing passed to them.
- **`/hi` and `/gu` serve real translations for the first time.** Verified in the prerendered HTML.
- New copy goes into all three catalogues in the same commit. `hero.trust` added; parity holds at **695 leaf
  strings each**, guarded by a key-shape check.
- The hero CTA uses the locale-aware `Link` from `i18n/navigation`, so on `/gu` it resolves to `/gu#services`.
  `NavBar` and `Footer` still use plain `next/link` and are fixed in PR 6.
- `HeroCarousel.tsx` and `heroSlides` are deleted, not just unused — recoverable from git if ever wanted.

| # | Section | Now | Redesign | Bg | Align |
| --- | --- | --- | --- | --- | --- |
| 1 | TopBar | plum strip | keep; drop stale "8 March" badge | plum | — |
| 2 | NavBar | white sticky, 5 equal links | de-emphasise links, one strong CTA, **add lang switcher** | white | — |
| 3 | **Hero** | centred-ish split, 4-image carousel, 2 blobs | **asymmetric split.** L: h1 + lead + 2 CTAs. R: one dominant image, arch-masked secondary overlapping it, one floating trust panel (20+ yrs · 24×7 · 4.9★). Retire the carousel — one visual idea. | `--surface-page` | left |
| 4 | **Stats** | 5 icon cards, gradient, count-up | **full-bleed plum band, no cards.** Fraunces numerals, thin vertical rules, no icons, pink labels | **dark** | centred numerals |
| 5 | **Services** | 13 identical plum cards | **hierarchy** — see Phase 4 | white | left header |
| 6 | **Doctor** | split + blobs + 4 credential boxes | **editorial feature.** Large arch-masked portrait, credentials as one structured row (not 4 boxes), expertise as tags, consultation panel, Gujarati-service line promoted to a real benefit | `--surface-page` | left |
| 7 | **Facility** | 3 equal rectangles | **asymmetric: 1 large + 2 stacked small**, reusing the existing `tile` data (A6). Persistent labels, not hover-only | white | full-bleed |
| 8 | **Testimonials** | 3 long reviews, `line-clamp-5`, unreadable | **one featured story**, large Fraunces quote mark, prev/next, "Read full story" expansion (fixes A5), rating shown separately | lavender tint | horizontal |
| 9 | **FAQ** | already 2-col — closest to target | keep structure; horizontal borders instead of cards/shadows | white | left/right |
| 10 | **Final CTA** | pink gradient + 2 blobs | **solid plum, full-bleed, square.** Retire the gradient — the one permitted gradient goes in the hero | **dark** | centred |
| 11 | Footer | dark, 5 cols, contact items in boxes | keep structure, remove boxes/radius, more air | dark | — |

Cross-cutting in this phase:

- `SectionHeader` default flips to `centered = false`; centred becomes the deliberate exception (D9).
- Delete all 8 decorative blur blobs (D11).
- Each rebuilt section reads copy from `useTranslations` (Phase 0 decision) and uses locale-aware `Link`.
- Root layout emits `<html lang={locale}>` — fixes the `lang="en"` defect.

### Phase 4 — Service hierarchy — **done (PR 5)**

**Single source of truth.** [app/data/services.ts](../app/data/services.ts) now carries `slug`, `featured`,
`group` and `Icon` — structure only. Copy comes from `messages.servicesSection.cards[slug]`, so all thirteen
services exist once per locale instead of once per component. A1's three parallel lists are gone: the 13-entry
array with its own descriptions and inline SVGs is deleted from `Services.tsx`, and `NavBar` and `Footer` read
their names from the catalogue too — which also removes the last hardcoded English service names from the
chrome.

Shipped layout: five featured cards where **the first spans two columns**, so five fill two rows of three
exactly (2+1, then 1+1+1). The remaining eight sit in a four-column grid grouped by care pathway. Verified: 5
featured anchors, 8 compact items, **all 13 slugs still linked** — hierarchy changed, nothing hidden.

**No imagery on the featured cards.** The photo library is facility shots; captioning a waiting room as
"Pregnancy & Maternity Care" would be misleading. Strong icons carry them instead. Revisit if service-specific
photography is ever shot.

**Featured five** — large bento cards with imagery or strong icons:
`pregnancy-maternity-care` · `high-risk-pregnancy` · `infertility-treatment` ·
`antenatal-gynecological-sonography` · `laparoscopic-hysteroscopic-surgery`

**Remaining eight** — compact secondary grid, grouped:

| Group | Services |
| --- | --- |
| Pregnancy & Delivery | painless-vaginal-delivery, cervical-cerclage |
| Fertility | tuboplasty-fertility-procedures, preconception-counseling |
| Gynaecology | adolescent-gynecology |
| Preventive & Life-Stage Care | cervical-cancer-screening, family-planning-contraceptive-counseling, menopause-consultation |

Content unchanged; all 13 remain linked. Only hierarchy changes.

*Optional follow-up (not in this plan):* collapse the 13 hand-written service pages into one `[slug]` route
reading `messages.servicesData` (A2). Worth doing, but it is a routing refactor, not a redesign.

### Phase 5 — Cleanup

Delete `app/theme.css`, the 5 unused `public/` images (~1.7 MB), the unused `galleryImages` import (clears the
one lint warning), and the commented-out section block in `page.tsx`. Resolve the uncommitted `gsap` dependency
— nothing imports it; either use it or drop it.

---

## Out of scope — but it caps the result

**Photography remediation.** Per your point 11, and I agree: layout cannot compensate for the source files. The
originals need brightness/white-balance correction, straightened verticals, consistent grading, and crops that
favour the strongest detail. The pipeline in [gallery.ts](../app/data/gallery.ts) is already set up to accept
re-exported files at the same paths, so this can happen in parallel with any phase and needs **no code change**.

The hero and facility sections are the two places where image quality is load-bearing. If only a few frames get
reworked, do `reception-waiting-lounge` and `operation-theatre` first.

## Risks

| Risk | Mitigation |
| --- | --- |
| Phase 1 tokens are shared with `/admin` (T3) | Smoke-test all 6 admin routes before merging Phase 1 |
| Warm neutral + existing cool lavender read muddy (C3) | Decide one neutral family in Phase 1; calibrate on screen |
| Fraunces/Manrope have no Indic coverage (T2) | Per-locale font stacks; never force the Latin serif onto hi/gu |
| Two new font families hurt LCP | Fraunces headings-only + `display: swap`; per-locale loading means no locale ships all six faces |
| Retiring the hero carousel loses 3 images | They remain on `/gallery`; the hero trades breadth for one clear idea |
| Rebuilding 11 sections at once is unreviewable | One PR per phase; Phase 3 split into 3–4 PRs by section group |

## Verification per phase

- `npx next build` clean; `npx eslint` no new warnings
- No `text-[Npx]`, `rounded-[Npx]`, or `shadow-[…]` introduced in rebuilt files (grep gate)
- `/en`, `/hi`, `/gu` each render their own language with a correct `<html lang>`
- All 6 `/admin` routes still styled
- Mobile 375px / tablet 768px / desktop 1440px on every rebuilt section
- Keyboard traversal and visible focus preserved on carousel, lightbox, accordion, nav drawer

## Suggested delivery

| PR | Contents | Rough size |
| --- | --- | --- |
| 1 | Phase 5 cleanup + `<html lang>` fix | small |
| 2 | Phase 1 tokens (T1–T6) | medium |
| 3 | Phase 2 brand devices + icon unification | medium |
| 4 | Phase 3 — hero, stats | large |
| 5 | Phase 4 + Phase 3 services, doctor | large |
| 6 | Phase 3 — facility, testimonials, FAQ, CTA, footer, nav | large |

PR 1 first: it is low-risk, and shipping the `lang` fix early stops search engines indexing more English under
`/hi` and `/gu`.
