"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="surface mx-auto max-w-lg rounded-3xl p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-warning/20 bg-warning/10 text-warning-text">
        <TriangleAlert className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold text-fg">
        Gagal memuat data
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Data admin belum bisa ditampilkan. Coba lagi atau kembali ke daftar
        mahasiswa.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="button-primary text-sm">
          Coba lagi
        </button>
        <Link href="/admin" className="button-ghost text-sm">
          Kembali ke daftar
        </Link>
      </div>
    </div>
  );
}
