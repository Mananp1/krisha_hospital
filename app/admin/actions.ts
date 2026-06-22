'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import type { AppointmentStatus, AppointmentInsert } from '@/types/database';

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  await admin
    .from('appointments')
    .update({ status, updated_by: user?.id ?? null })
    .eq('id', id);

  revalidatePath('/admin/appointments');
  revalidatePath('/admin');
}

export async function resolveInquiry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  await admin
    .from('contact_inquiries')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: user?.id ?? null,
    })
    .eq('id', id);

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
}

export async function createAppointmentByAdmin(data: AppointmentInsert) {
  const admin = createAdminClient();
  const { error } = await admin.from('appointments').insert(data);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/appointments');
  revalidatePath('/admin');
  revalidatePath('/admin/calendar');
}