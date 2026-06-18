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
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-[1.5px] border ${
          light
            ? 'bg-white/10 border-white/20 text-white/80'
            : 'bg-secondary-50 border-secondary-200/70 text-secondary'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${light ? 'bg-white/60' : 'bg-secondary'}`} />
        {eyebrow}
      </span>
      <h2
        className={`mt-3 font-extrabold text-[26px] sm:text-[32px] lg:text-[38px] leading-tight lg:leading-11.5 lg:tracking-[-0.3px] ${
          light ? 'text-text-inverse' : 'text-text-base'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-[15px] lg:text-base leading-6.5 ${light ? 'text-text-inverse/80' : 'text-text-muted'}`}
          style={{ maxWidth }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
