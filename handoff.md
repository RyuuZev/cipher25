# HANDOFF — CIPHER (Database Mahasiswa TI 2025)

Terakhir diperbarui: 26 Oktober 2026
Status: **v1.2.1 deployed & di-push** — temuan audit P1/P2/P3 sudah diperbaiki, bug pencarian produksi ("Database belum siap" / "requested path is invalid") sudah dibereskan dan diverifikasi render server-side. Remote `origin` = `https://github.com/RyuuZev/cipher25`.
Produksi: https://cipher-ti25.vercel.app
Repo lokal: `D:\Penyimpanan Utama\Documents\PROJEK\Website Database CIPHER` (git lokal `main` tracking `origin/main`; tag `v1.0.0`, `v1.1.0`, `v1.1.1`, `v1.2.0`, `v1.2.1`; remote `https://github.com/RyuuZev/cipher25`)

---

## 1. Ringkasan status

| Area | Status |
|---|---|
| Status proyek | **v1.1.1 deployed**; menunggu rencana berikutnya |
| Fitur inti (pencarian, profil, admin CRUD) | Selesai, live di produksi |
| Gerbang kode angkatan (`/masuk`) | Selesai; kode + secret sudah dirotasi di Vercel |
| Audit UI/UX (`impeccable`) | Detector 0 temuan di 7 halaman × 2 viewport; **bukan bukti bebas isu** — audit manual menemukan P1/P2 (lihat §2a) |
| Audit UI/UX manual (produksi) | Selesai 25 Oktober 2026; temuan terdokumentasi, **belum diperbaiki** |
| Tipografi | Geist diganti IBM Plex Sans + IBM Plex Mono; `overused-font` hilang |
| `npm run lint` / `typecheck` / `build` | Bersih (25 Oktober 2026) |
| Regresi admin (Playwright) | 10/10 lolos di produksi |
| Deploy terakhir | `vercel --prod` → `dpl_CQKRWUZKLbwniLK4cquSQ6aTjWHn` (alias `https://cipher-ti25.vercel.app`) |
| Rilis | `v1.0.0` = state produksi sebelum polish; `v1.1.0` = polish kartu beranda; `v1.1.1` = pemangkasan copy beranda + login (commit `abfae27`, tag `v1.1.1`, deployed) |
| Version control | Remote `origin` = `https://github.com/RyuuZev/cipher25`; `main` sudah di-push (merge `9d56ef7` dengan `Initial commit` remote; README lokal dipertahankan, LICENSE dari remote diambil); semua tag `v1.0.0`–`v1.2.1` sudah di-push |
| Codebase Memory watcher | Aktif (`git`, poll 5 dtk); index **436 nodes / 821 edges**, reindex 25 Oktober 2026 07:20 UTC, status `ready`; tools MCP tetap tidak dipakai |

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
- **Watcher Codebase Memory:** `watcher_enabled`, `auto_watch`, dan `watch_non_git` diaktifkan (project ini sudah menjadi git repo lokal). `opencode.json` level proyek meng-enable MCP hanya untuk watcher; `tools` seharusnya `false` (working tree saat ini `true`, lihat §3). `.cbmignore` mengecualikan `.agents/`, `.opencode/`, `.next/`, `node_modules/`, `.vercel/`, `Foto/`, CSV PII, dan `.env*`, sehingga reindex otomatis turun dari 6.074 node/12.541 edge menjadi 436 node/800 edge; reindex manual terakhir menghasilkan **436 node/821 edge**. Daemon berjalan `session-managed`, watcher `git` poll 5 detik; reindex manual 25 Oktober 2026 07:20 UTC selesai `ready`. Watcher hanya hidup selama sesi opencode/daemon berjalan; config dibaca saat startup.
- **Reindex manual:** 436 nodes / 821 edges, status `ready`; 1 file parse parsial (`supabase/schema.sql`), 0 unusable/skipped; 7 direktori/12 file tidak diindeks; doc links 29 (2 ambigu, 12 below tier).
- **Homepage & logo:** kartu bawah diganti **Filosofi CIPHER** (4 poin) dan **Profil Akademik**; logo header diganti emblem dari `cipher25.jpe` (crop + background transparan → `public/cipher-mark.webp`, tampil 55×44); footer menjadi "Dikelola oleh RyuuZev" dengan tautan ke GitHub.
- **Polish kartu beranda:** teks abu-abu di Filosofi/Profil → `text-zinc-300`; padding `p-8 sm:p-10`; border `border-white/10`; deskripsi hero `leading-7 sm:leading-8`. Diverifikasi di 1440×900 dan 390×844.
- **Rilis:** `v1.0.0` (commit `fdacd45`) menandai state produksi sebelum polish; `v1.1.0` menandai polish kartu + deploy `dpl_6HXeXHLqCKYL4kd1wGT1DtXBCSJ9`. `package.json`/`package-lock.json` diset ke 1.1.0.

