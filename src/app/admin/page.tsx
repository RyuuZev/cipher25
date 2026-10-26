import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Pencil,
  Plus,
  Search,
  TriangleAlert,
  Users,
} from "lucide-react";

import { DeleteStudentButton } from "@/components/admin/delete-student-button";
import { InstagramIcon } from "@/components/icons";
import { StudentPhoto } from "@/components/student-photo";
import {
  getStudentStats,
  listStudents,
  type StudentStats,
} from "@/lib/students";
import type { Student } from "@/lib/types";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    saved?: string | string[];
    deleted?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (rawQuery ?? "").trim();

  let students: Student[] = [];
  let stats: StudentStats | null = null;
  let error: string | null = null;

  try {
    [students, stats] = await Promise.all([
      listStudents(query),
      getStudentStats(),
    ]);
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Gagal memuat data.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-fg sm:text-3xl">
            Direktori mahasiswa
          </h1>
          <p className="mt-1 text-sm text-muted">
            Tambah, ubah, atau hapus profil angkatan CIPHER.
          </p>
        </div>
        <Link href="/admin/mahasiswa/baru" className="button-primary text-sm">
          <Plus className="size-4" />
          Tambah mahasiswa
        </Link>
      </div>

      {params.saved ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-xs text-success-text"
        >
          <CheckCircle2 className="size-4" />
          Data berhasil disimpan.
        </p>
      ) : null}

      {params.deleted ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-xs text-success-text"
        >
          <CheckCircle2 className="size-4" />
          Data berhasil dihapus.
        </p>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="surface flex items-start gap-3 rounded-2xl p-4 text-sm"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning-text" />
          <div>
            <p className="font-medium text-fg">Database belum siap</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{error}</p>
            <p className="mt-2 text-xs text-muted">
              Jalankan <span className="font-mono text-fg-subtle">supabase/schema.sql</span>{" "}
              di SQL Editor Supabase, lalu refresh halaman ini.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary
          icon={<Users className="size-4" />}
          label="Total mahasiswa"
          value={stats ? String(stats.total) : "—"}
        />
        <Summary
          icon={<Camera className="size-4" />}
          label="Punya foto"
          value={stats ? String(stats.withPhoto) : "—"}
        />
        <Summary
          icon={<InstagramIcon className="size-4" />}
          label="Punya Instagram"
          value={stats ? String(stats.withInstagram) : "—"}
        />
      </div>

      <div className="surface rounded-2xl p-2">
        <form action="/admin" method="get" className="flex items-center gap-2 px-2">
          <Search className="size-4 shrink-0 text-neon/70" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Cari NIM atau nama..."
            aria-label="Cari NIM atau nama mahasiswa"
            className="min-h-11 w-full bg-transparent py-2.5 text-sm text-fg placeholder:text-muted"
          />
          <button type="submit" className="button-ghost text-xs">
            Cari
          </button>
        </form>
        {query ? (
          <p role="status" className="px-2 pb-2 pt-1 text-xs text-muted">
            {students.length} hasil untuk &ldquo;{query}&rdquo;.
          </p>
        ) : null}
      </div>

      <div className="surface overflow-hidden rounded-2xl">
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Tabel mahasiswa"
        >
          <table className="w-full min-w-[0] text-left text-sm">
            <caption className="sr-only">
              Daftar mahasiswa angkatan CIPHER
              {query ? `, hasil pencarian "${query}"` : ""}
            </caption>
            <thead>
              <tr className="border-b border-line/80 text-xs uppercase tracking-[0.16em] text-muted">
                <th scope="col" className="px-4 py-3 font-medium">Mahasiswa</th>
                <th scope="col" className="px-4 py-3 font-medium">NIM</th>
                <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">TTL</th>
                <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">Angkatan</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted">
                    {query
                      ? "Tidak ada mahasiswa yang cocok dengan pencarian."
                      : "Belum ada data. Import CSV atau tambah manual."}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-line/50 last:border-0 hover:bg-overlay/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StudentPhoto
                          student={student}
                          className="size-10 shrink-0"
                          sizes="40px"
                          rounded="rounded-lg"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-fg">
                            {student.nama}
                          </p>
                          <p className="text-xs text-muted">
                            {student.prodi}
                            <span className="sm:hidden"> · {student.angkatan}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tracking-wider text-muted">
                      {student.nim}
                    </td>
                    <td className="hidden max-w-[220px] truncate px-4 py-3 text-xs text-muted sm:table-cell">
                      {student.ttl ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted sm:table-cell">
                      {student.angkatan}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/mahasiswa/${student.id}`}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-neon/20 bg-neon/10 px-3 text-xs text-neon-soft transition-colors hover:border-neon/40 hover:bg-neon/15"
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Link>
                        <DeleteStudentButton id={student.id} nama={student.nama} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Summary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface flex items-center gap-3 rounded-2xl p-4">
      <span className="grid size-10 place-items-center rounded-xl border border-neon/20 bg-neon/10 text-neon-soft">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {label}
        </p>
        <p className="mt-1 font-mono text-xl font-semibold text-fg">
          {value}
        </p>
      </div>
    </div>
  );
}
