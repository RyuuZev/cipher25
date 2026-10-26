import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/admin/logout-button";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    user = await getAdminUser();
  } catch {
    user = null;
  }

  if (!user) redirect("/login?next=/admin");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur-xl">
        <a href="#konten" className="skip-link">
          Lewati ke konten
        </a>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex min-h-11 items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl border border-neon/30 bg-neon/10 font-mono text-sm text-neon-soft">
                C
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-mono text-sm font-semibold tracking-[0.3em] text-fg">
                  CIPHER
                </span>
                <span className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">
                  Admin panel
                </span>
              </span>
            </Link>
            <span className="hidden items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs uppercase tracking-[0.16em] text-success-strong sm:inline-flex">
              <ShieldCheck className="size-3" />
              Admin aktif
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-[180px] truncate text-xs text-muted md:block">
              {user.email}
            </span>
            <Link
              href="/"
              prefetch={false}
              className="button-ghost text-xs"
              aria-label="Lihat situs (membuka tab baru)"
            >
              <ExternalLink className="size-3.5" />
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main
        id="konten"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10"
      >
        {children}
      </main>
    </div>
  );
}
