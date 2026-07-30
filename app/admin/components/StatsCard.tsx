import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  note?: string;
  zeroNote?: string;
  href?: string;
  hrefLabel?: string;
}

export function StatsCard({ title, value, icon, note, zeroNote, href, hrefLabel }: StatsCardProps) {
  const showZeroNote = value === 0 && zeroNote;

  return (
    <div className="bg-surface rounded-lg border border-border-muted p-4 flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">
          {title}
        </p>
        <p className="text-[26px] font-bold text-text-base leading-none">{value}</p>
        {showZeroNote ? (
          <p className="text-[11px] text-text-muted mt-1">{zeroNote}</p>
        ) : note ? (
          <p className="text-[11px] text-text-muted mt-1">{note}</p>
        ) : null}
        {href && value > 0 && (
          <Link
            href={href}
            className="text-[11px] font-semibold text-primary hover:opacity-70 transition-opacity mt-1.5 block"
          >
            {hrefLabel ?? 'View →'}
          </Link>
        )}
      </div>
    </div>
  );
}