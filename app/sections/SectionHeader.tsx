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
      <p className={`text-[12px] font-bold uppercase tracking-[1.5px] ${light ? 'text-text-inverse/70' : 'text-secondary'}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-2.5 font-extrabold text-[26px] sm:text-[32px] lg:text-[38px] leading-tight lg:leading-[46px] ${light ? 'text-text-inverse' : 'text-text-base'}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-[15px] lg:text-base leading-[26px] ${light ? 'text-text-inverse/80' : 'text-text-muted'}`}
          style={{ maxWidth }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
