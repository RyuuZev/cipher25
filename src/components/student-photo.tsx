import Image from "next/image";

import { fotoPublicUrl } from "@/lib/supabase/config";
import type { Student } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

type StudentPhotoProps = {
  student: Pick<Student, "nama" | "foto_path">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: string;
  decorative?: boolean;
};

export function StudentPhoto({
  student,
  className,
  sizes = "(max-width: 768px) 100vw, 320px",
  priority = false,
  rounded = "rounded-2xl",
  decorative = false,
}: StudentPhotoProps) {
  const src = fotoPublicUrl(student.foto_path);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-2",
        rounded,
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={decorative ? "" : `Foto ${student.nama}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_60%)]">
          <span className="font-mono text-xl font-semibold tracking-[0.2em] text-neon-soft">
            {initials(student.nama)}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/50 to-transparent" />
    </div>
  );
}
