# Schema v3 — Outstanding Re-runs, Admin-Configurable Capacity, Single-Admin Model

Run the parts in order in **Supabase Dashboard → SQL Editor**. Everything is
idempotent and safe to re-run.

Three things happen here:

1. **Part 1–2** — the two re-runs still outstanding from schema v2.
2. **Part 3–4** — per-slot patient capacity becomes a setting the admin controls
   from the admin panel, instead of a hardcoded `5`.
3. **Part 5–7** — the `staff` role is removed. Only admins exist.

> **Sequencing matters.** Part 4 rewrites `submit_appointment` to read the new
> settings table, so Part 3 must run first. Part 6 drops `profiles.role`, which
> the current `is_staff()` / `is_admin()` both read, so Part 5 must run first.
>
> The matching application changes are already committed to the working tree, so
> run all seven parts in one go.

---

## Part 1 — Rebuild `phone_digits` (outstanding)

The expression shipped in schema v2 Part 2 stripped punctuation but left the
country code, so `+91 98765 43210` produced `919876543210` while `9876543210`
produced `9876543210` — the same patient counted twice, which is the exact thing
the column exists to prevent. Verified live during the audit.

A generated column's expression cannot be altered in place before PG 17, so the
column and its dependent indexes are rebuilt:

```sql
drop index if exists public.appointments_no_duplicate_idx;
drop index if exists public.appointments_phone_digits_idx;

alter table public.appointments drop column if exists phone_digits;

alter table public.appointments
  add column phone_digits text
  generated always as (right(regexp_replace(phone, '\D', '', 'g'), 10)) stored;

create index appointments_phone_digits_idx
  on public.appointments (phone_digits);

create unique index appointments_no_duplicate_idx
  on public.appointments (phone_digits, appointment_date, appointment_time)
  where status <> 'cancelled';
```

If the unique index fails to build, two existing rows now collapse onto the same
patient/date/slot. Find them, cancel one, then re-run the index:

```sql
select phone_digits, appointment_date, appointment_time, count(*)
from public.appointments
where status <> 'cancelled'
group by 1, 2, 3
having count(*) > 1;
```

---

## Part 2 — Settings table for slot capacity

A single-row table, so the admin panel has something to write to. The `id boolean
primary key default true check (id)` trick permits exactly one row.

```sql
create table if not exists public.clinic_settings (
  id            boolean primary key default true check (id),
  max_per_slot  int not null default 5 check (max_per_slot between 1 and 100),
  updated_at    timestamptz not null default timezone('utc', now()),
  updated_by    uuid references public.profiles(id) on delete set null
);

insert into public.clinic_settings (id, max_per_slot)
values (true, 5)
on conflict (id) do nothing;

drop trigger if exists set_clinic_settings_updated_at on public.clinic_settings;
create trigger set_clinic_settings_updated_at
  before update on public.clinic_settings
  for each row execute function public.handle_updated_at();

alter table public.clinic_settings enable row level security;
```

That last line is redundant but harmless: the `rls_auto_enable` event trigger
already enables RLS on any table created in `public`. It is kept so the intent is
explicit and the script still works if that trigger is ever removed.

**Consequence:** the table is created with RLS on and **no policies**, which is
deny-all for `anon` and `authenticated` until Part 6 attaches them. `service_role`
bypasses RLS, so the admin Settings page keeps working throughout — but the public
booking form cannot read the capacity in that window and will fall back to 5.
This is the reason Parts 2–6 must run in one go.

---

## Part 3 — `submit_appointment` reads the configured capacity

Replaces the version in schema v2 Part 4. Three fixes over what is currently
deployed:

* reads `max_per_slot` from `clinic_settings` instead of a hardcoded `5`;
* validates OPD hours itself, so patients get a readable message instead of a raw
  `23514` whose `DETAIL` echoes the whole row back to the browser;
* gives the trailing arguments defaults and null-guards the date/time, because
  PostgREST resolves functions by the exact set of named arguments supplied.

