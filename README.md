# CIPHER — Database TI 2025

Website database mahasiswa Teknologi Informasi angkatan 2025. Publik dapat mencari profil berdasarkan NIM atau nama; admin dapat menambah, mengubah, dan menghapus data.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- Vercel

## Setup

1. Isi kredensial di `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...
```

2. Jalankan `supabase/schema.sql` di **Supabase Dashboard → SQL Editor**. File ini membuat tabel, RLS, RPC pencarian, trigger, dan bucket `foto`.

3. Import 67 data dari CSV beserta foto:

```bash
npm run import
```

Script akan:
- membersihkan spasi pada nama dan memperbaiki typo TTL,
- mencocokkan foto yang ejaannya berbeda,
- meng-upload foto ke Supabase Storage sebagai `{nim}.jpg`,
- membuat akun admin dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` (jika diisi) dan mendaftarkannya di `admin_users`.

4. Jalankan aplikasi:

```bash
npm run dev
```

## Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run import` | Import CSV + foto |

## Kode angkatan

Pencarian publik dijaga kode angkatan. Alur:

1. Beranda dan halaman profil mengalihkan ke `/masuk` bila perangkat belum punya cookie akses.
2. Kode dicocokkan di server; bila benar, cookie `cipher_access` (HttpOnly, 7 hari) dipasang.
3. Setelah itu pencarian dan profil terbuka normal.

Variabel yang dibutuhkan:

```env
CIPHER_ACCESS_CODE=kode-angkatan-baru
CIPHER_ACCESS_SECRET=random-string-panjang-lain
```

`CIPHER_ACCESS_SECRET` dipakai untuk menurunkan nilai cookie, jadi cookie tidak berisi kode aslinya. Ganti secret = semua perangkat harus memasukkan kode ulang.

**Batasnya:** ini penyaring, bukan autentikasi. Anon key bersifat publik, jadi seseorang yang memanggil RPC `search_students` langsung masih bisa melewati gerbang. Penegakan sejati butuh parameter kode di RPC dan pengecekan di Postgres.

## Keep-alive Supabase

Supabase free bisa di-pause setelah beberapa hari tanpa aktivitas. Endpoint `GET /api/keepalive` menjalankan query ringan ke tabel `students` sekali sehari melalui Vercel Cron (`0 1 * * *` = 09:00 WITA).

Endpoint dilindungi header:

```http
Authorization: Bearer <CRON_SECRET>
```

Set `CRON_SECRET` di `.env.local` saat lokal dan di Environment Variables Vercel saat deploy. Uji lokal:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/keepalive
```

## Deploy Vercel

Set environment variables berikut di Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`
- `CIPHER_ACCESS_CODE`
- `CIPHER_ACCESS_SECRET`

`ADMIN_EMAIL`/`ADMIN_PASSWORD` hanya diperlukan saat import pertama, tidak perlu dipasang di Vercel.

## Keamanan

- Tabel `students` tidak bisa dibaca langsung oleh anon. Publik hanya bisa lewat RPC `search_students` dan `get_student`.
- Operasi tulis hanya untuk user yang terdaftar di `admin_users`.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai script import di server, tidak pernah dikirim ke browser.
- `Foto/`, CSV, dan `.env*` di-ignore dari git.
