import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck, Terminal } from "lucide-react";

import { LoginForm } from "@/app/login/login-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login Admin",
  description: "Area khusus pengurus CIPHER TI 2025.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = rawNext?.startsWith("/") ? rawNext : "/admin";

  try {
    const admin = await getAdminUser();
    if (admin) redirect("/admin");
  } catch {
    // Konfigurasi belum lengkap: tetap tampilkan form.
  }

  return (
    <>
      <SiteHeader />
      <main
        id="konten"
        className="relative flex flex-1 items-center overflow-hidden px-4 py-12 sm:px-6"
      >
        <div className="cyber-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-4xl gap-4 lg:grid-cols-[1fr_420px]">
          <div className="surface hidden flex-col justify-between rounded-3xl p-8 lg:flex">
            <div>
              <span className="chip">
                <ShieldCheck className="size-3.5" />
                Akses terbatas
              </span>
              <p className="mt-6 text-3xl font-semibold leading-tight text-fg">
                Panel pengurus
                <span className="mt-1 block font-mono text-sm tracking-[0.24em] text-neon-soft">
                  CIPHER / TI 2025
                </span>
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
                Login hanya untuk admin angkatan. Dari sini kamu bisa menambah,
                mengubah, dan menghapus data mahasiswa.
              </p>
            </div>

            <div className="border-t border-line/70 pt-4 font-mono text-xs leading-relaxed text-muted">
              <div className="mb-2 flex items-center gap-2 text-neon/70">
                <Terminal className="size-3.5" />
                <span>auth.log</span>
              </div>
              <p>&gt; menginisialisasi sesi aman...</p>
              <p>&gt; peran diperlukan: admin</p>
              <p className="text-fg-subtle">&gt; menunggu kredensial_</p>
            </div>
          </div>

          <div className="surface rounded-3xl p-6 sm:p-8">
            <Link
              href="/"
              prefetch={false}
              className="hit-target inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-neon-soft"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke pencarian
            </Link>

            <h1 className="mt-6 text-xl font-semibold text-fg">
              Masuk sebagai admin
            </h1>
            <p className="mt-1 text-xs text-muted">
              Gunakan akun yang sudah terdaftar di Supabase Auth.
            </p>

            <div className="mt-6">
              <LoginForm next={next} />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted">
              Tidak ada pendaftaran publik. Akun admin dibuat oleh pengurus
              melalui dashboard Supabase.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