```sql
create or replace function public.submit_appointment(
  p_patient_name text,
  p_phone        text,
  p_email        text default null,
  p_date         date default null,
  p_time         time default null,
  p_message      text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_max    int;
  v_booked int;
  v_id     uuid;
begin
  if p_date is null or p_time is null then
    raise exception 'Please select a date and time' using errcode = '22023';
  end if;

  if length(btrim(coalesce(p_patient_name, ''))) < 2 then
    raise exception 'Please enter a valid name' using errcode = '22023';
  end if;

  if length(v_digits) < 10 then
    raise exception 'Please enter a valid phone number' using errcode = '22023';
  end if;

  if p_email is not null and btrim(p_email) <> ''
     and p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Please enter a valid email address' using errcode = '22023';
  end if;

  if p_date < (timezone('utc', now()))::date then
    raise exception 'Please choose a future date' using errcode = '22023';
  end if;

  -- OPD hours checked here so the message is readable; the table constraint
  -- remains as the backstop.
  if extract(minute from p_time) not in (0, 30)
     or extract(second from p_time) <> 0
     or not (
       case extract(dow from p_date)
         when 0 then p_time >= '11:00' and p_time < '13:00'
         else (p_time >= '11:00' and p_time < '14:00')
           or (p_time >= '18:00' and p_time < '20:00')
       end
     ) then
    raise exception 'That time is outside OPD hours' using errcode = '22023';
  end if;

  select max_per_slot into v_max from public.clinic_settings where id;
  v_max := coalesce(v_max, 5);

  -- Serialise on the slot so the capacity check cannot be raced.
  perform pg_advisory_xact_lock(hashtextextended(p_date::text || p_time::text, 0));

  select count(*) into v_booked
  from public.appointments
  where appointment_date = p_date
    and appointment_time = p_time
    and status in ('pending', 'confirmed');

  if v_booked >= v_max then
    raise exception 'That slot is fully booked' using errcode = '22023';
  end if;

  insert into public.appointments
    (patient_name, phone, email, appointment_date, appointment_time, message, status)
  values (
    btrim(p_patient_name),
    btrim(p_phone),
    nullif(btrim(coalesce(p_email, '')), ''),
    p_date,
    p_time,
    nullif(btrim(coalesce(p_message, '')), ''),
    'pending'
  )
  returning id into v_id;

  return v_id;
end;
$$;
```

---

## Part 4 — Single-admin role model: redefine the helpers

Everyone with a profile is an admin, so `is_admin()` becomes "has a profile" and
`is_staff()` is no longer meaningful.

```sql
-- Promote any remaining staff before the column disappears.
update public.profiles set role = 'admin' where role <> 'admin';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
```

New accounts must no longer write a `role`:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if split_part(new.email, '@', 2) <> 'krishahospital.com' then
    raise exception 'Access Denied: Unauthorized email domain.';
  end if;

  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Administrator'));

  return new;
end;
$$;
```

---

## Part 5 — Repoint every policy at `is_admin()`

`is_staff()` cannot be dropped while policies reference it, so they are recreated
first.

```sql
-- appointments
drop policy if exists "Staff can read appointments"   on public.appointments;
drop policy if exists "Staff can insert appointments" on public.appointments;
drop policy if exists "Staff can update appointments" on public.appointments;
drop policy if exists "Admins can delete appointments" on public.appointments;

create policy "Admins manage appointments" on public.appointments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contact_inquiries
drop policy if exists "Staff can read inquiries"    on public.contact_inquiries;
drop policy if exists "Staff can update inquiries"  on public.contact_inquiries;
drop policy if exists "Admins can delete inquiries" on public.contact_inquiries;

create policy "Admins manage inquiries" on public.contact_inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- events
drop policy if exists "Staff have full access to events" on public.events;
drop policy if exists "Staff can read events"    on public.events;
drop policy if exists "Staff can insert events"  on public.events;
drop policy if exists "Staff can update events"  on public.events;
drop policy if exists "Admins can delete events" on public.events;

