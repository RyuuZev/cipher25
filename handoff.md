# HANDOFF — CIPHER (Database Mahasiswa TI 2025)

Terakhir diperbarui: 25 Oktober 2026
Produksi: https://cipher-ti25.vercel.app
Repo lokal: `D:\Penyimpanan Utama\Documents\PROJEK\Website Database CIPHER` (git lokal `main`, tag `v1.0.0` di `fdacd45`; rilis `v1.1.0` di commit ini)

---

## 1. Ringkasan status

| Area | Status |
|---|---|
| Fitur inti (pencarian, profil, admin CRUD) | Selesai, live di produksi |
| Gerbang kode angkatan (`/masuk`) | Selesai; kode + secret sudah dirotasi di Vercel |
| Audit UI/UX (`impeccable`) | Detector 0 temuan di 7 halaman × 2 viewport |
| Tipografi | Geist diganti IBM Plex Sans + IBM Plex Mono; `overused-font` hilang |
| `npm run lint` / `typecheck` / `build` | Bersih (25 Oktober 2026) |
| Regresi admin (Playwright) | 10/10 lolos di produksi |
| Deploy terakhir | `vercel --prod` → `dpl_6HXeXHLqCKYL4kd1wGT1DtXBCSJ9` |
| Rilis | `v1.0.0` = state produksi sebelum polish; `v1.1.0` = polish kartu beranda |
| Version control | Git lokal `main`, tag `v1.0.0` & `v1.1.0`; perubahan terbaru sudah di-commit |
| Codebase Memory watcher | Aktif (session-managed); index 433 nodes / 804 edges; reindex 25 Oktober 2026; tools tetap disabled |

Catatan: `npx` rusak di mesin ini (`ECOMPROMISED`). Pakai `vercel` global, `node`, dan `npm run ...` langsung.

---

## 2. Fitur yang sudah selesai

### Publik (terkunci kode angkatan)
- **Pencarian mahasiswa** (`/`) — nama/NIM, debounce, empty state, hasil kartu; query disimpan di URL (`?q=`) dan dibawa ke `next` saat gate.
- **Profil mahasiswa** (`/profil/[nim]`) — foto, NIM, TTL, prodi, fakultas, angkatan, link Instagram; metadata netral saat terkunci; `noindex`.
- **Gerbang akses** (`/masuk`) — kode angkatan dari `CIPHER_ACCESS_CODE`, cookie `cipher_access` HttpOnly 7 hari, `?next=` aman, error inline yang mempertahankan input.
- **Halaman status** — `not-found` (Profil tidak ditemukan), `error` (Halaman gagal dimuat), `loading` profil.
- **SEO/ops** — `robots.ts` (disallow `/admin`, `/login`, `/masuk`, `/profil/`), `opengraph-image`, `twitter-image`, favicon SVG, `/api/keepalive` (cron Supabase).

### Admin (Supabase Auth)
- Login/logout (`/login`, `/admin`), proteksi route + `generateMetadata`.
- Daftar mahasiswa, tambah (`/admin/mahasiswa/baru`), edit (`/admin/mahasiswa/[id]`), hapus via dialog `<dialog>` (konten dirender hanya saat `open` → HTML 473KB → 355KB, h2 count 67 → 0).
- Form validasi + `useActionState`, foto upload ke Supabase Storage.

