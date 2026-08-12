# Schema v5 — Patient Lookup

Run in **Supabase Dashboard → SQL Editor**. Idempotent and safe to re-run.

Adds one function, so the admin can start typing a phone number in the New
Appointment dialog and pull an existing patient's details back.

Nothing else in this round needs schema changes — the dashboard's available-slot
panel and "book again" from a patient both read tables that already exist.

---

## Why a function rather than a query

Patients are derived by grouping `appointments` on `phone_digits`, so a lookup
from the client would mean fetching every appointment and grouping in JavaScript
on each keystroke. This does the grouping in Postgres and returns at most a
handful of rows.

**This function must never be granted to `anon`.** It returns patient names,
phone numbers and email addresses. It exists for the signed-in admin panel only.

---

## Part 1 — The lookup function

Matches on a phone prefix (punctuation ignored) or a name substring, and returns
one row per patient carrying their most recent details.

`appointments.phone_digits` is a generated column holding the **last 10 digits**
of the stored number, so a typed country code has to be removed before it can
prefix-match. The function therefore tries two forms of the typed digits: the
digits as-is, and the same digits with a leading `91` (or anything past 10
digits) trimmed off.

```sql
create or replace function public.search_patients(
  p_query text,
  p_limit int default 8
)
returns table (
  phone_digits text,
  phone        text,
  patient_name text,
  email        text,
  total        bigint,
  last_visit   date
)
language sql
security definer
set search_path = ''
stable
as $$
  with q as (
    select
      btrim(coalesce(p_query, ''))                            as raw,
      regexp_replace(coalesce(p_query, ''), '\D', '', 'g')    as digits
  ),
  cand as (
    select
      q.raw,
      q.digits,
      -- Stored value is the last 10 digits, so anything longer is trimmed to it.
      case when length(q.digits) > 10 then right(q.digits, 10) else q.digits end
        as d_main,
      -- A part-typed number may still carry the 91 country code.
      case when length(q.digits) > 2 and left(q.digits, 2) = '91'
           then substr(q.digits, 3) end
        as d_nocc,
      -- % and _ are LIKE wildcards; a name typed with either must match itself.
      replace(replace(q.raw, '%', '\%'), '_', '\_') as raw_esc
    from q
  ),
  matched as (
    select a.phone_digits
    from public.appointments a, cand c
    where length(c.raw) >= 2
      and (
        (c.d_main <> '' and a.phone_digits like c.d_main || '%')
        or (c.d_nocc is not null and c.d_nocc <> ''
            and a.phone_digits like c.d_nocc || '%')
        or a.patient_name ilike '%' || c.raw_esc || '%'
      )
    group by a.phone_digits
  ),
  latest as (
    -- Name and email can change between visits; the newest appointment wins.
    select distinct on (a.phone_digits)
      a.phone_digits, a.phone, a.patient_name, a.email
    from public.appointments a
    join matched m on m.phone_digits = a.phone_digits
    order by a.phone_digits, a.appointment_date desc, a.appointment_time desc
  ),
  stats as (
    select a.phone_digits,
           count(*)::bigint      as total,
           max(a.appointment_date) as last_visit
    from public.appointments a
    join matched m on m.phone_digits = a.phone_digits
    group by a.phone_digits
  )
  select l.phone_digits, l.phone, l.patient_name, l.email, s.total, s.last_visit
  from latest l
  join stats s on s.phone_digits = l.phone_digits
  order by s.last_visit desc, l.patient_name
  limit greatest(1, least(coalesce(p_limit, 8), 25));
$$;
```

The `length(q.raw) >= 2` guard means a single character returns nothing, so the
first keystroke never scans the whole table.

---

## Part 2 — Grants

```sql
revoke all on function public.search_patients(text, int) from public;

-- Signed-in admin only. Deliberately NOT granted to anon: this returns patient
-- names, phone numbers and emails.
grant execute on function public.search_patients(text, int)
  to authenticated, service_role;
```

---

## Part 3 — Index for the name half

`appointments_phone_digits_idx` already covers the phone-prefix match. The name
match is a leading-wildcard `ilike`, which no plain B-tree can serve — a trigram
index is the fix if the table ever grows past a few thousand rows:

```sql
-- Optional; skip unless name search feels slow.
create extension if not exists pg_trgm;

create index if not exists appointments_patient_name_trgm_idx
  on public.appointments using gin (patient_name gin_trgm_ops);
```

At the current size a sequential scan is faster than an index, so this is
genuinely optional.

---

## Verification

Substitute a phone number and name that actually exist in your `appointments`
table for the examples below.

```sql
-- 1. Phone prefix match
select * from public.search_patients('98765');

-- 2. Name match
select * from public.search_patients('sha');

-- 3. Punctuation and country code are ignored — must return the same patient
--    as (1). This is the case the first draft of this function got wrong:
--    phone_digits stores only the last 10 digits, so '+91 98765' has to have
--    its '91' trimmed before it can prefix-match.
select * from public.search_patients('+91 98765');

-- 4. A full number typed with the country code — same patient again.
select * from public.search_patients('+91 9876543210');

-- 5. Too short: expect zero rows, no table scan
select * from public.search_patients('9');

-- 6. A bare '%' must not match every patient (wildcards are escaped).
select * from public.search_patients('%%');   -- expect: zero rows

-- 7. anon must NOT be able to call it
set role anon;
select * from public.search_patients('98765');   -- expect: permission denied
reset role;
```

---

## Rollback

```sql
drop function if exists public.search_patients(text, int);
drop index if exists public.appointments_patient_name_trgm_idx;
```