create policy "Admins manage events" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- testimonials
drop policy if exists "Staff have full access to testimonials" on public.testimonials;
drop policy if exists "Staff can read testimonials"    on public.testimonials;
drop policy if exists "Staff can insert testimonials"  on public.testimonials;
drop policy if exists "Staff can update testimonials"  on public.testimonials;
drop policy if exists "Admins can delete testimonials" on public.testimonials;

create policy "Admins manage testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- profiles
drop policy if exists "Allow reading profiles"    on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

create policy "Admins read profiles" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "Admins update profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete profiles" on public.profiles
  for delete to authenticated using (public.is_admin());
```

---

## Part 6 — Settings policies and grants

Capacity is read by the public booking form to show "Full", so `anon` may read it
and only admins may change it. It is a single non-sensitive integer.

```sql
drop policy if exists "Anyone can read settings" on public.clinic_settings;
create policy "Anyone can read settings" on public.clinic_settings
  for select to anon, authenticated using (true);

drop policy if exists "Admins update settings" on public.clinic_settings;
create policy "Admins update settings" on public.clinic_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.clinic_settings to anon, authenticated;
grant update on public.clinic_settings to authenticated;

-- The admin panel reads and writes this table with the service-role key. This
-- project does not hand service_role privileges on new tables automatically, so
-- without this grant the Settings page fails with 42501 "permission denied".
grant select, update on public.clinic_settings to service_role;
```

---

## Part 7 — Drop the staff role

Only now, with nothing referencing them.

```sql
drop function if exists public.is_staff();

alter table public.profiles drop column if exists role;

drop type if exists public.user_role;
```

`profiles` is now `id`, `full_name`, `created_at`, `updated_at`. Access is binary:
a profile row means admin, no row means no access.

---

## Verification

```sql
-- 1. phone_digits is 10 digits everywhere
select phone, phone_digits, length(phone_digits) as len
from public.appointments order by len desc limit 5;

-- 2. role is gone, is_staff is gone
select column_name from information_schema.columns
where table_name = 'profiles' and table_schema = 'public';
select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and proname in ('is_staff', 'is_admin');
-- expect: is_admin only

-- 3. capacity is readable and configurable
select * from public.clinic_settings;

-- 4. no policy still mentions is_staff
select schemaname, tablename, policyname
from pg_policies
where schemaname = 'public'
  and (qual::text like '%is_staff%' or with_check::text like '%is_staff%');
-- expect: zero rows

-- 5. capacity is enforced — set it to 1, then book the same slot twice
update public.clinic_settings set max_per_slot = 1;
-- second identical call should raise 'That slot is fully booked'
-- remember to set it back to your real value afterwards
```

---

## Part 8 — Run this if you already ran v3

Two things need correcting after the first run.

**1. `service_role` was missing its grant** (fixed in Part 6 above, but the
already-created table needs it applied):

```sql
grant select, update on public.clinic_settings to service_role;
```

Without it the admin Settings page shows "Settings are unavailable" and saving
fails with `42501 permission denied for table clinic_settings`.

**2. Capacity is left at 1** from the verification step, which set
`max_per_slot = 1` to prove the cap fires. Every slot will show **Full** after a
single booking until this is raised:

```sql
select max_per_slot from public.clinic_settings;   -- currently 1
```

Set it back from **Admin → Settings** once the grant above is applied, or here:

```sql
update public.clinic_settings set max_per_slot = 5;
```

---

## Rollback

```sql
-- Restore the two-role model
create type public.user_role as enum ('admin', 'staff');
alter table public.profiles add column role public.user_role not null default 'staff';
update public.profiles set role = 'admin';

create or replace function public.is_staff()
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Drop the settings table (capacity reverts to the hardcoded 5 in Part 3's function)
drop table if exists public.clinic_settings;
```
