'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { MIN_PER_SLOT, MAX_PER_SLOT_LIMIT } from '@/lib/opd-hours';
import type {
  AppointmentStatus,
  AppointmentInsert,
  AppointmentUpdate,
  PatientMatch,
} from '@/types/database';

/** Postgres error shape returned by supabase-js. */
interface DbError {
  code?: string;
  message: string;
}

/**
 * Turns a database error into something a staff member can act on.
 *
 * Raw Postgres messages leak schema details — a check-constraint violation
 * echoes the entire failing row, patient data included — so anything
 * unrecognised falls back to a generic message rather than being passed through.
 */
function throwFriendly(error: DbError): never {
  switch (error.code) {
    case '23505': // unique_violation
      throw new Error(
        'This patient already has an appointment in that slot. Pick another time, or cancel the existing one.',
      );
    case '23514': // check_violation
      throw new Error(
        'That date and time is outside OPD hours (Mon–Sat 11 AM–2 PM & 6 PM–8 PM, Sun 11 AM–1 PM).',
      );
    case '22P02': // invalid_text_representation — bad enum value
      throw new Error('That value is not allowed for this field.');
    case '23503': // foreign_key_violation
      throw new Error('That record is still referenced elsewhere and cannot be removed.');
    case '23502': // not_null_violation
      throw new Error('A required field is missing.');
    case 'PGRST204': // column missing from the PostgREST schema cache
      throw new Error(
        'This feature needs a database update that has not been applied yet. Run docs/schema-v4.md, then try again.',
      );
    default:
      console.error('[admin action] unexpected database error', error.code, error.message);
      throw new Error('Something went wrong. Please try again.');
  }
}

/**
 * Server actions are public POST endpoints, and the clients below use the
 * service-role key (which bypasses RLS). Every action must therefore prove the
 * caller is a signed-in admin before touching data.
 *
 * Returns the acting user's id for audit columns.
 */
async function requireAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Access is binary — a profile row is the grant. The `staff` role was removed
  // in docs/schema-v3.md, so there is nothing finer to check.
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) throw new Error('Not authorized');

  return user.id;
}

function revalidateAppointments() {
  revalidatePath('/admin');
  revalidatePath('/admin/appointments');
  revalidatePath('/admin/calendar');
  revalidatePath('/admin/patients');
}

function revalidateInquiries() {
  revalidatePath('/admin');
  revalidatePath('/admin/inquiries');
}

// ── Appointments ────────────────────────────────────────────────────────────

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const userId = await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('appointments')
    .update({ status, updated_by: userId })
    .eq('id', id);

  if (error) throwFriendly(error);
  revalidateAppointments();
}

export async function createAppointmentByAdmin(data: AppointmentInsert) {
  const userId = await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('appointments')
    .insert({ ...data, updated_by: userId });

  if (error) throwFriendly(error);
  revalidateAppointments();
}

/** Full edit of an existing appointment (not just its status). */
export async function updateAppointment(id: string, data: AppointmentUpdate) {
  const userId = await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('appointments')
    .update({ ...data, updated_by: userId })
    .eq('id', id);

  if (error) throwFriendly(error);
  revalidateAppointments();
}

export async function deleteAppointment(id: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin.from('appointments').delete().eq('id', id);

  if (error) throwFriendly(error);
  revalidateAppointments();
}

/**
 * Deletes every appointment for a phone number. "Patients" are derived by
 * grouping appointments on `phone_digits`, so this matches on the same column —
 * matching raw `phone` would miss rows saved with different punctuation.
 */
export async function deletePatient(phoneDigits: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('appointments')
    .delete()
    .eq('phone_digits', phoneDigits);

  if (error) throwFriendly(error);
  revalidateAppointments();
}

/**
 * Renames a patient, or corrects their phone number, across every appointment
 * they hold. Patients are derived by grouping on `phone_digits`, so this has to
 * rewrite the whole group — a per-appointment edit would split one patient into
 * two. Done as a single statement so a patient cannot end up half-renamed.
 */
