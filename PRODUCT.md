# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Pengunjung (utama):** mahasiswa Teknologi Informasi angkatan 2025 yang ingin melihat profil teman seangkatan — biasanya untuk mencocokkan nama dengan NIM, melihat foto, atau mengecek tanggal lahir dan Instagram. Mereka datang dari tautan yang dibagikan di grup angkatan, sering dari ponsel, dan hampir selalu punya satu orang tertentu yang dicari.

**Admin:** pengurus angkatan (lebih dari satu orang, terdaftar di `admin_users`). Mereka membuka panel untuk menambah mahasiswa baru, memperbaiki data yang salah, atau menghapus entri. Akses admin dinilai sudah memadai dan tidak perlu diubah.

## Product Purpose

CIPHER adalah database profil mahasiswa TI 2025: satu tempat untuk 67 data mahasiswa beserta foto, NIM, TTL, dan Instagram. Produk berhasil bila seorang mahasiswa bisa menemukan profil yang tepat dalam hitungan detik tanpa membuat akun, dan pengurus bisa memperbaiki data tanpa menyentuh database secara manual.

## Positioning

Bukan direktori yang bisa dijelajahi. Data tidak pernah tampil sebagai daftar terbuka: profil hanya muncul setelah pencarian spesifik, dan pencarian itu dijaga kode angkatan. Sebuah direktori umum tidak bisa meniru kombinasi ini tanpa membuang premis privasinya.

## Operating Context

- Data awal masuk lewat `npm run import` dari satu CSV angkatan (`Informasi Angkatan TI 25 - DB.csv`) beserta folder foto; import memetakan ulang ejaan foto yang berbeda dan mengunggahnya ke Supabase Storage sebagai `{nim}.jpg`.
- Pemakaian nyata: dibuka singkat dari ponsel saat butuh satu profil, bukan sesi panjang. Pencarian adalah satu-satunya jalur masuk ke data bagi pengunjung.
- Backend Supabase free tier, jadi proyek bergantung pada cron keep-alive harian (`/api/keepalive`, 09:00 WITA) agar database tidak di-pause.
- Deploy di Vercel; satu instance produksi publik di `cipher-ti25.vercel.app`.

## Capabilities and Constraints

**Terkonfirmasi berjalan**

- Pencarian berdasarkan NIM atau nama (minimal 2 karakter) lewat RPC `search_students`; tabel `students` sendiri tidak dapat dibaca langsung oleh anon.
- Halaman profil per NIM: foto, NIM, nama, TTL, prodi, fakultas, angkatan, motto, Instagram.
- Panel admin dengan login (Supabase Auth + tabel `admin_users`) untuk tambah, ubah, hapus, dan unggah foto.
- Data pribadi (TTL, Instagram, motto) dikumpulkan dengan seizin yang bersangkutan dan ditampilkan apa adanya.
- Ruang lingkup permanen: satu angkatan, satu prodi (TI 2025). Tidak dirancang untuk dipakai ulang angkatan atau prodi lain.

**Diputuskan, dibangun**

- Gerbang kode angkatan: pengunjung memasukkan kode angkatan sebelum dapat mencari. Kode disimpan di `CIPHER_ACCESS_CODE`; setelah cocok, perangkat mendapat cookie HttpOnly 7 hari. Rute `/masuk` menampung form; beranda dan halaman profil mengalihkan ke sana bila belum terbuka.

**Batasan teknis**

- Foto hanya satu per mahasiswa; tidak ada unggahan dari mahasiswa sendiri.
- Pengunjung tidak punya akun dan tidak punya cara mengoreksi datanya; semua koreksi lewat pengurus.
- Field motto di data sumber sebagian berisi `"Unknown"`, sehingga harus diperlakukan sebagai kosong, bukan sebagai kutipan.
- Kode angkatan adalah rahasia bersama, bukan autentikasi. Gerbang saat ini bekerja di lapisan aplikasi: siapa pun yang memegang anon key masih bisa memanggil RPC `search_students` langsung, jadi nilainya adalah penyaring sosial, bukan penguncian. Penegakan sebenarnya butuh perubahan di database (parameter kode pada RPC), dan itu keputusan terpisah.

## Brand Commitments

- Nama **CIPHER** mengikat, termasuk permainan kata pada "cipher" (sesuatu yang harus dibuka, bukan dipamerkan).
- Bahasa antarmuka: Indonesia, dengan sapaan netral dan tanpa jargon teknis ke pengunjung.
- Nada bicara: ringkas dan langsung; situs ini alat, bukan panggung.

## Evidence on Hand

- `Informasi Angkatan TI 25 - DB.csv` — 67 baris data nyata (1 header + 67 mahasiswa).
- Folder `Foto/` — foto asli tiap mahasiswa, dipakai saat import.
- Kode nyata: `supabase/schema.sql` (tabel, RLS, RPC, trigger, bucket), `scripts/import.mjs`, panel admin berfungsi.
- Tidak ada testimoni, studi kasus, angka pertumbuhan, atau liputan media. Jangan mengarangnya.

## Product Principles

1. **Privasi lewat friksi, bukan lewat penguncian.** Data tetap dapat diakses yang berhak, tapi tidak pernah tersaji sebagai daftar yang bisa dipanen. Setiap pelonggaran gerbang harus dibahas, bukan dianggap perbaikan UX.
2. **Satu angkatan, satu kebenaran.** Semua keputusan mengasumsikan 67 orang dan satu pengurus; jangan menambah abstraksi untuk skenario multi-angkatan yang tidak akan terjadi.
3. **Satu orang, satu pencarian, satu profil.** Pengunjung datang untuk orang tertentu; jalur terpendek menang atas fitur penjelajahan.
4. **Pengurus adalah satu-satunya editor.** Tidak ada alur swalayan untuk mahasiswa; jangan membangun fitur yang mengasumsikan mereka punya akun.
5. **Jangan menampilkan yang tidak ada.** Data kosong atau "Unknown" ditampilkan sebagai ketiadaan, bukan diisi karangan atau placeholder yang terlihat seperti isi.
