import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/75 backdrop-blur-xl">
      <a href="#konten" className="skip-link">
        Lewati ke konten
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" prefetch={false} className="group flex min-h-11 items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl border border-neon/30 bg-neon/10 font-mono text-sm text-neon-soft transition-colors group-hover:border-neon/60 group-hover:bg-neon/15">
            C
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-mono text-sm font-semibold tracking-[0.32em] text-fg transition-colors group-hover:text-neon-soft">
              CIPHER
            </span>
            <span className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
              TI 2025
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/#cari"
            prefetch={false}
            className="hidden min-h-11 items-center rounded-lg px-3 text-fg-subtle transition-colors hover:text-neon-soft sm:flex"
          >
            Cari
          </Link>
          <Link href="/login" className="button-ghost text-xs">
            <LockKeyhole className="size-3.5" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
