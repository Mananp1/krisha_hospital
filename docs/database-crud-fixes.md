# Database CRUD Fixes

Migration to fix the CRUD gaps in the current schema (`krish_hospital_sql.pdf`).

Run the SQL in **Supabase Dashboard → SQL Editor**. Every statement is idempotent,
so the whole file can be re-run safely.

---

## Diagnosis

What was verified against the live project (`sigmyrwuerlcxmcuplcz`):

| # | Symptom | Root cause | Severity |
|---|---------|-----------|----------|
| 1 | **Cannot delete a user / staff member** | `appointments.updated_by`, `contact_inquiries.resolved_by` and `testimonials.approved_by` all reference `profiles(id)` with **no `ON DELETE` clause**, so Postgres defaults to `NO ACTION`. Deleting an auth user cascades to `profiles`, which the referencing rows then block with a foreign-key violation. | Blocker |
| 2 | **Cannot delete appointments / inquiries** | No delete server action or UI exists. RLS already permits it (`for all to authenticated`), so this is purely a missing application feature. | Blocker |
| 3 | **"Full" slot badge never appears on the booking form** | The public form runs a `select` on `appointments` as `anon`, which returns `401 permission denied`. The query fails silently, so every slot always looks empty. | High |
| 4 | Unused `patients` table | Exists in the database with **no grants at all** (even `service_role` gets `permission denied`). The admin Patients page derives patients from `appointments` grouped by phone and never touches it. | Cleanup |
| 5 | No `is_admin()` helper | Only `is_staff()` exists, so destructive operations cannot be restricted to admins. | Medium |

Note on #3: the fix is **not** to grant `anon` a `select` on `appointments` — that
would expose every patient's name, phone, email and symptoms to the public. Part 3
below adds a `security definer` function that returns only per-slot **counts**.

Confirmed *not* broken: `anon` insert on `appointments` and `contact_inquiries`
both return `201`, so public booking and contact submissions work today.

---

## Part 1 — Fix the foreign keys that block user deletion

This is the fix for "I can't delete a user". Audit columns become `null` when the
staff member who set them is removed, preserving the appointment/inquiry itself.

```sql
-- appointments.updated_by
alter table public.appointments
  drop constraint if exists appointments_updated_by_fkey;

alter table public.appointments
  add constraint appointments_updated_by_fkey
  foreign key (updated_by) references public.profiles(id)
  on delete set null;

-- contact_inquiries.resolved_by
alter table public.contact_inquiries
  drop constraint if exists contact_inquiries_resolved_by_fkey;

alter table public.contact_inquiries
  add constraint contact_inquiries_resolved_by_fkey
  foreign key (resolved_by) references public.profiles(id)
  on delete set null;

-- testimonials.approved_by
alter table public.testimonials
  drop constraint if exists testimonials_approved_by_fkey;

alter table public.testimonials
  add constraint testimonials_approved_by_fkey
  foreign key (approved_by) references public.profiles(id)
  on delete set null;
```

`profiles.id → auth.users on delete cascade` is already correct and stays as-is:
deleting the auth user removes the profile, which now no longer trips the FKs above.

---

## Part 2 — Add an `is_admin()` helper

Lets destructive operations be limited to admins rather than all staff.

```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
```

> **Important:** the only profile in the database today has `role = 'staff'`.
> Promote your own account to `admin` before relying on `is_admin()`, or you will
> lock yourself out of admin-only operations:
>
> ```sql
> update public.profiles
> set role = 'admin'
> where id = (select id from auth.users where email = 'you@krishahospital.com');
> ```

---

## Part 3 — Fix booking-form slot availability without leaking patient data

Returns only counts per slot, so the public form can show "Full" without `anon`
ever reading a patient row.

```sql
create or replace function public.get_slot_counts(target_date date)
returns table (slot time, booked bigint)
language sql
security definer
set search_path = public
stable
as $$
  select appointment_time as slot, count(*)::bigint as booked
  from public.appointments
  where appointment_date = target_date
    and status in ('pending', 'confirmed')
  group by appointment_time;
$$;

revoke all on function public.get_slot_counts(date) from public;
grant execute on function public.get_slot_counts(date) to anon, authenticated;
```

---

## Part 4 — Grants

RLS policies only ever *restrict*; a role still needs a table-level grant. These
are the minimum grants matching the existing policies.

