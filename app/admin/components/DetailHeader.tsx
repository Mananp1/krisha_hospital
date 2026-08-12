import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';

interface DetailHeaderProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle?: string;
  /** Status badge, action buttons — anything right-aligned on the header row. */
  actions?: React.ReactNode;
}

/** Shared header for the admin detail screens, so they read as one family. */
export function DetailHeader({
  backHref, backLabel, title, subtitle, actions,
}: DetailHeaderProps) {
  return (
    <div className="mb-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-primary transition-colors mb-3"
      >
        <ChevronLeftIcon size={15} />
        {backLabel}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-bold text-text-base break-words">{title}</h1>
          {subtitle && (
            <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

interface DetailCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailCard({ title, children, className }: DetailCardProps) {
  return (
    <section
      className={`bg-surface rounded-lg border border-border-muted p-5 lg:p-6 ${className ?? ''}`}
    >
      {title && (
        <h2 className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-3">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className="text-[14px] text-text-base">{children}</div>
    </div>
  );
}
