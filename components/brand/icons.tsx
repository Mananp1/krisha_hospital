/**
 * Custom medical glyphs, for the handful of services lucide has no honest
 * equivalent for. Everything else on the site uses lucide directly — see
 * docs/redesign-plan.md, B3.
 *
 * These deliberately mirror lucide's props and defaults (24px grid, 1.5
 * stroke, round caps and joins, `currentColor`) so the two sets are
 * interchangeable at a call site and read as one family. Forcing a generic
 * lucide icon onto "cervical cerclage" or "tuboplasty" would have made the
 * service grid less meaningful, not more consistent.
 */
import type { SVGProps } from 'react';

export interface BrandIconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  size?: number;
}

/** Shared frame — keeps every glyph on the same grid and stroke as lucide. */
function Glyph({
  size = 24,
  strokeWidth = 1.5,
  children,
  ...props
}: BrandIconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Pregnancy & maternity care — expectant figure. */
export function PregnancyIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="5" r="2.5" />
      <path d="M7 11c0 4.5 2.3 7.5 5 8.5 2.7-1 5-4 5-8.5" />
      <path d="M9.5 19.5l-1 2M14.5 19.5l1 2" />
    </Glyph>
  );
}

/** Antenatal & gynaecological sonography — scan trace on a screen. */
export function SonographyIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="m8 21 4-4 4 4" />
      <path d="M7 10.5c1.5-3 4.5-3 5 0s3.5 3 5 0" />
    </Glyph>
  );
}

/** Advanced laparoscopic & hysteroscopic surgery — instrument pair. */
export function LaparoscopyIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
      <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
      <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
      <path d="M14 14.5h2.5A3.5 3.5 0 0 0 20 11H4a3.5 3.5 0 0 0 3.5 3.5H10" />
    </Glyph>
  );
}

/** Tuboplasty & fertility procedures — restored tubal path. */
export function TuboplastyIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M6 15V9a6 6 0 0 1 6-6" />
      <path d="M18 9v6a6 6 0 0 1-6 6" />
    </Glyph>
  );
}

/** Cervical cerclage — supportive suture ring. */
export function CerclageIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </Glyph>
  );
}

/** Infertility treatment (IUI/IVF) — follicle and seed. */
export function FertilityIcon(props: BrandIconProps) {
  return (
    <Glyph {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 4V2M20 12h2M12 20v2M4 12H2" />
    </Glyph>
  );
}