export async function updatePatient(
  phoneDigits: string,
  data: { patient_name: string; phone: string },
) {
  const userId = await requireAdmin();

  if (data.patient_name.trim().length < 2) {
    throw new Error('Enter a valid name.');
  }
  if (data.phone.replace(/\D/g, '').length < 10) {
    throw new Error('Enter a valid phone number.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('appointments')
    .update({
      patient_name: data.patient_name.trim(),
      phone: data.phone.trim(),
      updated_by: userId,
    })
    .eq('phone_digits', phoneDigits);

  if (error) throwFriendly(error);
  revalidateAppointments();
}

/**
 * Type-ahead lookup for the New Appointment dialog: the admin starts typing a
 * phone number (or name) and gets back matching existing patients, so a
 * returning patient's details can be filled in rather than retyped.
 *
 * A failed lookup returns [] rather than throwing, so it degrades to plain
 * typing if schema-v5 has not been run yet. Auth still throws, as everywhere
 * else here — the caller treats that as "no matches".
 */
export async function searchPatients(query: string): Promise<PatientMatch[]> {
  await requireAdmin();

  if (query.trim().length < 2) return [];

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('search_patients', {
    p_query: query,
    p_limit: 8,
  });

  if (error) {
    console.error('[admin action] search_patients failed', error.code, error.message);
    return [];
  }

  return (data ?? []) as PatientMatch[];
}

// ── Contact inquiries ───────────────────────────────────────────────────────

/** Corrects the details on an inquiry — misheard name, mistyped number. */
export async function updateInquiry(
  id: string,
  data: { name: string; phone: string; email: string | null; message: string },
) {
  await requireAdmin();

  if (data.name.trim().length < 2) {
    throw new Error('Enter a valid name.');
  }
  if (data.phone.replace(/\D/g, '').length < 10) {
    throw new Error('Enter a valid phone number.');
  }
  if (data.message.trim().length < 1) {
    throw new Error('Message cannot be empty.');
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('contact_inquiries')
    .update({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      message: data.message.trim(),
    })
    .eq('id', id);

  if (error) throwFriendly(error);
  revalidateInquiries();
}

export async function resolveInquiry(id: string) {
  const userId = await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('contact_inquiries')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: userId,
    })
    .eq('id', id);

  if (error) throwFriendly(error);
  revalidateInquiries();
}

/** Reverses a resolve — the previous code offered no way back. */
export async function unresolveInquiry(id: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('contact_inquiries')
    .update({ is_resolved: false, resolved_at: null, resolved_by: null })
    .eq('id', id);

  if (error) throwFriendly(error);
  revalidateInquiries();
}

export async function deleteInquiry(id: string) {
  await requireAdmin();

  const admin = createAdminClient();
  const { error } = await admin.from('contact_inquiries').delete().eq('id', id);

  if (error) throwFriendly(error);
  revalidateInquiries();
}

// ── Clinic settings ─────────────────────────────────────────────────────────

/** Sets how many patients may book the same time slot. */
export async function updateMaxPerSlot(maxPerSlot: number) {
  const userId = await requireAdmin();

  if (
    !Number.isInteger(maxPerSlot) ||
    maxPerSlot < MIN_PER_SLOT ||
    maxPerSlot > MAX_PER_SLOT_LIMIT
  ) {
    throw new Error(
      `Enter a whole number between ${MIN_PER_SLOT} and ${MAX_PER_SLOT_LIMIT}.`,
    );
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('clinic_settings')
    .update({ max_per_slot: maxPerSlot, updated_by: userId })
    .eq('id', true);

  if (error) throwFriendly(error);

  revalidatePath('/admin/settings');
  revalidatePath('/book-appointment');
}

// Account management lives in Supabase → Authentication → Users. With a single
// admin there is nothing to manage in-app, so there is no deleteStaff action —
// an admin deleting their own only account would lock themselves out.
