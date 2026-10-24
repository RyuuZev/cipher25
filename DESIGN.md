---
name: CIPHER
description: Database profil mahasiswa Teknologi Informasi 2025 — arsip angkatan yang dibuka lewat pencarian.
colors:
  ink: "#04060c"
  surface: "#080d17"
  surface-raised: "#0b1220"
  line: "#142235"
  signal-cyan: "#22d3ee"
  signal-cyan-soft: "#67e8f9"
  muted: "#8193ad"
  text-default: "#f1f5f9"
  text-bright: "#f8fafc"
  text-soft: "#e2e8f0"
  text-dim: "#cbd5e1"
  danger: "#f43f5e"
  danger-soft: "#fb7185"
  danger-text: "#fecdd3"
  danger-text-bright: "#ffe4e6"
  success: "#34d399"
  success-soft: "#6ee7b7"
  success-text: "#a7f3d0"
  warning: "#fbbf24"
  warning-text: "#fcd34d"
typography:
  display:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  headline:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.375
    letterSpacing: "-0.01em"
  title:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  body-small:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
  eyebrow:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.16em"
  mono-data:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.16em"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0.7rem 1.15rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan-soft}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "#cffafe"
    rounded: "{rounded.md}"
    height: "2.75rem"
    padding: "0.65rem 1rem"
  input:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.md}"
    padding: "0.7rem 0.9rem"
    typography: "{typography.body}"
  chip:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "#9eeefb"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.7rem"
    typography: "{typography.eyebrow}"
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.lg}"
  nav-link:
    textColor: "{colors.text-dim}"
    typography: "{typography.body}"
---

# Design System: CIPHER

## Overview

**Creative North Star: "The Cipher Terminal"**

CIPHER terasa seperti konsol arsip angkatan yang dibuka dengan kunci: gelap, sunyi, dan presisi. Tidak ada elemen yang berteriak minta diperhatikan. Cahaya hanya muncul sebagai sinyal — satu aksen cyan yang menandai "ini yang bisa kamu tekan" atau "ini yang baru berubah" — sementara sisanya adalah lapisan biru-navy yang hampir hitam, dipisahkan garis rambut.

Kepadatan mengikuti produknya: pengunjung datang untuk satu orang, jadi layar pun disusun untuk satu tujuan. Monospace dipakai untuk fakta yang harus dibaca tepat (NIM, TTL, jumlah hasil), sans untuk kalimat. Dekorasi dibatasi pada tiga hal yang memang bermakna: grid halus di latar hero, satu cahaya lembut di belakang wordmark, dan sudut membulat yang konsisten. Wordmark tidak memakai gradient maupun glow teks — bobot dan ukurannya yang membuatnya berbicara.

Nada yang sengaja dihindari: landing page startup AI (glow tebal, gradient ungu-biru, kartu-kartu melayang tanpa alasan). Kalau sebuah efek tidak membantu menemukan atau membaca data, efek itu tidak dipakai.

**Key Characteristics:**
- Satu aksen cyan, dipakai hemat sebagai sinyal.
- Latar berlapis tonal, bukan bayangan.
- Garis rambut 1px transparan menggantikan divider solid.
- Monospace untuk angka dan nomor, sans untuk bahasa.
- Gerak pendek (180–600ms) dan selalu punya sebab.

## Colors

Palet gelap satu aksen: biru-navy hampir hitam sebagai kanvas, cyan sebagai satu-satunya suara.

### Primary
- **Signal Cyan** (`#22d3ee`): aksen tunggal. Dipakai pada tombol utama, ikon aktif, border kartu saat hover, dan angka statistik. Di hero ia hanya muncul sebagai satu cahaya lembut di belakang judul — tidak pernah sebagai warna teks judul.
- **Signal Cyan Soft** (`#67e8f9`): cyan yang dinaikkan terang untuk teks di atas gelap (NIM di halaman profil, judul kartu saat hover) dan untuk focus ring. Cyan murni terlalu gelap untuk teks kecil.

