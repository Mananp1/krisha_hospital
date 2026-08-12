# Schema v4 — Emergency Rescheduling & Admin Overrides

Run in **Supabase Dashboard → SQL Editor**. Idempotent and safe to re-run.

---

## The problem

When the clinic calls a patient to move an appointment — an emergency came in, the
doctor is running late, the patient asked for a different day — the admin needs to
put that appointment at whatever time was actually agreed on the phone. Right now
that is impossible at two levels:

1. **The UI** only offers OPD slots from a dropdown, so no other time can be picked.
2. **The database rejects it anyway.** The `appointments_within_opd_hours` and
   `appointments_slot_aligned` check constraints apply to *every* row, including
   ones the admin creates. A 4:15 PM emergency slot fails with `23514`.

Those constraints exist to stop the **public** booking form accepting junk. They
were never meant to bind the clinic's own staff. This migration adds an explicit
per-row override so the admin can schedule any time, while the public form stays
locked to OPD hours.

---

## Part 1 — Add the override flag

```sql
alter table public.appointments
  add column if not exists override_opd boolean not null default false;

comment on column public.appointments.override_opd is
  'Set by admin only. Exempts the row from OPD-hours and slot-alignment checks, '
  'for emergencies and phone-agreed reschedules. The public submit_appointment() '
  'function never sets it, so patients cannot self-book outside OPD hours.';
```

---

## Part 2 — Let the override relax the checks

Both constraints are rebuilt so they pass automatically when `override_opd` is
true. They stay `not valid` because 31 historical rows predate OPD enforcement.

```sql
alter table public.appointments
  drop constraint if exists appointments_within_opd_hours;

alter table public.appointments
  add constraint appointments_within_opd_hours
  check (
    override_opd
    or (
      case extract(dow from appointment_date)
        when 0 then appointment_time >= '11:00' and appointment_time < '13:00'
        else (appointment_time >= '11:00' and appointment_time < '14:00')
          or (appointment_time >= '18:00' and appointment_time < '20:00')
      end
    )
  )
  not valid;

alter table public.appointments
  drop constraint if exists appointments_slot_aligned;

alter table public.appointments
  add constraint appointments_slot_aligned
  check (
    override_opd
    or (extract(minute from appointment_time) in (0, 30)
        and extract(second from appointment_time) = 0)
  )
  not valid;
```

---

## Part 3 — Keep the public form locked out

`submit_appointment()` inserts an explicit column list that does not include
`override_opd`, so public bookings always take the `false` default and remain
subject to both checks. No change is required — but the guarantee is worth
asserting, because it is the whole reason the override is safe:

```sql
-- Should raise 'That time is outside OPD hours' (errcode 22023), NOT succeed.
select public.submit_appointment(
  'Override probe', '9000000001', null, current_date + 1, '03:00', null
);
```

If that ever returns a uuid instead of raising, the public form can book any
time — treat it as a security regression and re-apply schema-v3 Part 3.

---

## Part 4 — Duplicate rule still applies

`appointments_no_duplicate_idx` is deliberately **not** relaxed. It stops the same
patient holding two live bookings in the same slot, which is a data-integrity rule
rather than an opening-hours rule — a genuine reschedule moves the existing row
rather than adding a second one.

Consequence for the app: moving an appointment onto a slot that patient already
holds raises `23505`, and renaming a patient's phone onto another patient's number
can do the same. Both surface as
*"This patient already has an appointment in that slot"* via `throwFriendly()`.

---

## Part 5 — What still has no edit path

For reference, since this was the broader complaint. None of these need schema
changes — they are plain updates the admin panel simply never exposed:

| Data | Edit path before | Now |
|---|---|---|
| Appointment name / phone / date / time / status / notes | Detail screen only | Also from the appointments list |
| Appointment at a non-OPD time | Impossible | `override_opd` (this migration) |
| Patient name / phone across **all** their appointments | None | Edit patient dialog |
| Inquiry name / phone / email / message | None | Edit inquiry dialog |

Patient edits rewrite `patient_name` / `phone` on every appointment sharing that
`phone_digits`, in one statement, so a patient cannot end up half-renamed.

---

## Verification

```sql
-- 1. Column exists and defaults false
select column_name, data_type, column_default
from information_schema.columns
where table_name = 'appointments' and column_name = 'override_opd';

-- 2. Admin can insert an off-hours emergency slot
insert into public.appointments
  (patient_name, phone, appointment_date, appointment_time, status, override_opd)
values ('Override test', '9999999999', current_date + 1, '16:15', 'pending', true);
-- expect: success

-- 3. The same row without the flag is still rejected
insert into public.appointments
  (patient_name, phone, appointment_date, appointment_time, status)
values ('Override test 2', '9999999998', current_date + 1, '16:15', 'pending');
-- expect: 23514 check constraint violation

-- 4. Clean up
delete from public.appointments where patient_name like 'Override test%';
```

---

## Rollback

```sql
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
  ) not valid;

alter table public.appointments
  drop constraint if exists appointments_slot_aligned;
alter table public.appointments
  add constraint appointments_slot_aligned
  check (extract(minute from appointment_time) in (0, 30)
     and extract(second from appointment_time) = 0) not valid;

alter table public.appointments drop column if exists override_opd;
```
