# Schema v2 — Hardened

Review of the live schema on project `sigmyrwuerlcxmcuplcz`, and a replacement
that is safe to run in place.

**Part 0 is a live outage fix. Run it before anything else.**

---

## Part 0 — URGENT: booking is broken right now

Dropping `public.patients` left its trigger behind. Postgres does not track table
references inside function bodies, so `on_appointment_create_patient` survived the
drop and now throws on every insert. Verified against the live API:

```
POST /rest/v1/appointments
{"code":"42P01","message":"relation \"public.patients\" does not exist"}   HTTP 404
```

Every public booking and every admin-created appointment is failing. Fix:

```sql
drop trigger if exists on_appointment_create_patient on public.appointments;
drop function if exists public.sync_patient_from_appointment();
```

Confirm with:

```sql
select tgname from pg_trigger
where tgrelid = 'public.appointments'::regclass and not tgisinternal;
-- expect only: set_appointments_updated_at
```

Nothing else in the app referenced `patients` — the admin Patients page derives
patients from `appointments` grouped by phone — so there is nothing to restore.

---

## Issues found

| # | Severity | Issue |
|---|----------|-------|
| 1 | **Outage** | Orphaned `on_appointment_create_patient` trigger → every appointment insert fails (Part 0). |
| 2 | **High** | `anon` holds a direct `INSERT` grant on `appointments` and `contact_inquiries`. The only guard is `with check (status = 'pending')`, so anyone with the publishable key can write arbitrary `patient_name`, `phone`, `appointment_date`, `appointment_time`, `created_at` and `updated_by` values, at any volume. |
| 3 | **High** | No database-level validation of OPD hours. All the slot logic lives in `lib/opd-hours.ts`; a direct API call can book 03:00 on any day. |
| 4 | **High** | No capacity enforcement. `MAX_PER_SLOT = 5` is client-side only, and the client cannot even read counts — so the cap is unenforced everywhere. |
| 5 | Medium | Nothing prevents exact duplicate rows (same phone, date, slot), so a double-submit creates two appointments. |
| 6 | Medium | `handle_updated_at()` is `security invoker` with no `set search_path`, which Supabase's linter flags as `function_search_path_mutable`. |
| 7 | Medium | Delete rules are inconsistent: `appointments` and `contact_inquiries` restrict delete to `is_admin()`, but `events` and `testimonials` still use blanket `for all` staff policies, so any staff member can delete them. |
| 8 | Medium | `status` and `role` are bare `text` with check constraints. A typo in application code becomes a runtime `23514` instead of a compile-time error, and there are no enum types defined. |
| 9 | Low | `contact_inquiries`, `events`, `testimonials` and `profiles` have no `updated_at`, so edits are not auditable. Only `appointments` has one. |
| 10 | Low | `phone` is free text with no normalization. Patients are grouped by exact string, so `+91 98765 43210` and `9876543210` would become two patients. Currently clean (43 distinct raw = 43 distinct digits), so this is preventive. |
| 11 | Low | An `rls_auto_enable` event trigger exists that is not in your original schema file. Confirm its provenance — see Part 7. |
| 12 | Low | `get_slot_counts` denies `service_role` (403), because `revoke all … from public` ran without a matching grant. Harmless today (only the browser calls it) but surprising during debugging. |

Confirmed healthy: the audit-column FKs are now `on delete set null`, all five
indexes from the previous migration exist, `is_admin()`/`is_staff()` are
`security definer`, and RLS is enabled on all five tables.

---

## Design change: public writes go through functions

Issues 2–5 share one root cause — the public form writes directly to the table,
so every rule has to be expressible as a single-row `with check`. Capacity limits
and slot validity are not, so they cannot be enforced there.

The fix is to revoke `anon`'s table grants and expose two `security definer`
functions instead. They accept only the fields a patient may supply, and enforce
OPD hours, capacity and duplicate rules server-side.

> **Sequencing matters.** Run **Part 0 now, on its own** — it fixes the outage and
> touches nothing else.
>
> Then run **Parts 1–6 together with the app change in Part 8**, as one
> deployment. Part 1 has to drop the public-insert policy (Postgres will not
> retype a column a policy references), so public booking stays down from that
> point until Part 6 and the app change land. Do not stop halfway.

---

## Part 1 — Enum types