### Neutral
- **Ink** (`#04060c`): latar terdalam — body, panel input, backdrop dialog. Juga warna teks di atas tombol cyan.
- **Surface** (`#080d17`): dasar kartu dan header yang di-blur.
- **Surface Raised** (`#0b1220`): ujung terang dari gradient kartu; memberi kesan panel yang sedikit terangkat tanpa bayangan.
- **Line** (`#142235`): pemisah struktural (border-b header, garis atas daftar statistik). Solid, dipakai hanya untuk garis 1px.
- **Muted** (`#8193ad`): teks sekunder — label, metadata, placeholder, keterangan. Semua teks yang boleh "dilewati" saat memindai.
- **Text Default** (`#f1f5f9`) / **Text Bright** (`#f8fafc`): isi utama dan judul. Perbedaan keduanya tipis dan disengaja: judul sedikit lebih terang.
- **Text Soft** (`#e2e8f0`) / **Text Dim** (`#cbd5e1`): tautan navigasi dan isi yang perlu sedikit mundur dari judul.

### Status
- **Danger** (`#f43f5e`, soft `#fb7185`): hanya untuk aksi merusak (hapus) dan galat. Teks di atas danger memakai `#fecdd3`/`#ffe4e6` agar tetap terbaca.
- **Success** (`#34d399`, soft `#6ee7b7`): konfirmasi tersimpan.
- **Warning** (`#fbbf24`, teks `#fcd34d`): peringatan ringan dan keadaan "database belum terhubung".

### Named Rules

**The One Voice Rule.** Hanya satu warna aksen. Cyan menempati kurang dari 10% luas layar mana pun; kelangkaannya yang membuatnya terbaca sebagai sinyal, bukan sebagai tema.

**The No Second Accent Rule.** Jangan menambah ungu, hijau, atau oranye untuk "variasi". Warna di luar cyan hanya boleh muncul sebagai status (danger/success/warning) dan harus punya arti yang bisa disebutkan dalam satu kalimat.

## Typography

