# Schema v6 — Check-in & No-shows

Run in **Supabase Dashboard → SQL Editor**. Idempotent and safe to re-run.

Adds two columns, so the clinic can record that a patient actually turned up —
and, by consequence, see who did not.

---

## The problem

An appointment currently carries only `status` (`pending` / `confirmed` /
`cancelled`), and all three describe the *booking*, not the *visit*. Once 11:00
AM has been and gone there is nothing in the row that says whether the patient
walked in. The desk cannot tell a patient who came from one who silently didn't,
so nobody knows who to call back.

`status` cannot be stretched to cover this. "Confirmed" means the clinic agreed
to the slot; it is decided before the visit. Attendance is decided after it, and
the two move independently — a confirmed patient can fail to show, and a pending
one can walk in anyway.

---

## The decision: attendance is derived, not stored

Only the **positive** fact is written down:

> `checked_in_at` — the moment the desk marked the patient as arrived.

Everything else is read off that one column plus the date:

| Condition | Reads as |
|---|---|
| `status = 'cancelled'` | Cancelled — attendance does not apply |
| `checked_in_at is not null` | **Arrived** |
| not checked in, `appointment_date < today` | **No-show** |
| not checked in, `appointment_date = today` | **Awaiting** — still expected |
| not checked in, `appointment_date > today` | Upcoming |

This is the part worth being deliberate about, because the requirement was
"if the patient never comes, the day should un-check itself". Two ways to get
there:

1. **A scheduled job** (`pg_cron`) that stamps `no_show` on every unchecked past
   appointment at midnight.
2. **Derive it at read time**, which is what this migration does.

Deriving wins on every axis that matters here:

* **Nothing to schedule.** No `pg_cron` extension, no job that can silently stop
  running and leave a week of appointments in limbo.
* **It cannot drift.** A stored flag written at midnight is a snapshot; if the
  admin later corrects an appointment's date, the stored flag is now a lie. A
  derived one re-answers the question every time it is read.
* **It is retroactive by definition.** An appointment from last March with no
  check-in has always been a no-show and always reads as one, including for rows
  that predate this migration.
* **Midnight needs no special handling.** "The day has passed" is just
  `appointment_date < today`, so at 00:00 the whole of yesterday flips to no-show
  on its own — the "automatic un-check" is a consequence of the definition
  rather than a job that has to fire.

The cost is that "no-show" cannot be filtered with a single indexed equality.
That is handled in Part 2, and at this table's size it is not measurable.

**Which "today"?** The clinic runs on IST. A server in UTC would roll over its
date at 05:30 IST and call an appointment a no-show while the clinic is still
shut — so the application asks for the date in `Asia/Kolkata` explicitly
(`todayInClinic()` in `lib/format.ts`), and the view in Part 4 does the same.

---

## Part 1 — The columns

```sql
alter table public.appointments
  add column if not exists checked_in_at timestamptz,
  add column if not exists checked_in_by uuid
    references public.profiles(id) on delete set null;

comment on column public.appointments.checked_in_at is
  'When the desk marked the patient as arrived. Null means not checked in — '
  'which, once appointment_date has passed, reads as a no-show. No-show is '
  'never stored: it is derived from this column and the date (docs/schema-v6.md).';

comment on column public.appointments.checked_in_by is
  'Admin who recorded the arrival. Kept for the audit trail only.';
```

Both are nullable with no default, so every existing row starts as "not checked
in" — correct for past appointments (no-show, since nobody recorded an arrival)
and correct for future ones (upcoming).

Nothing is granted here: column privileges follow the table's, and
`appointments` is already reachable by `service_role` (the admin panel) and by
`authenticated` through the `"Admins manage appointments"` policy from
schema-v3. `anon` gains nothing.

---

## Part 2 — Index for the no-show lookup

The dashboard counts recent no-shows on every load, and the appointments list
has a "No-show" filter. Both ask the same question — *unchecked rows on a past
date* — so a partial index on the unchecked rows only serves it, and stays small
because checked-in rows drop out of it entirely.

```sql
create index if not exists appointments_not_checked_in_idx
  on public.appointments (appointment_date)
  where checked_in_at is null and status <> 'cancelled';
```

---

## Part 3 — The public form still cannot touch it

`submit_appointment()` inserts an explicit column list
(`patient_name, phone, email, appointment_date, appointment_time, message,
status`) which does not include `checked_in_at`. Public bookings therefore
always start unchecked, and no patient can mark themselves as attended.

