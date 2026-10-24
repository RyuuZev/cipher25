import type { Metadata } from "next";
import { Fingerprint } from "lucide-react";
import { redirect } from "next/navigation";

import { AccessForm } from "@/app/masuk/access-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { hasAccess, safeNext } from "@/lib/access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buka arsip",
  description: "Masukkan kode angkatan untuk membuka pencarian CIPHER.",
  robots: { index: false, follow: false },
};

type MasukPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function MasukPage({ searchParams }: MasukPageProps) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = safeNext(rawNext);

  if (await hasAccess()) redirect(next);

  return (
    <>
      <SiteHeader />
      <main
        id="konten"
        className="relative flex flex-1 items-center overflow-hidden px-4 py-16 sm:px-6"
      >
        <div className="cyber-grid pointer-events-none absolute inset-0 opacity-70" />

        <div className="relative mx-auto w-full max-w-md">
          <div className="surface rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Fingerprint className="size-5 shrink-0 text-neon-soft" />
              <h1 className="text-2xl font-semibold leading-snug text-fg">
                Buka arsip angkatan
              </h1>
            </div>
            <div className="mt-6">
              <AccessForm next={next} />
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-xs tracking-[0.16em] text-muted">
            CIPHER / TI 2025
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
