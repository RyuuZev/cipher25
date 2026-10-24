import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { StudentForm } from "@/components/admin/student-form";

export const dynamic = "force-dynamic";

export default function NewStudentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="hit-target inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-neon-soft"
      >
        <ArrowLeft className="size-3.5" />
        Kembali ke daftar
      </Link>

      <div className="mt-5">
        <h1 className="text-2xl font-semibold text-fg">
          Tambah mahasiswa
        </h1>
        <p className="mt-1 text-sm text-muted">
          NIM harus unik dan terdiri dari 13 digit.
        </p>
      </div>

      <div className="mt-6">
        <StudentForm />
      </div>
    </div>
  );
}