No change is required — but assert it, because "only the clinic can say someone
turned up" is the whole point of the column:

```sql
-- Expect: zero rows. A hit means the function was edited to write check-ins.
select proname
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and proname = 'submit_appointment'
  and prosrc like '%checked_in%';
```

---

## Part 4 — Reporting view (optional)

The admin panel derives attendance in TypeScript, so nothing in the app needs
this. It exists for ad-hoc queries in the SQL editor — "who missed last week" —
without re-deriving the rules by hand each time.

```sql
create or replace view public.appointment_attendance
with (security_invoker = true) as
select
  a.id,
  a.patient_name,
  a.phone,
  a.phone_digits,
  a.appointment_date,
  a.appointment_time,
  a.status,
  a.checked_in_at,
  case
    when a.status = 'cancelled'    then 'cancelled'
    when a.checked_in_at is not null then 'arrived'
    when a.appointment_date < (timezone('Asia/Kolkata', now()))::date then 'no_show'
    when a.appointment_date = (timezone('Asia/Kolkata', now()))::date then 'awaiting'
    else 'upcoming'
  end as attendance
from public.appointments a;
```

`security_invoker = true` matters: without it the view runs with its owner's
rights and would hand every patient's name and phone number to anyone able to
select from it, bypassing the RLS policy on `appointments`. With it, the caller's
own policies apply.

Belt and braces on top of that — this view carries patient contact details, so
`anon` is explicitly locked out:

```sql
revoke all on public.appointment_attendance from anon;
grant select on public.appointment_attendance to authenticated, service_role;
```

Example use:

```sql
select patient_name, phone, appointment_date, appointment_time
from public.appointment_attendance
where attendance = 'no_show'
  and appointment_date >= current_date - 7
order by appointment_date desc, appointment_time desc;
```

---

## Rules the application enforces

These are app-level, not constraints, and the reasoning is worth recording:

| Rule | Where | Why not a constraint |
|---|---|---|
| A patient cannot be checked in before their appointment day | `setAppointmentCheckIn` | Needs "today", which is not immutable, so no `check` can express it |
| Checking in a **past** appointment is allowed | same | Covers the desk marking arrivals after the fact — the common case when it gets busy |
| Cancelling clears any check-in | `updateAppointmentStatus`, `updateAppointment` | A `check (checked_in_at is null or status <> 'cancelled')` would turn a normal cancel into a `23514` the admin cannot act on. Clearing it silently is the behaviour they actually want |
| A cancelled appointment cannot be checked in | `setAppointmentCheckIn` | Same reason — a readable message beats a constraint violation |

---

## Verification

```sql
-- 1. Columns exist and default to null
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'appointments'
  and column_name in ('checked_in_at', 'checked_in_by');
-- expect: 2 rows, is_nullable = YES, no default

-- 2. Every pre-existing row starts unchecked
select count(*) as total, count(checked_in_at) as checked_in
from public.appointments;
-- expect: checked_in = 0 immediately after this migration

-- 3. The partial index is there and is used by the no-show query
explain (costs off)
select id from public.appointments
where checked_in_at is null and status <> 'cancelled'
  and appointment_date < current_date;
-- expect: Index Scan using appointments_not_checked_in_idx
--         (a seq scan here is fine on a small table — Postgres is allowed to
--          decide the index is not worth it; the index still exists)

-- 4. Derivation is sane across all five states
select attendance, count(*)
from public.appointment_attendance
group by attendance order by 1;

-- 5. Round-trip a check-in on a real past appointment
update public.appointments
set checked_in_at = timezone('utc', now())
where id = '<paste-an-appointment-id>';

select attendance from public.appointment_attendance
where id = '<same-id>';        -- expect: arrived

update public.appointments set checked_in_at = null
where id = '<same-id>';        -- back to no_show / awaiting / upcoming

-- 6. anon cannot read the view
set role anon;
select * from public.appointment_attendance limit 1;   -- expect: permission denied
reset role;
```

---

## Rollback

```sql
drop view if exists public.appointment_attendance;
drop index if exists public.appointments_not_checked_in_idx;

alter table public.appointments
  drop column if exists checked_in_at,
  drop column if exists checked_in_by;
```

Dropping the columns discards every recorded arrival — there is nowhere else
that information lives. Export it first if the history matters:

```sql
select id, appointment_date, appointment_time, checked_in_at
from public.appointments
where checked_in_at is not null;
```
