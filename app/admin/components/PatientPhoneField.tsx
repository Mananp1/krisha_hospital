'use client';

import { useEffect, useRef, useState } from 'react';
import { LoaderCircleIcon, UserCheckIcon } from 'lucide-react';
import { searchPatients } from '@/app/admin/actions';
import { formatDate } from '@/lib/format';
import type { PatientMatch } from '@/types/database';

interface PatientPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Fired when an existing patient is picked, to fill the rest of the form. */
  onPatientSelected: (patient: PatientMatch) => void;
  className?: string;
  id?: string;
}

/**
 * Phone input with a type-ahead over existing patients. Typing two or more
 * characters looks up matches; picking one fills in the name and email so a
 * returning patient's details are not retyped.
 *
 * Lookup failures are silent — if schema-v5 has not been run the action returns
 * an empty list and this behaves as a plain text input.
 */
export function PatientPhoneField({
  value, onChange, onPatientSelected, className, id,
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
    const seq = ++requestRef.current;

    // Everything runs inside the timer, including the "nothing to search" reset,
    // so no state is set synchronously during the effect.
    const timer = setTimeout(async () => {
      if (picked === query || query.length < 2) {
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
  }, [value, picked]);

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
