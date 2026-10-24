"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";

import {
  saveStudent,
  type StudentFormState,
} from "@/app/admin/actions";
import { StudentPhoto } from "@/components/student-photo";
import type { Student } from "@/lib/types";

const initialState: StudentFormState = {};

export function StudentForm({ student }: { student?: Student }) {
  const [state, action, pending] = useActionState(saveStudent, initialState);

  return (
    <form
      action={action}
      className="space-y-6"
      encType="multipart/form-data"
      aria-busy={pending}
    >
      {student ? <input type="hidden" name="id" value={student.id} /> : null}

      <div className="surface rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-fg">Identitas</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nim" className="label">
              NIM
            </label>
            <input
              id="nim"
              name="nim"
              required
              inputMode="numeric"
              pattern="\d{13}"
              maxLength={13}
              defaultValue={student?.nim ?? ""}
              placeholder="2510817110001"
              className="input font-mono tracking-wider"
            />
          </div>

          <div>
            <label htmlFor="nama" className="label">
              Nama lengkap
            </label>
            <input
              id="nama"
              name="nama"
              required
              defaultValue={student?.nama ?? ""}
              placeholder="Nama mahasiswa"
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ttl" className="label">
              Tempat, tanggal lahir
            </label>
            <input
              id="ttl"
              name="ttl"
              defaultValue={student?.ttl ?? ""}
              placeholder="Banjarmasin, 1 Januari 2007"
              className="input"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="instagram" className="label">
              Instagram
            </label>
            <input
              id="instagram"
              name="instagram"
              defaultValue={student?.instagram_url ?? ""}
              placeholder="https://www.instagram.com/username/ atau @username"
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="surface rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-fg">Akademik</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="prodi" className="label">
              Program studi
            </label>
            <input
              id="prodi"
              name="prodi"
              required
              defaultValue={student?.prodi ?? "Teknologi Informasi"}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="fakultas" className="label">
              Fakultas
            </label>
            <input
              id="fakultas"
              name="fakultas"
              required
              defaultValue={student?.fakultas ?? "Teknik"}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="angkatan" className="label">
              Angkatan
            </label>
            <input
              id="angkatan"
              name="angkatan"
              type="number"
              required
              min={2000}
              max={2100}
              defaultValue={student?.angkatan ?? 2025}
              className="input font-mono"
            />
          </div>
        </div>
      </div>

      <div className="surface rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-fg">Foto profil</h2>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          {student ? (
            <StudentPhoto
              student={student}
              className="size-24 shrink-0"
              sizes="96px"
              rounded="rounded-xl"
            />
          ) : null}

          <div className="flex-1">
            <label htmlFor="foto" className="label">
              {student ? "Ganti foto (opsional)" : "Upload foto (opsional)"}
            </label>
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-describedby="foto-hint"
              className="block min-h-11 w-full cursor-pointer rounded-xl border border-line bg-ink/70 px-3 py-2.5 text-xs text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-neon/15 file:px-3 file:py-1.5 file:text-xs file:text-neon-soft"
            />
            <p id="foto-hint" className="mt-2 text-xs text-muted">
              JPG/PNG/WebP, maksimal 5 MB. Nama file otomatis mengikuti NIM.
            </p>
          </div>
        </div>
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger-text"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="button-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {pending ? "Menyimpan..." : student ? "Simpan perubahan" : "Tambah mahasiswa"}
        </button>
        <Link href="/admin" className="button-ghost text-sm">
          Batal
        </Link>
      </div>
    </form>
  );
}
