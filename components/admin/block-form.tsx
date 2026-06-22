"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Ban } from "lucide-react";
import {
  createBlockAction,
  type BlockState,
} from "@/app/admin/(panel)/availability/actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2.5 text-sm font-semibold text-cream-light transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
      Block dates
    </button>
  );
}

export function BlockForm({ roomId }: { roomId: number }) {
  const [state, formAction] = useFormState<BlockState, FormData>(
    createBlockAction,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  const field =
    "w-full rounded-lg border border-gold/40 bg-white px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="roomId" value={roomId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-ink/80">
          From (check-in)
          <input type="date" name="checkIn" required className={`mt-1 ${field}`} />
        </label>
        <label className="text-sm font-medium text-ink/80">
          To (check-out)
          <input type="date" name="checkOut" required className={`mt-1 ${field}`} />
        </label>
      </div>
      <label className="text-sm font-medium text-ink/80">
        Reason (optional)
        <input
          name="reason"
          className={`mt-1 ${field}`}
          placeholder="Offline booking / maintenance"
        />
      </label>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="rounded-lg bg-emerald/10 px-3 py-2 text-sm text-emerald">
          Dates block ho gayi.
        </p>
      ) : null}

      <div>
        <SubmitBtn />
      </div>
    </form>
  );
}
