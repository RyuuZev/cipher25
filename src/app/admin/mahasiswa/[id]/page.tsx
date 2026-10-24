import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { StudentForm } from "@/components/admin/student-form";
import { getStudentById } from "@/lib/students";

export const dynamic = "force-dynamic";

type EditStudentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;

  let student = null;
  try {
    student = await getStudentById(id);
  } catch {
    student = null;
  }

  if (!student) notFound();

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
          {student.nama}
        </h1>
        <p className="mt-1 font-mono text-xs tracking-wider text-muted">
          {student.nim}
        </p>
      </div>

      <div className="mt-6">
        <StudentForm student={student} />
      </div>
    </div>
  );
}
