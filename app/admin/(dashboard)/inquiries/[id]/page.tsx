import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/utils/supabase/admin';
import { StatusBadge } from '@/app/admin/components/StatusBadge';
import { ContactActions } from '@/app/admin/components/ContactActions';
import {
  DetailHeader, DetailCard, DetailField,
} from '@/app/admin/components/DetailHeader';
import { InquiryActions } from '@/app/admin/components/InquiryActions';
import { formatTimestampLong } from '@/lib/format';
import type { ContactInquiry } from '@/types/database';

export const metadata: Metadata = { title: 'Inquiry | Admin' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from('contact_inquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!data) notFound();
  const inquiry = data as ContactInquiry;

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <DetailHeader
        backHref="/admin/inquiries"
        backLabel="Inquiries"
        title={inquiry.name}
        subtitle={`Received ${formatTimestampLong(inquiry.created_at)}`}
        actions={<StatusBadge status={inquiry.is_resolved ? 'resolved' : 'unresolved'} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <DetailCard title="Message">
            <p className="text-[14px] text-text-base leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </DetailCard>

          <DetailCard title="Manage">
            <InquiryActions inquiry={inquiry} />
          </DetailCard>
        </div>

        <div className="flex flex-col gap-4">
          <DetailCard title="Contact">
            <div className="flex flex-col gap-3">
              <DetailField label="Phone">
                <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline">
                  {inquiry.phone}
                </a>
              </DetailField>

              {inquiry.email && (
                <DetailField label="Email">
                  <span className="break-all">{inquiry.email}</span>
                </DetailField>
              )}

              <ContactActions phone={inquiry.phone} size="md" />
            </div>
          </DetailCard>

          <DetailCard title="Record">
            <div className="flex flex-col gap-3">
              <DetailField label="Received">
                <span className="text-[13px]">{formatTimestampLong(inquiry.created_at)}</span>
              </DetailField>
              {inquiry.resolved_at && (
                <DetailField label="Resolved">
                  <span className="text-[13px]">{formatTimestampLong(inquiry.resolved_at)}</span>
                </DetailField>
              )}
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
