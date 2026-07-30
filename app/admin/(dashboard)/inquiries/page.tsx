import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { InquiryTable } from '@/app/admin/components/InquiryTable';
import { parsePageSize, parsePage } from '@/lib/pagination';
import type { ContactInquiry } from '@/types/database';

export const metadata: Metadata = { title: 'Inquiries | Admin' };

const SORT_COL_MAP: Record<string, string> = {
  date:   'created_at',
  name:   'name',
  status: 'is_resolved',
};

interface PageProps {
  searchParams: Promise<{
    page?: string; pageSize?: string; sortCol?: string; sortDir?: string;
  }>;
}

export default async function InquiriesPage({ searchParams }: PageProps) {
  const { page, pageSize, sortCol, sortDir } = await searchParams;

  const pageNum     = parsePage(page);
  const pageSizeNum = parsePageSize(pageSize);
  const col = SORT_COL_MAP[sortCol ?? 'date'] ?? 'created_at';
  const asc = sortDir === 'asc';
  const from = (pageNum - 1) * pageSizeNum;
  const to   = from + pageSizeNum - 1;

  const supabase = createAdminClient();

  const { data, count } = await supabase
    .from('contact_inquiries')
    .select('*', { count: 'exact' })
    .order(col, { ascending: asc })
    .range(from, to);

  const inquiries = (data ?? []) as ContactInquiry[];
  const total     = count ?? 0;
  const unresolved = inquiries.filter((i) => !i.is_resolved).length;

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Contact Inquiries</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {total} total · {unresolved} unresolved this page
        </p>
      </div>

      <div className="bg-surface rounded-lg border border-border-muted overflow-hidden">
        <InquiryTable inquiries={inquiries} total={total} />
      </div>
    </div>
  );
}