---

## 2a. Audit UI/UX manual — 25 Oktober 2026 (temuan, belum diperbaiki)

Audit read-only di produksi (1440×900, 768×1024, 390×844, 320×700), publik + admin setelah login. Tidak ada kode aplikasi yang diubah; produksi tetap v1.1.0.

**P1 — prioritas**
1. **Overflow query panjang.** `/?q=` 300 karakter menghasilkan `scrollWidth` ±3.301px pada viewport 390px dan ±3.448px pada desktop. `<h2>` menampilkan query mentah tanpa pemenggalan (`src/app/page.tsx:109`); input belum dibatasi `maxLength`.
2. **Nama aksesibel hilang.** Link eksternal "Lihat situs" di header admin mobile hanya ikon; teks `hidden sm:inline`, AX tree tidak punya nama (`src/app/admin/layout.tsx:62-65`).
3. **Batas privasi.** Gate hanya UI. Anon key dapat memanggil `search_students`/`get_student` dan bucket foto publik; verifikasi grant `EXECUTE` di `supabase/schema.sql:126` dan akses publik `:171`. Ini risiko data pribadi, bukan sekadar UI.

**P2 — UX**
4. **404 salah konteks.** `/halaman-tidak-ada` menampilkan copy "Profil tidak ditemukan / NIM yang kamu masukkan…" dan title beranda (`src/app/not-found.tsx:19`).
5. **Profil mobile.** Foto ID card ±415px mendominasi layar; nama baru muncul di `y≈658` dari viewport 844px.
6. **Target sentuh.** `RyuuZev` ±47,7×15px (`src/components/site-footer.tsx:16`); clear search ±37,9×44px, mengecil ke ±30,6×44px di 320px (`src/components/search-form.tsx:35`).
7. **Copy internal.** Pesan error menyebut "skema database", ".env.local", "konfigurasi Supabase" (`src/app/page.tsx:66,98`).
8. **Hierarki login.** "Panel pengurus" 30px lebih menonjol daripada "Masuk sebagai admin" 20px; kartu kiri banyak ruang kosong (`src/app/login/page.tsx:52-80`).
9. **Admin mobile.** Tabel ±976px di area ±356px; aksi di luar layar; container scroll tidak fokusable/labeled; tabel tanpa caption/`scope` (`src/app/admin/page.tsx:144-154`).
10. **Loop `/masuk`.** Logo dan "Cari" menuju `/` yang redirect balik ke `/masuk`; tidak ada bantuan recovery kode.

**P3 — aksesibilitas kecil**
11. Hint search belum `aria-describedby`; nama link kartu mengulang "Foto … Nama … NIM …".
12. `prefers-reduced-motion` masih memakai animasi `breathe` 1,8 dtk untuk pulse/spin (`src/app/globals.css:265`).

