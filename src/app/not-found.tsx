import Link from "next/link";
import { SearchX } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
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
            <SearchX className="size-5 shrink-0 text-neon-soft" />
            <h1 className="text-2xl font-semibold text-fg">
              Halaman tidak ditemukan
            </h1>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Halaman yang kamu cari tidak ada, atau sudah dipindahkan (404).
          </p>
          <Link href="/" prefetch={false} className="button-primary mt-6 text-sm">
            Kembali ke beranda
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
