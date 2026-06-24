export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;
export type PageSize = typeof PAGE_SIZE_OPTIONS[number];
export const DEFAULT_PAGE_SIZE: PageSize = 20;

export function parsePageSize(raw: string | null | undefined): PageSize {
  const n = Number.parseInt(raw ?? String(DEFAULT_PAGE_SIZE), 10);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(n)
    ? (n as PageSize)
    : DEFAULT_PAGE_SIZE;
}

export function parsePage(raw: string | null | undefined): number {
  return Math.max(1, Number.parseInt(raw ?? '1', 10) || 1);
}