**Yang sudah baik:** tanpa overflow di halaman normal 320–1440; kontras muted ±6,2:1; skip-link bekerja; focus ring dan dialog hapus baik; CLS 0; LCP warm 0,8–1,4 dtk; TTFB warm 70–130ms (cold sempat 1,2–4,6 dtk). Screenshot dan profil Chrome sementara sudah dibersihkan.

**Catatan:** detector `impeccable` 0 temuan tidak menangkap isu di atas (overflow query, accessible name, konteks copy, hierarki mobile).

---

## 2b. Sesi v1.2.1 — perbaikan audit + bug pencarian produksi (26 Oktober 2026)

**Perbaikan audit P1-P3 (commit `5523565`, tag `v1.2.0`)**
- P1-1 overflow query panjang: `<h2>` query dipenggal (`truncate` + `max-w`), input dibatasi `maxLength`.
- P1-2 nama aksesibel link admin mobile: `aria-label` ditambahkan.
- P1-3 batas privasi: `EXECUTE` pada `search_students`/`get_student` dicabut dari `anon`, diberikan ke `authenticated`; dibuat route proxy server-side `/api/search` (POST) dan `/api/student/[nim]` (GET) memakai `createAdminClient()` (service role, tidak pernah ke browser).
- P2-4..P2-10 dan P3-11..P3-12: 404 konteks umum, profil mobile, target sentuh 44px, copy internal dihapus, hierarki login, tabel admin horizontal-scroll + caption/`scope`, loop `/masuk` (logo selalu ke `/`), `aria-describedby` search, `prefers-reduced-motion` mematikan `breathe`.

**Bug produksi "Pencarian gagal. Database belum siap" (fixed di `v1.2.1`)**
- Akar masalah: `src/lib/students.ts` memanggil `fetch("/api/search")` dan `fetch("/api/student/...")` dari **Server Component**. URL relatif tidak bisa dipakai di server; percobaan memakai absolute URL jatuh ke `NEXT_PUBLIC_SUPABASE_URL` sehingga Supabase membalas `requested path is invalid`.
- Perbaikan final: `searchStudents()` memanggil `supabase.rpc("search_students", { q })` dan `getStudentByNim()` query `students` langsung, keduanya via `createAdminClient()`. Tidak ada HTTP internal lagi.
- Route `/api/search` dan `/api/student/[nim]` **dipertahankan** sebagai endpoint terpisah (aman: service role hanya di server), walau tidak lagi dipakai komponen aplikasi.
- Verifikasi: gate dibuka sementara lalu `curl https://cipher-ti25.vercel.app/?q=2510817110017` mengembalikan `Hasil pencarian` + `Abdurrazak`; gate lalu dikembalikan dan `/?q=...` kembali 307 ke `/masuk`.
- Uji Playwright sementara (`test-api.spec.ts`, `test-ui.spec.ts`) dan devDependency `@playwright/test` sudah dihapus lagi.

---

## 3. File yang dibuat / diubah

### Sesi v1.2.1 — fix pencarian produksi (26 Oktober 2026)
- `src/lib/students.ts` — `searchStudents`/`getStudentByNim` query Supabase langsung (admin client + RPC), `fetchJson` dihapus.
- `src/app/page.tsx` — `console.error` error asli di `Results`, pesan ke pengguna tetap generik.
- `src/proxy.ts` — hanya perubahan format (gate tidak berubah).
- `src/components/site-header.tsx` — logo selalu `href="/"`.
- `src/app/api/search/route.ts`, `src/app/api/student/[nim]/route.ts` — route proxy service-role dipertahankan.
- `package.json`, `package-lock.json` — versi `1.2.1`; `@playwright/test` dilepas kembali.
- `handoff.md` — status, temuan, dan jebakan baru diperbarui.
- Verifikasi: `npm run lint` / `typecheck` / `build` bersih; produksi `READY` di `https://cipher-ti25.vercel.app`.

