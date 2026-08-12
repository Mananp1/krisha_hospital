/** Small labelled block used inside the admin detail dialogs. */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1">
        {label}
      </p>
      {children}
    </div>
  );
}
