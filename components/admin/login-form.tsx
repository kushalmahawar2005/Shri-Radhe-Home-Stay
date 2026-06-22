"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, LogIn, Lock } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald font-semibold text-cream-light transition hover:bg-emerald-dark disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogIn className="h-4 w-4" />
      )}
      {pending ? "Logging in…" : "Login"}
    </button>
  );
}

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});

  const inputCls =
    "w-full rounded-lg border border-gold/40 bg-white px-4 py-2.5 text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {from ? <input type="hidden" name="from" value={from} /> : null}

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@example.com"
          className={inputCls}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink/80">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputCls}
        />
      </label>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />

      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink/50">
        <Lock className="h-3 w-3" /> Secure admin area
      </p>
    </form>
  );
}