### Sesi v1.1.1 — pemangkasan copy (25 Oktober 2026)
- `src/app/page.tsx` — deskripsi beranda dipangkas; klausa "lalu buka halaman profil lengkap" dihapus; kalimat kedua dipisah baris.
- `src/app/login/page.tsx` — hapus paragraf "Login hanya untuk admin angkatan…", "Gunakan akun yang sudah terdaftar di Supabase Auth.", dan "Tidak ada pendaftaran publik…".
- `package.json`, `package-lock.json` — versi `1.1.1`.
- `handoff.md` — status, rilis, dan catatan sesi diperbarui.
- Verifikasi: `npm run lint`, `npm run typecheck`, dan `npm run build` bersih.
- Commit `abfae27` dan tag annotated `v1.1.1` dibuat; deploy produksi `dpl_CQKRWUZKLbwniLK4cquSQ6aTjWHn` `READY` di `https://cipher-ti25.vercel.app`.
- Push belum bisa: repo lokal tidak punya remote.

### Sesi audit & indexing (25 Oktober 2026 — read-only)
- Tidak ada perubahan kode aplikasi. Produksi tetap v1.1.0.
- `handoff.md` — diperbarui dengan status PAUSED, temuan audit, dan hasil reindex.
- `opencode.json` — **perubahan lokal belum di-commit**: `codebase-memory-mcp_*` diset `true` (seharusnya `false` sesuai kebijakan; hanya watcher yang boleh aktif). Jangan panggil tool MCP.

### Sesi implementasi (sebelum audit)
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

1. **Status saat ini:** `v1.2.1` deployed dan pencarian (NIM/nama) sudah terverifikasi bekerja di produksi.
   Titik henti terakhir: commit `v1.2.1` (lihat `git log -1`), produksi `READY` di `https://cipher-ti25.vercel.app`.

2. **Sisa yang belum diverifikasi manual:** hasil perbaikan audit P2 (profil mobile, target sentuh, tabel admin mobile, hierarki login) baru dicek lewat build, belum audit ulang di produksi. Bila ingin, jalankan audit manual 320–1440 sebelum rilis berikutnya.

3. **Sebelum sesi ordinary:** kembalikan `opencode.json` `codebase-memory-mcp_*` ke `false`; jangan panggil tool MCP. Watcher tetap boleh berjalan.

4. **Regresi admin permanen (opsional).**
   Skrip Playwright sementara sudah dihapus setelah lolos. Bila ingin regression suite permanen, tambahkan `playwright` sebagai devDependency dan pindahkan alur (login → tabel → dialog → CRUD uji → cleanup) ke `scripts/`.

5. **Watcher Codebase Memory sudah aktif.**
   Watcher `git` poll 5 detik. Tidak perlu restart selama sesi ini. Saat opencode ditutup, watcher ikut berhenti; sesi baru akan memulainya lagi lewat config project. Jika tidak aktif, jalankan ulang skrip indexing; jangan panggil tool MCP.

6. **Housekeeping.**
   File test Playwright sementara (`test-api.spec.ts`, `test-ui.spec.ts`), `test-results/`, dan `debug-*.png` sudah dihapus. `.env.local` tetap jangan di-commit.

7. **Distribusi kode akses (jika belum).**
   Kode ada di `.env.local` (`CIPHER_ACCESS_CODE`) dan dashboard Vercel (Secret). Jangan tulis kode di dokumen publik. Jika perlu rotasi, gunakan `vercel env add ... --force` lalu `vercel --prod --yes`; semua cookie lama akan invalid.

8. **Push sudah selesai (26 Oktober 2026).**
   Remote `origin` = `https://github.com/RyuuZev/cipher25`. `git push -u origin main` sukses setelah merge `--allow-unrelated-histories` dengan `Initial commit` (README lokal dipertahankan, LICENSE remote diambil). `git push origin --all` up-to-date; `git push origin --tags` mengirim `v1.0.0`–`v1.2.1`.
   Verifikasi: tree remote 74 file, satu-satunya file env yang ter-track adalah `.env.local.example`; tidak ada `.env.local`, `Foto/`, `Informasi Angkatan TI 25 - DB.csv`, `.agents/`, `.opencode/`, atau `.vercel`.

