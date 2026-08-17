import type { Metadata } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';
import { SlotCapacityForm } from '@/app/admin/components/SlotCapacityForm';
import { OPD_HOURS_LABEL } from '@/lib/opd-hours';
import type { ClinicSettings } from '@/types/database';

export const metadata: Metadata = { title: 'Settings | Admin' };

export default async function SettingsPage() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from('clinic_settings')
    .select('*')
    .eq('id', true)
    .maybeSingle();

  const settings = data as ClinicSettings | null;

  return (
    <div className="p-6 lg:p-8 max-w-page mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-text-base">Settings</h1>
        <p className="text-[13px] text-text-muted mt-0.5">
          Booking rules for the public appointment form
        </p>
      </div>

      {settings ? (
        <div className="bg-surface rounded-lg border border-border-muted p-5 lg:p-6">
          <SlotCapacityForm current={settings.max_per_slot} />
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-red-200 bg-red-50 p-5">
          <p className="text-[13px] text-red-800 leading-relaxed">
            Settings could not be loaded. If the{' '}
            <span className="font-mono text-[12px]">clinic_settings</span> table
            exists, the service role is most likely missing its grant — run Part 8
            of <span className="font-mono text-[12px]">docs/schema-v3.md</span>.
          </p>
        </div>
      )}

      <div className="mt-6 bg-surface rounded-lg border border-border-muted p-5 lg:p-6">
        <h2 className="text-[15px] font-semibold text-text-base mb-1.5">OPD hours</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          {OPD_HOURS_LABEL} Appointments are offered in 30-minute slots, and the
          last slot of each window starts 30 minutes before it closes.
        </p>
        <p className="text-[12px] text-text-muted mt-2.5 leading-relaxed">
          These hours are enforced in both the application and the database. To
          change them, edit{' '}
          <span className="font-mono text-[12px]">lib/opd-hours.ts</span> and the{' '}
          <span className="font-mono text-[12px]">appointments_within_opd_hours</span>{' '}
          constraint together — changing only one will cause bookings to fail.
        </p>
      </div>

      <div className="mt-6 bg-surface rounded-lg border border-border-muted p-5 lg:p-6">
        <h2 className="text-[15px] font-semibold text-text-base mb-1.5">Access</h2>
        <p className="text-[13px] text-text-muted leading-relaxed">
          Every account has full access — there are no restricted roles. Accounts
          are created and removed from Supabase → Authentication → Users, and only
          <span className="font-semibold"> @krishawomenshospital.com</span> addresses
          are accepted.
        </p>
      </div>
    </div>
  );
}
