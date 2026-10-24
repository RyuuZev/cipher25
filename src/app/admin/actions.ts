"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getAdminUser } from "@/lib/auth";
import { getStudentById } from "@/lib/students";
import { FOTO_BUCKET } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { normalizeInstagramUrl } from "@/lib/utils";

export type StudentFormState = {
  error?: string;
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const studentSchema = z.object({
  nim: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "NIM harus terdiri dari 13 digit angka."),
  nama: z.string().trim().min(2, "Nama minimal 2 karakter."),
  prodi: z.string().trim().min(2, "Program studi wajib diisi."),
  fakultas: z.string().trim().min(2, "Fakultas wajib diisi."),
  angkatan: z.coerce
    .number()
    .int()
    .min(2000, "Angkatan tidak valid.")
    .max(2100, "Angkatan tidak valid."),
  ttl: z.string().trim().max(160, "TTL terlalu panjang.").optional(),
  instagram: z.string().trim().max(200, "URL Instagram terlalu panjang.").optional(),
});

async function ensureAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Sesi admin tidak valid. Silakan login ulang.");
  }
}

function revalidateStudent(nim?: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  if (nim) revalidatePath(`/profil/${nim}`);
}

async function uploadPhoto(nim: string, file: File) {
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Format foto harus JPG, PNG, atau WebP.");
  }

  const supabase = await createClient();
  const path = `${nim}.jpg`;
  const { error } = await supabase.storage
    .from(FOTO_BUCKET)
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: true,
      cacheControl: "31536000",
    });

  if (error) throw new Error(`Gagal upload foto: ${error.message}`);
  return path;
}

export async function saveStudent(
  _previous: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  let redirectTo: string | null = null;

  try {
    await ensureAdmin();

    const parsed = studentSchema.safeParse({
      nim: formData.get("nim"),
      nama: formData.get("nama"),
      prodi: formData.get("prodi"),
      fakultas: formData.get("fakultas"),
      angkatan: formData.get("angkatan"),
      ttl: formData.get("ttl") ?? "",
      instagram: formData.get("instagram") ?? "",
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message ?? "Data tidak valid.",
      };
    }

    const { nim, nama, prodi, fakultas, angkatan, ttl, instagram } = parsed.data;
    const id = String(formData.get("id") ?? "").trim();
    const supabase = await createClient();

    if (id) {
      const existing = await getStudentById(id);
      if (!existing) return { error: "Data mahasiswa tidak ditemukan." };
      if (existing.nim !== nim) {
        const duplicate = await supabase
          .from("students")
          .select("id")
          .eq("nim", nim)
          .neq("id", id)
          .maybeSingle();
        if (duplicate.data) {
          return { error: "NIM tersebut sudah dipakai mahasiswa lain." };
        }
      }
    }

    const photo = formData.get("foto");
    const newFile =
      photo instanceof File && photo.size > 0 && photo.name ? photo : null;

    let fotoPath: string | null | undefined;

    if (newFile) {
      fotoPath = await uploadPhoto(nim, newFile);
    }

    if (id) {
      const existing = await getStudentById(id);
      if (existing && existing.nim !== nim) {
        if (!newFile && existing.foto_path) {
          const { data: blob } = await supabase.storage
            .from(FOTO_BUCKET)
            .download(existing.foto_path);
          if (blob) {
            const { error: copyError } = await supabase.storage
              .from(FOTO_BUCKET)
              .upload(`${nim}.jpg`, await blob.arrayBuffer(), {
                contentType: blob.type || "image/jpeg",
                upsert: true,
              });
            if (copyError) {
              throw new Error(`Gagal memindahkan foto: ${copyError.message}`);
            }
            fotoPath = `${nim}.jpg`;
          }
        }
        if (existing.foto_path) {
          await supabase.storage.from(FOTO_BUCKET).remove([existing.foto_path]);
        }
      }
    }

    const payload = {
      nim,
      nama,
      prodi,
      fakultas,
      angkatan,
      ttl: ttl || null,
      instagram_url: normalizeInstagramUrl(instagram ?? ""),
      ...(fotoPath !== undefined ? { foto_path: fotoPath } : {}),
    };

    const { error } = id
      ? await supabase.from("students").update(payload).eq("id", id)
      : await supabase.from("students").insert(payload);

    if (error) {
      if (error.code === "23505") {
        return { error: "NIM tersebut sudah terdaftar." };
      }
      return { error: `Gagal menyimpan data: ${error.message}` };
    }

    revalidateStudent(nim);
    redirectTo = "/admin?saved=1";
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan.",
    };
  }

  if (redirectTo) redirect(redirectTo);
  return {};
}

export async function deleteStudent(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await ensureAdmin();

  const supabase = await createClient();
  const student = await getStudentById(id);

  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) {
    throw new Error(`Gagal menghapus data: ${error.message}`);
  }

  if (student?.foto_path) {
    await supabase.storage.from(FOTO_BUCKET).remove([student.foto_path]);
  }

  revalidateStudent(student?.nim);
  redirect("/admin?deleted=1");
}