---

## 5. Jebakan yang sudah ditemukan (jangan diulang)

- **Jangan `fetch("...")` dari Server Component.** URL relatif gagal di server; bila dipaksa absolute dengan `NEXT_PUBLIC_SUPABASE_URL`, Supabase membalas `requested path is invalid`. Query Supabase langsung lewat `createAdminClient()`/`createClient()`, atau pakai `fetch` hanya di Client Component dengan `window.location.origin`.
- **Error handler yang menelan pesan asli memperlambat debugging.** Selalu `console.error` error asli sambil menampilkan pesan generik ke pengguna.
- **Verifikasi render server-side butuh cookie gate.** `curl` tanpa cookie akan 307 ke `/masuk`; untuk sementara buka gate (`isValidToken`/`proxy.ts`), verifikasi, lalu **wajib** kembalikan dan redeploy.
- **`vercel env add` untuk env baru tidak selalu terbaca middleware Edge pada deploy berikutnya**; lebih andal mengubah kode sementara daripada mengandalkan flag env.
- **Prefetch route terkunci**: `Link href="/"` dari halaman ber-gate membuat request RSC memantul 307 ke `/masuk` dan tidak pernah selesai → `waitUntil: "networkidle"` timeout. Selalu `prefetch={false}` untuk tautan lintas gate.
- **`max-w-[62ch]` menipu di Geist 12px** (1ch ≈ 7,96px → ±88 karakter). Pakai rem: `26rem` ≈ 75 karakter. Untuk IBM Plex, tetap verifikasi dengan pengukuran, jangan asumsi `ch`.
- **PowerShell**: `$HOME` read-only; pakai `-LiteralPath` untuk path ber-`[ ]`; jangan merangkai banyak `-replace` dalam satu baris. Edit file lewat tool edit/write, bukan regex massal.
- **`vercel env add --environment`**: argumen berkoma harus dikutip (`"production,preview,development"`); tanpa kutip PowerShell mengubahnya menjadi array dan CLI menolak environment.
- **`npx` rusak** (`ECOMPROMISED`); `vercel` global tersedia.
- **Detector URL scan tidak punya opsi cookie** dan menolak halaman 404. Untuk `/`, `/profil/*`, `/admin`, dan `/tidak-ada`, pakai Chromium dengan `--remote-debugging-port`, login/set cookie, lalu `impeccable detect --cdp <port> --target <path> --json` (halaman dipindai apa adanya; jangan lupa set viewport lewat browser).
- **Detector butuh `networkidle`**; bila ada request menggantung, deteksi akan `Navigation timeout of 30000 ms`.
- **Uji dialog**: setelah Escape/close, tunggu konten `<dialog>` benar-benar dilepas sebelum menghitung `h2`. Assertion langsung setelah atribut `open` hilang bisa menangkap frame sebelum React menyelesaikan render.
- **Auth admin** untuk uji lokal: `node --env-file=.env.local` (jangan pernah commit `.env.local`; mesin ini juga menyimpan `SUPABASE_SERVICE_ROLE_KEY`).
- **`opencode.json` lokal saat ini tidak sesuai kebijakan**: `codebase-memory-mcp_*` diset `true` dan belum di-commit. Jangan panggil tool MCP; kembalikan ke `false` sebelum sesi ordinary. Watcher tetap boleh aktif.
- **Detector `impeccable` 0 temuan bukan jaminan**: ia tidak menangkap overflow query panjang, accessible name dari teks `hidden`, konteks copy 404, atau hierarki mobile. Tetap audit manual di produksi.
- **Bersihkan Chrome audit**: proses `chrome.exe` dengan `--remote-debugging-port=9222` dan folder `%TEMP%\cipher-audit-*` harus dihentikan/dihapus setelah audit agar tidak menggantung.