```sql
do $$ begin
  create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.user_role as enum ('admin', 'staff');
exception when duplicate_object then null; end $$;

-- appointments.status
-- The public-insert policy references `status`, and Postgres refuses to alter the
-- type of a column used in a policy ("cannot alter type of a column used in a
-- policy definition"). Drop it here; Part 6 removes it permanently.
drop policy if exists "Public can submit appointments" on public.appointments;

alter table public.appointments drop constraint if exists appointments_status_check;
alter table public.appointments alter column status drop default;
alter table public.appointments
  alter column status type public.appointment_status
  using status::public.appointment_status;
alter table public.appointments alter column status set default 'pending';

-- profiles.role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles alter column role drop default;
alter table public.profiles
  alter column role type public.user_role
  using role::public.user_role;
alter table public.profiles alter column role set default 'staff';
```

The existing rows already contain only valid values, so both casts succeed.

---

## Part 2 — Constraints and normalized phone

```sql
-- Normalized phone, maintained by Postgres. Group patients on this, not `phone`.
-- Takes the last 10 digits so "+91 98765 43210", "098765 43210" and
-- "9876543210" all collapse to one key. Stripping non-digits alone is not
-- enough: it leaves the 91 prefix and still splits the same patient in two.
alter table public.appointments
  add column if not exists phone_digits text
  generated always as (right(regexp_replace(phone, '\D', '', 'g'), 10)) stored;

create index if not exists appointments_phone_digits_idx
  on public.appointments (phone_digits);

-- Slots are on the half hour.
alter table public.appointments
  drop constraint if exists appointments_slot_aligned;
alter table public.appointments
  add constraint appointments_slot_aligned
  check (extract(minute from appointment_time) in (0, 30)
     and extract(second from appointment_time) = 0)
  not valid;

-- OPD hours: Mon–Sat 11:00–14:00 and 18:00–20:00, Sun 11:00–13:00.
alter table public.appointments
  drop constraint if exists appointments_within_opd_hours;
alter table public.appointments
  add constraint appointments_within_opd_hours
  check (
    case extract(dow from appointment_date)
      when 0 then appointment_time >= '11:00' and appointment_time < '13:00'
      else (appointment_time >= '11:00' and appointment_time < '14:00')
        or (appointment_time >= '18:00' and appointment_time < '20:00')
    end
  )
  not valid;

-- One live booking per patient per slot; cancelled rows are exempt.
create unique index if not exists appointments_no_duplicate_idx
  on public.appointments (phone_digits, appointment_date, appointment_time)
  where status <> 'cancelled';
```

**`not valid` is deliberate.** 31 of your 43 existing appointments are outside the
new OPD hours (they are historical June rows booked under the old 09:00–19:30
list). `not valid` applies the rule to new and updated rows while leaving history
alone. If you ever clean the old rows, promote it with
`alter table public.appointments validate constraint appointments_within_opd_hours;`.

---

## Part 3 — Audit timestamps

```sql
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''            -- fixes the mutable-search_path warning
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

alter table public.contact_inquiries add column if not exists updated_at timestamptz;
alter table public.events           add column if not exists updated_at timestamptz;
alter table public.testimonials     add column if not exists updated_at timestamptz;
alter table public.profiles         add column if not exists updated_at timestamptz;

update public.contact_inquiries set updated_at = created_at where updated_at is null;
update public.events            set updated_at = created_at where updated_at is null;
update public.testimonials      set updated_at = created_at where updated_at is null;
update public.profiles          set updated_at = created_at where updated_at is null;

alter table public.contact_inquiries alter column updated_at set not null,
  alter column updated_at set default timezone('utc', now());
alter table public.events           alter column updated_at set not null,
  alter column updated_at set default timezone('utc', now());
alter table public.testimonials     alter column updated_at set not null,
  alter column updated_at set default timezone('utc', now());
alter table public.profiles         alter column updated_at set not null,
  alter column updated_at set default timezone('utc', now());

drop trigger if exists set_contact_inquiries_updated_at on public.contact_inquiries;
create trigger set_contact_inquiries_updated_at before update on public.contact_inquiries
  for each row execute function public.handle_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at before update on public.events
  for each row execute function public.handle_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at before update on public.testimonials
  for each row execute function public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
```

---

## Part 4 — Public submission functions

Both are `security definer` and validate everything the client cannot be trusted
with. `pg_advisory_xact_lock` serialises concurrent bookings for the same slot so
the capacity check cannot be raced.