```sql
grant usage on schema public to anon, authenticated;

-- Public may submit, but never read, appointments and inquiries.
grant insert on public.appointments      to anon;
grant insert on public.contact_inquiries to anon;

-- Public may read the marketing tables (RLS narrows to active/approved rows).
grant select on public.events       to anon, authenticated;
grant select on public.testimonials to anon, authenticated;

-- Signed-in staff: RLS policies gate the rows via is_staff().
grant select, insert, update, delete on public.appointments      to authenticated;
grant select, insert, update, delete on public.contact_inquiries to authenticated;
grant select, insert, update, delete on public.events            to authenticated;
grant select, insert, update, delete on public.testimonials      to authenticated;
grant select, update, delete         on public.profiles          to authenticated;
```

The admin dashboard uses the `service_role` key, which bypasses both RLS and
grants — so authorization for the admin UI is enforced in the server actions
(`requireStaff()` in `app/admin/actions.ts`), not here.

---

## Part 5 — Restrict deletes to admins (defence in depth)

The existing `for all` staff policies already allow delete. This splits deletes
out so only admins can perform them. Skip this part if staff should keep delete
rights.

```sql
-- Appointments
drop policy if exists "Staff have full access to appointments" on public.appointments;

create policy "Staff can read appointments" on public.appointments
  for select to authenticated using (public.is_staff());

create policy "Staff can update appointments" on public.appointments
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Staff can insert appointments" on public.appointments
  for insert to authenticated with check (public.is_staff());

create policy "Admins can delete appointments" on public.appointments
  for delete to authenticated using (public.is_admin());

-- Contact inquiries
drop policy if exists "Staff have full access to inquiries" on public.contact_inquiries;

create policy "Staff can read inquiries" on public.contact_inquiries
  for select to authenticated using (public.is_staff());

create policy "Staff can update inquiries" on public.contact_inquiries
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "Admins can delete inquiries" on public.contact_inquiries
  for delete to authenticated using (public.is_admin());

-- Profiles: staff read (policy already exists), admins manage
create policy "Admins can update profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "Admins can delete profiles" on public.profiles
  for delete to authenticated using (public.is_admin());
```

---

## Part 6 — Indexes

Matches how the admin pages actually filter and sort.

```sql
create index if not exists appointments_date_time_idx
  on public.appointments (appointment_date desc, appointment_time desc);

create index if not exists appointments_status_idx
  on public.appointments (status);

create index if not exists appointments_phone_idx
  on public.appointments (phone);

create index if not exists contact_inquiries_created_at_idx
  on public.contact_inquiries (created_at desc);

create index if not exists contact_inquiries_is_resolved_idx
  on public.contact_inquiries (is_resolved);
```

---

## Part 7 — Optional: drop the unused `patients` table

The table is unreferenced by the application and has no grants. Verify it is
empty before dropping — **this is destructive and not reversible.**

```sql
-- Inspect first:
select count(*) from public.patients;

-- Then, only if empty and you are sure:
-- drop table public.patients;
```

Left commented deliberately. If you'd rather keep it, it at least needs
`alter table public.patients enable row level security;` plus grants, since it is
currently unreachable by every role.

---

## Part 8 — Verification

Run after applying. All three checks should report the expected value.

```sql
-- 1. Audit FKs should all read "SET NULL"
select
  tc.table_name,
  kcu.column_name,
  rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
join information_schema.referential_constraints rc
  on tc.constraint_name = rc.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and kcu.column_name in ('updated_by', 'resolved_by', 'approved_by');

-- 2. anon must have INSERT but NOT SELECT on appointments
select grantee, privilege_type
from information_schema.role_table_grants
where table_name = 'appointments' and grantee in ('anon', 'authenticated')
order by grantee, privilege_type;

-- 3. Slot counts function works and leaks no PII
select * from public.get_slot_counts(current_date);
```

To confirm the original bug is gone, delete a test staff member from
**Authentication → Users**. It should now succeed instead of raising
`update or delete on table "profiles" violates foreign key constraint`.

---

## Rollback

Part 1 is the only structural change; this restores the original (broken)
behaviour if needed.

```sql
alter table public.appointments
  drop constraint if exists appointments_updated_by_fkey;
alter table public.appointments
  add constraint appointments_updated_by_fkey
  foreign key (updated_by) references public.profiles(id);
-- repeat for contact_inquiries.resolved_by and testimonials.approved_by

drop function if exists public.get_slot_counts(date);
drop function if exists public.is_admin();
```
