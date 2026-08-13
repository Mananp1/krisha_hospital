import { cn } from '@/lib/utils';

/**
 * Small labelled block used inside the admin detail dialogs.
 *
 * `className` is how a field opts into being the one that flexes and scrolls —
 * it has to carry `min-h-0` for a scrolling child to be constrained rather than
 * pushing the dialog taller.
 */
export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={cn(
        'text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1',
      )}>
        {label}
      </p>
      {children}
    </div>
  );
}
