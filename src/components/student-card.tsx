import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { StudentPhoto } from "@/components/student-photo";
import type { Student } from "@/lib/types";

export function StudentCard({ student }: { student: Student }) {
  return (
    <Link
      href={`/profil/${student.nim}`}
      className="surface surface-hover group flex items-center gap-4 rounded-2xl p-3"
    >
      <StudentPhoto
        student={student}
        className="size-16 shrink-0 sm:size-20"
        sizes="80px"
        rounded="rounded-xl"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fg group-hover:text-neon-soft">
          {student.nama}
        </p>
        <p className="mt-1 font-mono text-xs tracking-wider text-muted">
          {student.nim}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">
          {student.prodi} · {student.angkatan}
        </p>
      </div>
      <ArrowUpRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-neon" />
    </Link>
  );
}