```sql
-- Every parameter after p_phone has a default so PostgREST can resolve partial
-- calls; it matches functions on the exact set of named arguments supplied.
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
  v_max_per_slot constant int := 5;
  v_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_booked int;
  v_id uuid;
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

  -- Check OPD hours here so patients get a readable message. The table
  -- constraint is the backstop; letting it fire returns a raw 23514 whose
  -- DETAIL echoes the whole row back to the client.
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

  -- Serialise on the slot so the capacity check below cannot be raced.
  perform pg_advisory_xact_lock(hashtextextended(p_date::text || p_time::text, 0));

  select count(*) into v_booked
  from public.appointments
  where appointment_date = p_date
    and appointment_time = p_time
    and status in ('pending', 'confirmed');

  if v_booked >= v_max_per_slot then
    raise exception 'That slot is fully booked' using errcode = '22023';
  end if;

  -- OPD hours and slot alignment are enforced by the table constraints.
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

create or replace function public.submit_inquiry(
  p_name    text,
  p_phone   text,
  p_email   text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_digits text := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  v_id uuid;
begin
  if length(btrim(coalesce(p_name, ''))) < 2 then
    raise exception 'Please enter a valid name' using errcode = '22023';
  end if;

  if length(v_digits) < 10 then
    raise exception 'Please enter a valid phone number' using errcode = '22023';
  end if;

  if length(btrim(coalesce(p_message, ''))) < 5 then
    raise exception 'Please enter a message' using errcode = '22023';
  end if;

  insert into public.contact_inquiries (name, phone, email, message, is_resolved)
  values (
    btrim(p_name),
    btrim(p_phone),
    nullif(btrim(coalesce(p_email, '')), ''),
    btrim(p_message),
    false
  )
  returning id into v_id;

  return v_id;
end;
$$;
```

---

## Part 5 — Slot counts

Recreated so `service_role` can call it too (issue 12).

```sql
create or replace function public.get_slot_counts(target_date date)
returns table (slot time, booked bigint)
language sql
security definer
set search_path = ''
stable
as $$
  select appointment_time, count(*)::bigint
  from public.appointments
  where appointment_date = target_date
    and status in ('pending', 'confirmed')
  group by appointment_time;
$$;
```

---

## Part 6 — Grants and policies

```sql
revoke all on function public.get_slot_counts(date)   from public;
revoke all on function public.submit_appointment(text, text, text, date, time, text) from public;
revoke all on function public.submit_inquiry(text, text, text, text) from public;

grant execute on function public.get_slot_counts(date) to anon, authenticated, service_role;
grant execute on function public.submit_appointment(text, text, text, date, time, text)
  to anon, authenticated;
grant execute on function public.submit_inquiry(text, text, text, text)
  to anon, authenticated;

-- Public no longer writes to tables directly. Ship with Part 8.
revoke insert on public.appointments      from anon;
revoke insert on public.contact_inquiries from anon;

drop policy if exists "Public can submit appointments" on public.appointments;
drop policy if exists "Public can submit inquiries"    on public.contact_inquiries;

-- Align events/testimonials with the admin-only-delete rule (issue 7).
drop policy if exists "Staff have full access to events"       on public.events;
drop policy if exists "Staff have full access to testimonials" on public.testimonials;

create policy "Staff can read events" on public.events
  for select to authenticated using (public.is_staff());
create policy "Staff can insert events" on public.events
  for insert to authenticated with check (public.is_staff());
create policy "Staff can update events" on public.events
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Admins can delete events" on public.events
  for delete to authenticated using (public.is_admin());

create policy "Staff can read testimonials" on public.testimonials
  for select to authenticated using (public.is_staff());
create policy "Staff can insert testimonials" on public.testimonials
  for insert to authenticated with check (public.is_staff());
create policy "Staff can update testimonials" on public.testimonials
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Admins can delete testimonials" on public.testimonials
  for delete to authenticated using (public.is_admin());
```

---

## Part 6b — Patch if you already ran Part 2

Only needed if you ran Part 2 with the earlier `regexp_replace(...)` expression
(no `right(..., 10)`). That version left the country code in place, so
`+91 98765 43210` produced `919876543210` while `9876543210` produced
`9876543210` — the same patient counted twice, which the column exists to stop.

A generated column's expression cannot be altered in place before PG 17, so the
column and its dependent indexes have to be rebuilt:

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

Verify — every row should show a 10-digit key:

