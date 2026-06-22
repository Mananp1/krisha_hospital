import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { InquiryTable } from '@/app/admin/components/InquiryTable';
import type { ContactInquiry } from '@/types/database';

export const metadata: Metadata = { title: 'Inquiries | Admin' };

export default async function InquiriesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  const inquiries = (data ?? []) as ContactInquiry[];

  const unresolved = inquiries.filter((i) => !i.is_resolved).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Contact Inquiries</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          {inquiries.length} total · {unresolved} unresolved.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border-muted overflow-hidden">
        <InquiryTable inquiries={inquiries} />
      </div>
    </div>
  );
}