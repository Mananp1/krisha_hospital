interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  note?: string;
}

export function StatsCard({ title, value, icon, note }: StatsCardProps) {
  return (
    <div className="bg-surface rounded-2xl border border-border-muted p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-semibold text-text-muted uppercase tracking-wide mb-0.5">
          {title}
        </p>
        <p className="text-[28px] font-bold text-text-base leading-none">{value}</p>
        {note && (
          <p className="text-[11px] text-text-muted mt-1">{note}</p>
        )}
      </div>
    </div>
  );
}