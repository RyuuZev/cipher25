"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";

export function SearchForm({ query }: { query: string }) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const resetPending = () => setPending(false);
    window.addEventListener("pageshow", resetPending);
    return () => window.removeEventListener("pageshow", resetPending);
  }, []);

  return (
    <form
      action="/"
      method="get"
      className="w-full"
      aria-busy={pending}
      onSubmit={() => setPending(true)}
    >
      <div className="surface flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 px-3">
          <Search className="size-5 shrink-0 text-neon/70" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            minLength={2}
            required
            autoComplete="off"
            placeholder="Masukkan NIM atau nama mahasiswa..."
            className="w-full bg-transparent py-3 text-sm text-fg placeholder:text-muted"
            aria-label="Cari NIM atau nama"
          />
          {query ? (
            <Link
              href="/"
              prefetch={false}
              className="grid size-11 place-items-center rounded-lg text-muted transition-colors hover:bg-overlay/5 hover:text-fg-secondary"
              aria-label="Hapus pencarian"
            >
              <X className="size-4" />
            </Link>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="button-primary shrink-0 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          {pending ? "Mencari..." : "Cari profil"}
        </button>
      </div>
      <p className="mt-3 px-2 text-xs text-muted">
        Minimal 2 karakter. Contoh: <span className="font-mono text-fg-subtle">2510817</span>{" "}
        atau <span className="text-fg-subtle">Ahmad</span>.
      </p>
      <p className="sr-only" role="status">
        {pending ? "Mencari profil..." : ""}
      </p>
    </form>
  );
}
