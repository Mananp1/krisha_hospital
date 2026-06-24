'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PAGE_SIZE_OPTIONS } from '@/lib/pagination';

interface TablePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: readonly number[];
}

function pageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  // Near start: show first 5 pages + ellipsis + last
  if (current <= 4) {
    const end = Math.max(5, current + 1);
    const result: (number | 'ellipsis')[] = Array.from({ length: end }, (_, i) => i + 1);
    if (end < total - 1) result.push('ellipsis');
    if (end < total) result.push(total);
    return result;
  }

  // Near end: show first + ellipsis + last 5 pages
  if (current >= total - 3) {
    const start = Math.min(total - 4, current - 1);
    const result: (number | 'ellipsis')[] = [1];
    if (start > 2) result.push('ellipsis');
    for (let i = start; i <= total; i++) result.push(i);
    return result;
  }

  // Middle: first + ellipsis + (current-1, current, current+1) + ellipsis + last
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

export function TablePagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: TablePaginationProps) {
  if (total === 0) return null;

  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pages = pageNumbers(page, totalPages);

  return (
    <div className="px-5 py-3.5 border-t border-border-muted flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface">
      {/* Left: count + page size picker */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] text-text-muted">
          {start}–{end} of {total}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="h-7 rounded-lg border border-border-muted bg-surface px-2 text-[12px] text-text-base cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </select>
      </div>

      {/* Right: page buttons */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-muted text-text-muted hover:bg-surface-subtle disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon size={13} />
          </button>

          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${i}`}
                className="w-7 h-7 flex items-center justify-center text-[12px] text-text-muted select-none"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={cn(
                  'w-7 h-7 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors',
                  p === page
                    ? 'bg-primary text-white'
                    : 'border border-border-muted text-text-muted hover:bg-surface-subtle',
                )}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-muted text-text-muted hover:bg-surface-subtle disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
