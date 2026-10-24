"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <main
        id="konten"
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-20"
      >
        <div className="cyber-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="surface relative w-full max-w-md rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <TriangleAlert className="size-5 shrink-0 text-warning-text" />
            <h1 className="text-2xl font-semibold text-fg">
              Halaman gagal dimuat
            </h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Coba muat ulang halaman. Jika masih gagal, kembali ke pencarian
            atau hubungi pengurus.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={reset} className="button-primary text-sm">
              Coba lagi
            </button>
            <Link href="/" prefetch={false} className="button-ghost text-sm">
              Ke pencarian
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