```sql
select phone, phone_digits, length(phone_digits) as len
from public.appointments
order by len desc
limit 10;
```

If the unique index fails to build, two existing rows now collapse to the same
patient/date/slot. List them, decide which to cancel, then re-run the index:

```sql
select phone_digits, appointment_date, appointment_time, count(*)
from public.appointments
where status <> 'cancelled'
group by 1, 2, 3
having count(*) > 1;
```

---

## Part 7 — `rls_auto_enable` event trigger — RESOLVED, keep it

Inspected on 2026-08-12. This is Supabase's own RLS safety net, and its body is
benign: on `CREATE TABLE` / `CREATE TABLE AS` / `SELECT INTO` in `public`, it runs
`alter table … enable row level security` and logs the result.

Keep it. The reasoning holds independently of who created it:

* It **only enables** RLS. It never disables it, never grants privileges, never
  reads or writes table data — it is strictly restrictive, so it cannot serve as
  an escalation vector.
* It is scoped to `public` and explicitly skips `pg_catalog`,
  `information_schema`, `pg_toast%` and `pg_temp%`.
* Its `exception when others` branch downgrades any failure to a log line, so it
  cannot break a migration.

Two things to remember because of it:

1. **New tables get RLS with no policies**, i.e. deny-all for `anon` and
   `authenticated` until you attach policies. `service_role` bypasses RLS, so an
   admin page will work while a public page silently reads nothing. If a new table
   returns "permission denied" or empty results, missing policies are the first
   thing to check — not the trigger.
2. Any `enable row level security` line in these migration files is therefore
   redundant. They are kept for explicitness and so the scripts still work if the
   trigger is ever removed.

To re-inspect later:

```sql
select e.evtname, e.evtevent, e.evtenabled, p.proname
from pg_event_trigger e join pg_proc p on p.oid = e.evtfoid;

select prosrc from pg_proc where proname = 'rls_auto_enable';
```

---

## Part 8 — Required application changes

Part 6 revokes the public insert grants, so these must ship together.

`app/sections/AppointmentForm.tsx` — replace the `.from('appointments').insert(...)`
call with:

```ts
const { error } = await supabase.rpc('submit_appointment', {
  p_patient_name: data.patient_name,
  p_phone: data.phone,
  p_email: data.email || null,
  p_date: format(data.appointment_date, 'yyyy-MM-dd'),
  p_time: data.appointment_time + ':00',
  p_message: data.message || null,
});
```

`app/sections/ContactForm.tsx` — replace its insert with `submit_inquiry`
(`p_name`, `p_phone`, `p_email`, `p_message`).

`app/admin/(dashboard)/patients/page.tsx` — group on the new `phone_digits`
column instead of `phone` (issue 10).

Admin writes are unaffected: they use the `service_role` key, which bypasses RLS
and grants, and are authorized by `requireStaff()` / `requireAdmin()` in
`app/admin/actions.ts`.

---

## Verification

```sql
-- 1. Outage fixed: only the updated_at trigger remains
select tgname from pg_trigger
where tgrelid = 'public.appointments'::regclass and not tgisinternal;

-- 2. anon can execute the functions but cannot write tables
select grantee, privilege_type from information_schema.role_table_grants
where table_name in ('appointments','contact_inquiries') and grantee = 'anon';
-- expect: zero rows

-- 3. OPD constraint rejects an out-of-hours slot (should raise 23514)
insert into public.appointments
  (patient_name, phone, appointment_date, appointment_time, status)
values ('Constraint test', '9999999999', current_date + 1, '03:00', 'pending');

-- 4. No functions with mutable search_path
select p.proname
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
  and not exists (
    select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%'
  );
-- expect: zero rows
```

---

## Rollback

Parts 1–3 change column types and add constraints; take a backup first
(**Database → Backups**) since enum conversion is not cleanly reversible.

```sql
-- Restore public table writes (undoes Part 6)
grant insert on public.appointments      to anon;
grant insert on public.contact_inquiries to anon;

create policy "Public can submit appointments" on public.appointments
  for insert to anon, authenticated with check (status = 'pending');
create policy "Public can submit inquiries" on public.contact_inquiries
  for insert to anon, authenticated with check (is_resolved = false);

-- Drop the new constraints
alter table public.appointments drop constraint if exists appointments_within_opd_hours;
alter table public.appointments drop constraint if exists appointments_slot_aligned;
drop index if exists public.appointments_no_duplicate_idx;
```
