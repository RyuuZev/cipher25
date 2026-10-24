"use client";

import { useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { login, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-4" aria-busy={pending}>
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="email" className="label">
          Email admin
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@cipher.com"
          className="input"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="input"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>

      {state.error ? (
        <p
          id="login-error"
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
          <LogIn className="size-4" />
        )}
        {pending ? "Memverifikasi..." : "Masuk ke panel admin"}
      </button>
    </form>
  );
}
