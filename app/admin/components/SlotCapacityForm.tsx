'use client';

import { useState, useTransition } from 'react';
import { CheckIcon } from 'lucide-react';
import { updateMaxPerSlot } from '@/app/admin/actions';
import { notifyError } from '@/lib/notify';
import { cn } from '@/lib/utils';
import { btnPrimary, inputClass } from './controls';
import { MIN_PER_SLOT, MAX_PER_SLOT_LIMIT } from '@/lib/opd-hours';

interface SlotCapacityFormProps {
  current: number;
}

export function SlotCapacityForm({ current }: SlotCapacityFormProps) {
  const [value, setValue] = useState(String(current));
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const parsed = Number(value);
  const dirty = String(current) !== value.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);

    startTransition(async () => {
      try {
        await updateMaxPerSlot(parsed);
        setSaved(true);
      } catch (err) {
        notifyError(err, 'Could not save');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="max_per_slot"
          className="text-[13px] font-semibold text-text-base"
        >
          Patients per time slot
        </label>
        <input
          id="max_per_slot"
          type="number"
          inputMode="numeric"
          min={MIN_PER_SLOT}
          max={MAX_PER_SLOT_LIMIT}
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          className={cn(inputClass, 'w-32 text-[14px]')}
        />
        <p className="text-[12px] text-text-muted leading-relaxed">
          Once this many patients have booked a slot, it shows as{' '}
          <span className="font-semibold">Full</span> on the public booking form
          and no further requests are accepted for it. Between {MIN_PER_SLOT} and{' '}
          {MAX_PER_SLOT_LIMIT}.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !dirty}
          className={cn(btnPrimary, 'py-2')}
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>

        {saved && !dirty && (
          <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-700">
            <CheckIcon size={14} />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
