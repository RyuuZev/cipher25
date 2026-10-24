import { Suspense } from "react";
import { Fingerprint, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { SearchForm } from "@/components/search-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StudentCard } from "@/components/student-card";
import { hasAccess } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { searchStudents } from "@/lib/students";
import type { Student } from "@/lib/types";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim();

  if (!(await hasAccess())) {
    redirect(query ? `/masuk?next=${encodeURIComponent(`/?q=${query}`)}` : "/masuk");
  }

  const configured = isSupabaseConfigured();

  return (
    <>
      <SiteHeader />
      <main id="konten" className="flex-1">
        <section className="relative overflow-hidden border-b border-line/60">
          <div className="cyber-grid pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-neon/10 blur-3xl" />

          <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="chip animate-rise">
                <Sparkles className="size-3.5" />
                Teknologi Informasi · Angkatan 2025
              </span>

              <h1 className="animate-rise mt-6 font-mono text-5xl font-bold tracking-[0.14em] text-fg-strong sm:text-7xl lg:text-8xl">
                CIPHER
              </h1>

              <p className="animate-rise mx-auto mt-5 max-w-[58ch] text-sm leading-relaxed text-muted sm:text-base">
                Database profil mahasiswa Teknologi Informasi 2025. Cari
                berdasarkan NIM atau nama, lalu buka halaman profil lengkap.
              </p>

              <div className="animate-rise mt-10 scroll-mt-24" id="cari">
                <SearchForm query={query} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          {!configured ? (
            <Notice
              title="Database belum terhubung"
              description="Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu jalankan supabase/schema.sql di dashboard Supabase."
            />
          ) : null}

          {configured && query.length > 0 && query.length < 2 ? (
            <Notice
              title="Kata kunci terlalu pendek"
              description="Masukkan minimal 2 karakter untuk mulai mencari."
            />
          ) : null}

          {configured && query.length >= 2 ? (
            <Suspense key={query} fallback={<ResultsSkeleton />}>
              <Results query={query} />
            </Suspense>
          ) : null}

          {configured && query.length === 0 ? <Intro /> : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

async function Results({ query }: { query: string }) {
  let results: Student[] = [];
  let error: string | null = null;

  try {
    results = await searchStudents(query);
  } catch {
    error = "Pencarian gagal. Pastikan skema database sudah dijalankan.";
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            Hasil pencarian
          </p>
          <h2 className="mt-1 text-xl font-semibold text-fg">
            &ldquo;{query}&rdquo;
          </h2>
        </div>
        <p className="font-mono text-xs tracking-wider text-muted">
          {results.length} profil ditemukan
        </p>
      </div>

      {error ? (
        <Notice title="Terjadi kesalahan" description={error} />
      ) : results.length === 0 ? (
        <Notice
          title="Profil tidak ditemukan"
          description="Coba gunakan NIM lengkap atau potongan nama yang berbeda."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Memuat hasil pencarian...</span>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="h-3 w-28 animate-pulse rounded bg-overlay/5" />
          <div className="mt-2 h-6 w-40 animate-pulse rounded bg-overlay/5" />
        </div>
        <div className="h-4 w-28 animate-pulse rounded bg-overlay/5" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="surface h-24 animate-pulse rounded-2xl" />
        <div className="surface h-24 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <div className="surface relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-neon/10 blur-2xl" />
        <h2 className="max-w-md text-2xl font-semibold leading-snug text-fg sm:text-3xl">
          Satu pencarian, satu profil, tanpa perlu daftar akun.
        </h2>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted">
          Halaman ini khusus untuk mahasiswa TI 2025. Data hanya bisa dibuka
          lewat pencarian NIM atau nama, dan panel admin dijaga dengan login.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line/80 pt-4">
          <Stat value="13" label="Digit NIM" />
          <Stat value="2025" label="Angkatan" />
          <Stat value="TI" label="Program studi" />
        </dl>
      </div>

      <div className="grid gap-3">
        <Feature
          icon={<Fingerprint className="size-4" />}
          title="Pencarian terarah"
          description="Cari pakai NIM atau nama. Hasil dibatasi agar tetap ringkas."
        />
        <Feature
          icon={<GraduationCap className="size-4" />}
          title="Profil lengkap"
          description="Foto, NIM, TTL, prodi, fakultas, angkatan, dan Instagram."
        />
        <Feature
          icon={<ShieldCheck className="size-4" />}
          title="Admin terkendali"
          description="Hanya pengurus yang bisa menambah, mengubah, dan menghapus data."
        />
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-xl font-semibold text-neon-soft">
        {value}
      </dd>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="surface flex items-start gap-3 rounded-2xl p-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-neon/20 bg-neon/10 text-neon-soft">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}

function Notice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="surface rounded-2xl border-dashed p-6 text-center">
      <p className="text-sm font-medium text-fg">{title}</p>
      <p className="mx-auto mt-2 max-w-[60ch] text-xs leading-relaxed text-muted">
        {description}
      </p>
    </div>
  );
}