**Display Font:** IBM Plex Mono (dengan ui-monospace, monospace)
**Body Font:** IBM Plex Sans (dengan ui-sans-serif, system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono — dipakai untuk semua fakta bernomor

**Character:** Satu superfamily, dua temperamen. IBM Plex Mono memberi kesan terminal arsip dan membuat digit NIM sejajar sempurna; IBM Plex Sans menjaga kalimat tetap manusiawi. Keduanya lahir dari sistem huruf yang sama, jadi peralihan antar keduanya tidak terasa seperti pindah situs. Geist tidak lagi dipakai — wajahnya terlalu umum untuk menjadi suara CIPHER.

### Hierarchy
- **Display** (700, 48px → 72px `sm:` → 96px `lg:`, line-height 1, tracking 0.14em): hanya untuk wordmark "CIPHER" di hero. Huruf jarang, kapital, mono, warna `#f8fafc` solid. Tidak dipakai untuk judul halaman lain.
- **Headline** (600, 24px → 30px `sm:`, line-height 1.375): judul seksi dan judul kartu besar di beranda. Maksimal dua baris.
- **Title** (600, 18–20px): judul dialog, judul seksi form, nama pada keadaan kosong.
- **Body** (400, 14px, line-height 1.625): paragraf penjelas, isi form, deskripsi fitur. Batas panjang baris dijaga lewat `max-w-lg`–`max-w-xl`.
- **Body Small** (400, 12px, line-height 1.6): keterangan di bawah pencarian, catatan privasi, teks bantuan. **12px adalah lantai** — tidak ada teks lebih kecil dari ini.
- **Eyebrow** (400, 12px, uppercase, tracking 0.16em, warna muted): label field form dan metadata di kartu. Bukan kicker dekoratif di atas judul — kicker di atas headline sudah dihapus dari sistem ini. Hanya dua nilai tracking yang dipakai: `0.12em` untuk label di dalam pil (chip), `0.16em` untuk label dan metadata.
- **Mono Data** (500–600, 12–20px, tracking 0.08–0.24em): NIM di kartu dan profil, jumlah hasil pencarian, angka statistik (`13`, `2025`, `TI`), wordmark header.

### Named Rules

**The Mono-for-Facts Rule.** Angka yang harus dibaca tepat — NIM, tanggal, jumlah hasil, statistik — selalu mono dengan tracking lebar. Kalimat yang harus dibaca lancar selalu sans. Jangan menukar keduanya.

**The Twelve Pixel Floor Rule.** Tidak ada teks di bawah 12px, termasuk label uppercase dan metadata.

**The Weight-Not-Paint Rule.** Penekanan tipografis dicapai lewat bobot, ukuran, dan jarak huruf. Tidak ada gradient text, tidak ada glow teks, tidak ada warna-warni per kata.

## Layout

Satu kolom terpusat, maksimum 1152px (`max-w-6xl`) dengan padding 16px di ponsel dan 24px mulai 640px. Halaman profil menyempit ke 960px (`max-w-5xl`) karena isinya satu orang, bukan daftar. Header setinggi 64px dan menempel di atas (`sticky`) dengan blur.

Hero beranda adalah satu blok terpusat: chip identitas, wordmark, satu paragraf, lalu form pencarian — semuanya di dalam lebar ~768px agar baris kalimat tetap pendek. Di bawahnya grid dua kolom pada `lg` (1.2fr / 1fr) untuk pengantar dan tiga kartu fitur; di ponsel semuanya menumpuk.

Daftar hasil memakai grid dua kolom mulai 640px dengan jarak 12px. Halaman profil memakai grid 380px + sisa pada `lg`, dan tumpukan pada layar kecil. Breakpoint mengikuti Tailwind: 640px (`sm`), 1024px (`lg`). Jarak vertikal antar seksi 48–64px; jarak di dalam kartu 12–24px.

## Elevation & Depth

Sistem ini **berlapis tonal, bukan berbayangan**. Kedalaman dibuat dari tiga bahan: gradient vertikal gelap (`#0b1220` → `#070b14`), border 1px cyan dengan alfa rendah (0.13), dan `backdrop-filter: blur(14px)` pada kartu. Tidak ada bayangan permanen di mana pun — permukaan diam berarti datar.

Kedalaman baru muncul sebagai respons. Kartu hasil naik 3px dengan border menyala (alfa 0.4) dan satu bayangan cyan tipis di bawahnya; tombol utama naik 1px dan bertambah terang. Dialog hapus memakai satu-satunya bayangan besar (`shadow-2xl`) karena ia memang berada di atas segalanya.

Di layar ≤640px blur kartu dimatikan dan latar `fixed` diganti `scroll` — biaya kompositnya tidak sepadan dengan manfaat visualnya di ponsel.

### Shadow Vocabulary
- **Hover lift** (`0 18px 50px -24px rgba(34,211,238,0.45)`): hanya pada kartu yang bisa diklik, hanya saat hover.
- **Dialog** (`shadow-2xl`): hanya untuk dialog modal.

### Named Rules

**The Flat-At-Rest Rule.** Permukaan datar saat diam. Bayangan hanya lahir dari keadaan: hover, fokus, atau modal. Jangan memberi semua kartu bayangan agar terlihat "modern".

**The No Halo Rule.** Tidak ada cahaya nol-offset di sekitar teks, ikon, atau kotak kecil. Cahaya hanya boleh muncul sebagai blob kabur berskala besar di belakang hero.

## Shapes

Bahasa bentuknya bulat-sopan, bukan kotak teknis: radius 12px untuk kontrol (tombol, input), 16px untuk kartu, 24px untuk panel besar (hero, foto profil, keadaan kosong), dan pil penuh hanya untuk chip. Tidak ada sudut tajam di mana pun — sudut 0px akan terbaca sebagai sistem lain.

Border selalu 1px dan selalu transparan (alfa 0.13–0.4 dari cyan, atau putih 5–10% untuk netral). Tidak ada border 2px, tidak ada garis putus-putus kecuali pada panel "belum ada data" — di sana putus-putus dipakai sebagai isyarat ketiadaan, bukan dekorasi.

Grid latar (`44px × 44px`, cyan alfa 0.055) hanya hadir di hero dan halaman profil, dengan mask radial yang memudarkannya ke bawah. Ia adalah tekstur, bukan pola yang harus dibaca.

## Components

### Buttons
- **Shape:** sudut 12px (`0.75rem`), tinggi minimum 44px di semua varian.
- **Primary:** cyan solid (`#22d3ee`), teks Ink 600. Padding `0.7rem 1.15rem`. Hover: brightness 1.08 + naik 1px. Disabled: opacity 60%, kursor not-allowed.
- **Ghost:** latar Surface 70%, border cyan alfa 0.22, teks `#cffafe`. Hover: border alfa 0.5 + latar cyan 8%. Dipakai untuk aksi sekunder ("Admin", "Batal", "Kembali").
- **Destructive:** border danger alfa 25–40%, latar danger 10–15%, teks `#ffe4e6`. Hanya untuk hapus.
- **Ikon di dalam tombol:** 14–16px, selalu berpasangan dengan label; tidak ada tombol ikon-saja kecuali tombol tutup/tandai.

### Chips
- **Style:** pil penuh, border cyan alfa 0.22, latar cyan 7%, teks `#9eeefb`, 12px uppercase, tracking 0.08em.
- **State:** chip netral memakai border putih 10% dan latar putih 5% dengan teks `text-dim` — dipakai saat chip tidak menandai aksen (mis. "Angkatan 2025").
- Chip hanya untuk label identitas, bukan untuk filter atau aksi.

### Cards / Containers
- **Corner Style:** 16px untuk kartu daftar, 24px untuk panel besar.
- **Background:** gradient vertikal Surface Raised → hampir Ink, dengan blur 14px (dimatikan ≤640px).
- **Border:** 1px cyan alfa 0.13; naik ke 0.4 saat hover jika kartu bisa diklik.
- **Internal Padding:** 12px untuk kartu hasil (foto 80px + teks), 16px untuk kartu detail, 24–32px untuk panel hero.
- **Interaksi:** seluruh kartu hasil adalah satu tautan; hover mengubah border, mengangkat 3px, dan mengubah nama jadi cyan soft + ikon panah jadi cyan.

### Inputs / Fields
- **Style:** sudut 12px, border cyan alfa 0.18, latar Ink 75%, teks 14px. Placeholder memakai Muted.
- **Focus:** border cyan alfa 0.6 + cincin `0 0 0 3px rgba(34,211,238,0.12)`. Fokus keyboard global memakai outline 2px `#67e8f9` dengan offset 3px.
- **Error:** pesan di kotak danger (border 30%, latar 10%, teks `#fecdd3`), dihubungkan lewat `aria-describedby`; input diberi `aria-invalid`.
- **Label:** eyebrow uppercase 12px muted di atas field, selalu terhubung lewat `for`/`id`.

### Navigation
- Header sticky 64px, latar Ink 75% + blur, border bawah Line 70%.
- Wordmark: kotak 36px radius 12px berisi "C" mono, diikuti "CIPHER" mono 14px tracking 0.32em dan "TI 2025" 12px uppercase tracking 0.22em.
- Tautan: 14px Text Dim, hover cyan soft. Tautan "Cari" disembunyikan di bawah 640px; "Admin" selalu tampil sebagai tombol ghost kecil.
- Semua target sentuh minimal 44px, termasuk tautan teks.

### Signature — Photo Plate
Kartu foto profil: panel 24px berisi foto rasio 4:5 (radius 16px) dengan lapisan gradient dari bawah (Ink 90% → transparan) dan dua baris mono di dalamnya — "CIPHER · TI 2025" (cyan 80%) dan NIM (Text Soft). Ini satu-satunya tempat foto dan teks menyatu; di tempat lain foto selalu terpisah di kotak radius 12px.

## Do's and Don'ts

### Do:
- **Do** pakai satu aksen cyan dan biarkan ia jarang — di bawah 10% luas layar.
- **Do** bangun kedalaman dari gradient gelap + border 1px, bukan dari bayangan.
- **Do** pakai mono tracking lebar untuk NIM, tanggal, jumlah hasil, dan statistik.
- **Do** bulatkan angka dengan `font-variant-numeric: tabular-nums` agar kolom angka rata.
- **Do** jaga target sentuh minimal 44px, termasuk tautan teks dan tombol ikon.
- **Do** tampilkan data kosong sebagai "Belum diisi" — jangan mengarang isi.
- **Do** pertahankan kontras teks minimal 4.5:1; Muted hanya untuk teks yang boleh dilewati.

### Don't:
- **Don't** menambah warna aksen kedua (ungu, oranye, hijau) untuk variasi visual.
- **Don't** memakai gradient text sama sekali; penekanan datang dari bobot, ukuran, dan jarak huruf.
- **Don't** memberi bayangan permanen pada kartu diam.
- **Don't** memakai teks di bawah 12px, termasuk label uppercase.
- **Don't** menaruh kicker dekoratif kecil di atas headline; eyebrow hanya untuk label field dan metadata.
- **Don't** menyarangkan kartu di dalam kartu; satu permukaan per blok, pisahkan dengan garis rambut.
