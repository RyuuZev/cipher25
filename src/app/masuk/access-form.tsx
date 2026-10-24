"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";

import { unlock, type UnlockState } from "@/app/masuk/actions";

const initialState: UnlockState = {};

export function AccessForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(unlock, initialState);

  return (
    <form action={action} className="space-y-4" aria-busy={pending}>
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="code" className="label">
          Kode angkatan
        </label>
        <input
          id="code"
          name="code"
          type="text"
          required
          key={state.code ?? "kosong"}
          defaultValue={state.code ?? ""}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="input font-mono"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "code-error" : "code-hint"}
        />
        <p id="code-hint" className="mt-2 text-xs leading-relaxed text-muted">
          Sesi ini terbuka selama 1 minggu
        </p>
      </div>

      {state.error ? (
        <p
          id="code-error"
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger-text"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="button-primary w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" />
        )}
        {pending ? "Membuka arsip..." : "Buka arsip"}
      </button>
    </form>
  );
}