### Desain & aksesibilitas (Fase 1–3)
- Token semantik (0 utility palet mentah), 12px text floor, target sentuh 44px, `text-wrap: pretty/balance`, `tabular-nums`.
- North Star "The Cipher Terminal": satu aksen Signal Cyan <10%, elevation tonal, flat-at-rest, tanpa gradient text, tanpa halo/glow, tracking 2 tingkat (0.12em / 0.16em / wordmark 0.32em).
- Reduced-motion dihormati, blur gambar dimatikan ≤640px, suspense split di beranda.
- Dokumen acuan: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` (sudah disinkronkan dengan tipografi baru).

### Perbaikan sesi 25 Oktober 2026
- **Rotasi gerbang:** `CIPHER_ACCESS_SECRET` (64 hex) dan `CIPHER_ACCESS_CODE` (custom, case-insensitive) ditambahkan ke Vercel untuk Production, Preview, dan Development, juga ke `.env.local`. Kode default `ti25ulm` dan kode rotasi sebelumnya sudah ditolak; cookie lama otomatis invalid. Nilai kode aktual hanya ada di `.env.local` / dashboard Vercel, sengaja tidak ditulis di dokumen ini.
- **Copy & sesi `/masuk`:** placeholder dihapus, paragraf pembuka dan bantuan bawah dihapus, hint menjadi "Sesi ini terbuka selama 1 minggu", dan `ACCESS_MAX_AGE` dipangkas dari 30 ke 7 hari. Diverifikasi di produksi: cookie baru berlaku 7,00 hari, detector 0 temuan.
- **Gerbang fail-closed:** `access-core.ts` tidak lagi memakai kode/secret default di produksi. Bila `CIPHER_ACCESS_CODE` atau `CIPHER_ACCESS_SECRET` hilang, request gate gagal (bukan diam-diam membuka akses dengan kode publik). Fallback `ti25ulm` / `cipher-ti25-arsip` hanya aktif saat `NODE_ENV !== "production"`. Verifikasi pasca-deploy: cookie kode aktif `200`, cookie kode sebelumnya `307`, tanpa cookie `307`; input campuran huruf besar/kecil tetap diterima dan cookie berlaku 7,00 hari.
- **Tipografi:** Geist/Geist Mono → IBM Plex Sans (variable) + IBM Plex Mono (400/500/600/700). Alasan: Geist masuk daftar `overused-font` detector dan sebelumnya menempati 67–73% teks. IBM Plex adalah superfamily yang sama-sama terasa teknis/arsip, tetapi tidak masuk daftar tersebut.
- **Dialog hapus:** reset state memakai listener `close` native pada `<dialog>` (bukan hanya `onClose` sintetis React); tombol Batal menutup dialog lalu `setOpen(false)`. Dialog bisa dibuka ulang setelah Escape, dan kontennya benar-benar dilepas.
- **Regresi admin produksi:** login, tabel 67 baris, dialog (h2 tunggal, fokus awal Batal), form tambah, pencarian, edit+simpan, hapus — semua lolos. Data uji `2000000000001` dibersihkan via service role.
- **Verifikasi visual:** font terpasang (`IBM Plex Sans`/`IBM Plex Mono`), 0 horizontal overflow pada 1440×900 dan 390×844 untuk beranda, profil, login, masuk.
- **Watcher Codebase Memory:** `watcher_enabled`, `auto_watch`, dan `watch_non_git` diaktifkan (project ini sudah menjadi git repo lokal). `opencode.json` level proyek meng-enable MCP hanya untuk watcher, sementara `tools` tetap `false`. `.cbmignore` mengecualikan `.agents/`, `.opencode/`, `.next/`, `node_modules/`, `.vercel/`, `Foto/`, CSV PII, dan `.env*`, sehingga reindex otomatis turun dari 6.074 node/12.541 edge menjadi 436 node/800 edge; reindex manual berikutnya menghasilkan 433 node/804 edge. Daemon berjalan `session-managed`, watcher `tree` poll 5 detik; reindex manual 25 Oktober 2026 selesai `ready`. Watcher hanya hidup selama sesi opencode/daemon berjalan; config dibaca saat startup.
- **Reindex manual:** 433 nodes / 804 edges, status `ready`; 1 file parse parsial (`supabase/schema.sql`), 0 unusable/skipped; 7 direktori/12 file tidak diindeks; doc links 17 (2 ambigu, 8 below tier).
- **Homepage & logo:** kartu bawah diganti **Filosofi CIPHER** (4 poin) dan **Profil Akademik**; logo header diganti emblem dari `cipher25.jpe` (crop + background transparan → `public/cipher-mark.webp`, tampil 55×44); footer menjadi "Dikelola oleh RyuuZev" dengan tautan ke GitHub.
- **Polish kartu beranda:** teks abu-abu di Filosofi/Profil → `text-zinc-300`; padding `p-8 sm:p-10`; border `border-white/10`; deskripsi hero `leading-7 sm:leading-8`. Diverifikasi di 1440×900 dan 390×844.
- **Rilis:** `v1.0.0` (commit `fdacd45`) menandai state produksi sebelum polish; `v1.1.0` menandai polish kartu + deploy `dpl_6HXeXHLqCKYL4kd1wGT1DtXBCSJ9`. `package.json`/`package-lock.json` diset ke 1.1.0.

---

## 3. File yang dibuat / diubah

### Sesi ini
- `src/app/layout.tsx` — import & variable `IBM_Plex_Sans` / `IBM_Plex_Mono` (`--font-plex-*`).
- `src/app/globals.css` — `--font-sans` / `--font-mono` dan `body` memakai Plex.
- `src/components/admin/delete-student-button.tsx` — listener `close` native + tutup eksplisit di Batal.
- `src/lib/access-core.ts` — fallback kode/secret hanya untuk non-produksi; produksi fail-closed; `ACCESS_MAX_AGE` 7 hari.
- `src/app/masuk/page.tsx`, `src/app/masuk/access-form.tsx` — copy dirapikan, placeholder dihapus, hint sesi 1 minggu.
- `DESIGN.md` — frontmatter & narasi tipografi (Geist → IBM Plex; alasan pemilihan).
- `.impeccable/design.json` — seluruh CSS contoh memakai IBM Plex; `generatedAt` 2026-10-25.
- `.env.local.example` — placeholder kode tidak lagi `ti25ulm`.
- `.env.local` — `CIPHER_ACCESS_CODE`, `CIPHER_ACCESS_SECRET` (lokal, jangan commit).
- Vercel env — dua variabel di atas untuk ketiga environment.
- `opencode.json` — enable MCP Codebase Memory khusus project ini untuk watcher; semua tool MCP tetap `false`.
- `.cbmignore` — exclusion watcher/index untuk tooling, build, PII, dan env.
- `.gitignore` — tambah exclusion `.agents/` dan `.opencode/` agar repo tidak membengkak ±70 MB.
- `src/app/page.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx` — konten Filosofi/Profil Akademik, logo header, tautan footer.
- `public/cipher-mark.webp` — emblem header transparan hasil crop dari `cipher25.jpe` (199×160, 27.398 byte).
- `cipher25.jpe` — sumber logo asli 640×640; sudah di-commit di v1.0.0.
- `package.json`, `package-lock.json` — versi rilis 1.1.0.

### Sesi sebelumnya (masih relevan)
- `src/lib/access-core.ts`, `src/lib/access.ts`, `src/app/masuk/{page.tsx,access-form.tsx,actions.ts}` — gate.
- `src/proxy.ts` — gate `/` + `/profil/*`; Supabase Auth hanya `/admin`.
- `src/components/**`, `src/app/**` — `prefetch={false}` lintas gate, token desain, dialog kondisional.
- `PRODUCT.md`, `README.md`, `.env.local.example` — batas keamanan ("filter, bukan autentikasi").

---

## 4. Next Steps (spesifik)

1. **Bagikan kode akses baru ke angkatan.**
   Kode ada di `.env.local` (`CIPHER_ACCESS_CODE`) dan dashboard Vercel (Secret). Jangan tulis kode di dokumen yang dibagikan publik. Jika kode perlu dirotasi lagi:
   ```powershell
   vercel env add CIPHER_ACCESS_SECRET production --value "<acak 32+ byte>" --yes --sensitive --force
   vercel env add CIPHER_ACCESS_CODE production --value "<kode baru>" --yes --force
   vercel --prod --yes
   ```
   Konsekuensi: semua cookie lama invalid, semua pengguna harus memasukkan kode baru.

2. **Hitung ulang skor audit penuh (opsional).**
   Detector sudah 0 temuan; skor 15/20 yang lama belum diukur ulang. Jalankan `/impeccable audit` bila ingin memperbarui skor dan ringkasan. Target detector tetap ≤1 temuan per halaman.

3. **Pertimbangkan regresi admin permanen.**
   Skrip Playwright sementara sudah dihapus setelah lolos 10/10. Bila ingin regression suite permanen, tambahkan `playwright` sebagai devDependency dan pindahkan alur (login → tabel → dialog → CRUD uji → cleanup) ke `scripts/`.

4. **Housekeeping rutin.**
   Folder temp `C:\Users\Axioo\AppData\Local\Temp\opencode\` sudah dibersihkan dari probe sesi ini (`gate-*`, `admin-check`, `audit-cdp`, `visual-check`, screenshot, `recover`, `audit-profile`). File lama milik proyek lain tidak disentuh.

5. **Watcher Codebase Memory sudah aktif.**
   Daemon `active (session-managed)`, watcher `tree` poll 5 detik, index `433/804` `ready`. Tidak perlu restart selama sesi ini. Saat opencode ditutup, watcher ikut berhenti; sesi baru akan memulainya lagi lewat config project. Jika tidak aktif, jalankan ulang skrip indexing; jangan panggil tool MCP.

---

## 5. Jebakan yang sudah ditemukan (jangan diulang)

- **Prefetch route terkunci**: `Link href="/"` dari halaman ber-gate membuat request RSC memantul 307 ke `/masuk` dan tidak pernah selesai → `waitUntil: "networkidle"` timeout. Selalu `prefetch={false}` untuk tautan lintas gate.
- **`max-w-[62ch]` menipu di Geist 12px** (1ch ≈ 7,96px → ±88 karakter). Pakai rem: `26rem` ≈ 75 karakter. Untuk IBM Plex, tetap verifikasi dengan pengukuran, jangan asumsi `ch`.
- **PowerShell**: `$HOME` read-only; pakai `-LiteralPath` untuk path ber-`[ ]`; jangan merangkai banyak `-replace` dalam satu baris. Edit file lewat tool edit/write, bukan regex massal.
- **`vercel env add --environment`**: argumen berkoma harus dikutip (`"production,preview,development"`); tanpa kutip PowerShell mengubahnya menjadi array dan CLI menolak environment.
- **`npx` rusak** (`ECOMPROMISED`); `vercel` global tersedia.
- **Detector URL scan tidak punya opsi cookie** dan menolak halaman 404. Untuk `/`, `/profil/*`, `/admin`, dan `/tidak-ada`, pakai Chromium dengan `--remote-debugging-port`, login/set cookie, lalu `impeccable detect --cdp <port> --target <path> --json` (halaman dipindai apa adanya; jangan lupa set viewport lewat browser).
- **Detector butuh `networkidle`**; bila ada request menggantung, deteksi akan `Navigation timeout of 30000 ms`.
- **Uji dialog**: setelah Escape/close, tunggu konten `<dialog>` benar-benar dilepas sebelum menghitung `h2`. Assertion langsung setelah atribut `open` hilang bisa menangkap frame sebelum React menyelesaikan render.
- **Auth admin** untuk uji lokal: `node --env-file=.env.local` (jangan pernah commit `.env.local`; mesin ini juga menyimpan `SUPABASE_SERVICE_ROLE_KEY`).
