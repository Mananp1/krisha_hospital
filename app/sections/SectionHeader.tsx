interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: number;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  maxWidth = 560,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'flex flex-col items-center text-center' : 'flex flex-col items-start'}>
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-label uppercase border ${
          light
            ? 'bg-white/10 border-white/20 text-white/80'
            : 'bg-secondary-50 border-secondary-200/70 text-secondary'
        }`}
      >
        {eyebrow}
      </span>
      {/* The display face earns its keep here and on the hero — not in UI chrome. */}
      <h2
        className={`mt-3 font-display text-display ${
          light ? 'text-text-inverse' : 'text-text-base'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 text-body ${light ? 'text-text-inverse/80' : 'text-text-muted'}`}
          style={{ maxWidth }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
