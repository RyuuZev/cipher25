import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";

const CSV_FILE = "Informasi Angkatan TI 25 - DB.csv";
const FOTO_DIR = "Foto";
const BUCKET = "foto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi di .env.local.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function normalizeName(value) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeKey(value) {
  return normalizeName(value).toLowerCase();
}

function fixTtl(value) {
  const ttl = normalizeName(value ?? "");
  return ttl.replace(/(\d{1,2}\s+\S+\s+)206$/, "$12006");
}

function normalizeInstagram(value) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `https://www.instagram.com/${handle}/`;
}

const photoAliases = {
  [normalizeKey("Abdurrazak")]: "Abdurazzak.jpg",
  [normalizeKey("Jesica Olivia Putri")]: "Jessica Olivia.jpg",
};

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) throw new Error(`Gagal membaca bucket: ${error.message}`);

  if (buckets?.some((bucket) => bucket.id === BUCKET)) return;

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  if (createError) {
    throw new Error(`Gagal membuat bucket: ${createError.message}`);
  }
  console.log(`Bucket "${BUCKET}" dibuat.`);
}

async function ensureAdmin() {
  if (!adminEmail || !adminPassword) {
    console.log("ADMIN_EMAIL/ADMIN_PASSWORD kosong, lewati pembuatan admin.");
    return;
  }

  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw new Error(`Gagal membaca user: ${error.message}`);

  let user = data.users.find(
    (item) => item.email?.toLowerCase() === adminEmail.toLowerCase(),
  );

  if (!user) {
    const { data: created, error: createError } =
      await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });
    if (createError) {
      throw new Error(`Gagal membuat admin: ${createError.message}`);
    }
    user = created.user;
    console.log(`User admin dibuat: ${adminEmail}`);
  } else {
    console.log(`User admin sudah ada: ${adminEmail}`);
  }

  const { error: insertError } = await supabase
    .from("admin_users")
    .upsert({ user_id: user.id }, { onConflict: "user_id" });

  if (insertError) {
    throw new Error(`Gagal mendaftarkan admin: ${insertError.message}`);
  }
  console.log("Admin terdaftar di tabel admin_users.");
}

async function main() {
  const csvPath = path.resolve(process.cwd(), CSV_FILE);
  const fotoPath = path.resolve(process.cwd(), FOTO_DIR);

  if (!fs.existsSync(csvPath)) throw new Error(`CSV tidak ditemukan: ${csvPath}`);
  if (!fs.existsSync(fotoPath)) throw new Error(`Folder Foto tidak ditemukan`);

  await ensureBucket();

  const rows = parse(fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, ""), {
    columns: true,
    skip_empty_lines: true,
    trim: false,
    relax_column_count: true,
  });

  const files = fs.readdirSync(fotoPath);
  const fileByKey = new Map(
    files.map((file) => [
      normalizeKey(path.parse(file).name),
      file,
    ]),
  );

  let uploaded = 0;
  let inserted = 0;
  const failures = [];
  const missingPhotos = [];

  for (const [index, row] of rows.entries()) {
    const nim = (row.nim ?? "").trim();
    const nama = normalizeName(row.nama ?? "");
    const label = `${index + 1}/${rows.length} ${nim} ${nama}`;

    try {
      const key = normalizeKey(nama);
      const fileName =
        fileByKey.get(key) ?? photoAliases[key] ?? null;

      let fotoPathValue = null;

      if (!fileName) {
        missingPhotos.push(`${nim} ${nama}`);
      } else {
        const absolutePhoto = path.join(fotoPath, fileName);
        const buffer = fs.readFileSync(absolutePhoto);
        fotoPathValue = `${nim}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fotoPathValue, buffer, {
            contentType: "image/jpeg",
            upsert: true,
            cacheControl: "31536000",
          });

        if (uploadError) throw new Error(`upload: ${uploadError.message}`);
        uploaded += 1;
      }

      const { error: upsertError } = await supabase.from("students").upsert(
        {
          nim,
          nama,
          prodi: normalizeName(row.prodi ?? "Teknologi Informasi"),
          fakultas: normalizeName(row.fakultas ?? "Teknik"),
          angkatan: Number.parseInt(row.angkatan ?? "2025", 10),
          ttl: fixTtl(row.ttl),
          motto: normalizeName(row.motto_hidup ?? "") || null,
          instagram_url: normalizeInstagram(row.sosmed),
          foto_path: fotoPathValue,
        },
        { onConflict: "nim" },
      );

      if (upsertError) throw new Error(`database: ${upsertError.message}`);
      inserted += 1;

      if ((index + 1) % 10 === 0) console.log(`... ${label}`);
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }

  await ensureAdmin();

  console.log("\n=== Ringkasan Import ===");
  console.log(`Baris CSV      : ${rows.length}`);
  console.log(`Data tersimpan : ${inserted}`);
  console.log(`Foto di-upload : ${uploaded}`);
  console.log(`Foto tidak ada : ${missingPhotos.length}`);
  console.log(`Gagal          : ${failures.length}`);

  if (missingPhotos.length) {
    console.log("\nTanpa foto:");
    missingPhotos.forEach((item) => console.log(`- ${item}`));
  }

  if (failures.length) {
    console.log("\nGagal:");
    failures.forEach((item) => console.log(`- ${item}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`\nImport gagal: ${error.message}`);
  process.exit(1);
});
