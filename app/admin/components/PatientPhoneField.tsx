'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircleIcon, UserCheckIcon } from 'lucide-react';
import { searchPatients } from '@/app/admin/actions';
import { formatDate } from '@/lib/format';
import type { PatientMatch } from '@/types/database';

/**
 * Indian mobile numbers, and the width of `appointments.phone_digits`.
 *
 * The lookup waits for the whole number rather than searching as you type. A
 * partial number matches a prefix, so the early keystrokes are the ones that
 * scan the most rows to return the least useful answer — and at ten digits the
 * result is a single patient anyway, since patients are grouped by exactly
 * these ten digits.
 *
 * A number typed with its country code passes ten digits before it is finished
 * ("+91 98765" is already ten). The 250ms debounce below is what covers that:
 * the remaining digits arrive inside one debounce window, so a number typed at
 * any normal speed still costs a single lookup.
 */
const PHONE_DIGITS = 10;

interface PatientPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when an existing patient is picked, to fill the rest of the form. */
  onPatientSelected: (patient: PatientMatch) => void;
  /**
   * A number that already belongs to a known patient — the form was opened from
   * their record, or is editing their appointment. No lookup runs while the
   * field still holds it: there is nothing to identify. Editing it wakes the
   * lookup back up, because it is then a different patient being entered.
   */
  identified?: string | null;
  className?: string;
  id?: string;
}

/**
 * Phone input with a type-ahead over existing patients. Once a full ten-digit
 * number is entered it looks up that patient; picking the match fills in the
 * name and email so a returning patient's details are not retyped.
 *
 * Lookup failures are silent — if schema-v5 has not been run the action returns
 * an empty list and this behaves as a plain text input.
 */
export function PatientPhoneField({
  value, onChange, onPatientSelected, identified, className, id,
}: PatientPhoneFieldProps) {
  const [matches, setMatches] = useState<PatientMatch[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  // Guards against an earlier, slower lookup overwriting a later one.
  const requestRef = useRef(0);

  useEffect(() => {
    const query = value.trim();
    const digits = query.replace(/\D/g, '');
    const seq = ++requestRef.current;

    // Nothing to look up: the patient is already known (picked from the menu, or
    // the form was opened from their record), or the number is still incomplete.
    const settled =
      picked === query || query === identified?.trim() || digits.length < PHONE_DIGITS;

    // Everything runs inside the timer, including the "nothing to search" reset,
    // so no state is set synchronously during the effect.
    const timer = setTimeout(async () => {
      if (settled) {
        setMatches([]);
        setOpen(false);
        setSearching(false);
        return;
      }

      setSearching(true);

      // The action throws if the admin session has expired. A dead lookup must
      // never strand the spinner or block manual typing, so failure just closes
      // the menu and leaves this behaving as a plain input.
      let found: PatientMatch[] = [];
      try {
        found = await searchPatients(query);
      } catch {
        found = [];
      }

      if (seq !== requestRef.current) return;   // a later keystroke won
      setMatches(found);
      setOpen(found.length > 0);
      setSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [value, picked, identified]);

  // Close on outside click.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function select(match: PatientMatch) {
    setPicked(match.phone.trim());
    setOpen(false);
    setMatches([]);
    onChange(match.phone);
    onPatientSelected(match);
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        id={id}
        type="tel"
        autoComplete="off"
        placeholder="Start typing a phone number"
        value={value}
        onChange={(e) => { setPicked(null); onChange(e.target.value); }}
        onFocus={() => { if (matches.length) setOpen(true); }}
        className={className}
      />

      {searching && (
        <LoaderCircleIcon
          className="animate-spin h-3.5 w-3.5 text-text-muted absolute right-3 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
      )}

      {open && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border-muted bg-surface shadow-lg py-1"
        >
          {matches.map((m) => (
            <li key={m.phone_digits}>
              <button
                type="button"
                onClick={() => select(m)}
                className="w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheckIcon size={12} className="text-primary shrink-0" />
                  <span className="text-[13px] font-semibold text-text-base truncate">
                    {m.patient_name}
                  </span>
                </span>
                <span className="block text-[11px] text-text-muted mt-0.5">
                  {m.phone} · {m.total} visit{m.total === 1 ? '' : 's'} · last{' '}
                  {formatDate(m.last_visit)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
