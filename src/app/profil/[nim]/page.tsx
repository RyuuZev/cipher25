import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  GraduationCap,
  MapPin,
} from "lucide-react";

import { InstagramIcon } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StudentPhoto } from "@/components/student-photo";
import { hasAccess } from "@/lib/access";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getStudentByNim } from "@/lib/students";
import type { Student } from "@/lib/types";
import { instagramHandle } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ProfileProps = {
  params: Promise<{ nim: string }>;
};

async function loadStudent(nim: string): Promise<Student | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    return await getStudentByNim(nim);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProfileProps): Promise<Metadata> {
  const { nim } = await params;

  if (!(await hasAccess())) {
    return {
      title: "Buka arsip",
      robots: { index: false, follow: false },
    };
  }

  const student = await loadStudent(nim);

  if (!student) {
    return {
      title: "Profil tidak ditemukan",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: student.nama,
    description: `Profil ${student.nama} — ${student.nim}, ${student.prodi} ${student.angkatan}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({ params }: ProfileProps) {
  const { nim } = await params;

  if (!(await hasAccess())) {
    redirect(`/masuk?next=${encodeURIComponent(`/profil/${nim}`)}`);
  }

  if (!isSupabaseConfigured()) {
    return <ProfileShell><ProfileNotice /></ProfileShell>;
  }

  let student: Student | null = null;
  let failed = false;

  try {
    student = await getStudentByNim(nim);
  } catch {
    failed = true;
  }

  if (failed) {
    return <ProfileShell><ProfileNotice /></ProfileShell>;
  }

  if (!student) notFound();

  const handle = instagramHandle(student.instagram_url);

  return (
    <ProfileShell>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="surface relative overflow-hidden rounded-3xl p-3 max-h-[60vh] md:max-h-none">
          <StudentPhoto
            student={student}
            className="aspect-[4/5] w-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            priority
            rounded="rounded-2xl"
          />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between rounded-2xl bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 pt-16">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-neon/80">
                CIPHER · TI 2025
              </p>
              <p className="mt-1 font-mono text-xs tracking-[0.16em] text-fg-secondary">
                {student.nim}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-rise">
          <Link
            href="/"
            prefetch={false}
            className="hit-target inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-neon-soft"
          >
            <ArrowLeft className="size-3.5" />
            Kembali ke pencarian
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="chip">Profil mahasiswa</span>
            <span className="chip border-overlay/10 bg-overlay/5 text-fg-subtle">
              Angkatan {student.angkatan}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-fg-strong sm:text-4xl">
            {student.nama}
          </h1>

          <p className="mt-4 font-mono text-sm tracking-[0.18em] text-neon-soft">
            {student.nim}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Detail
              icon={<MapPin className="size-4" />}
              label="Tempat, tanggal lahir"
              value={student.ttl ?? "Belum diisi"}
            />
            <Detail
              icon={<CalendarDays className="size-4" />}
              label="Angkatan"
              value={String(student.angkatan)}
            />
            <Detail
              icon={<GraduationCap className="size-4" />}
              label="Program studi"
              value={student.prodi}
            />
            <Detail
              icon={<Building2 className="size-4" />}
              label="Fakultas"
              value={student.fakultas}
            />
          </div>

          {student.instagram_url ? (
            <a
              href={student.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary mt-8 text-sm"
            >
              <InstagramIcon className="size-4" />
              {handle ?? "Instagram"}
            </a>
          ) : null}

          <p className="mt-8 max-w-[26rem] text-xs leading-relaxed text-muted">
            Profil ini merupakan bagian dari database angkatan CIPHER. Halaman
            ini tidak diindeks mesin pencari. Hubungi pengurus jika ada
            informasi yang perlu diperbarui atau data yang ingin dihapus.
          </p>
        </div>
      </div>
    </ProfileShell>
  );
}

function ProfileShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="konten" className="relative flex-1 overflow-hidden">
        <div className="cyber-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface rounded-2xl p-4">
      <div className="flex items-center gap-2 text-muted">
        <span className="text-neon/70">{icon}</span>
        <p className="text-xs uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-2 text-sm text-fg">{value}</p>
    </div>
  );
}

function ProfileNotice() {
  return (
    <div className="surface mx-auto max-w-lg rounded-3xl p-8 text-center">
      <h1 className="text-xl font-semibold text-fg">
        Profil belum bisa ditampilkan
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Database belum terhubung atau profil tidak ditemukan. Pastikan
        konfigurasi Supabase dan skema database sudah benar.
      </p>
      <Link href="/" prefetch={false} className="button-ghost mt-6 text-sm">
        <ArrowLeft className="size-4" />
        Kembali
      </Link>
    </div>
  );
}
