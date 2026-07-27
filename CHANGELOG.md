# 📓 CATATAN RIWAYAT PERUBAHAN SISTEM (CHANGELOG)

Seluruh pembaruan, penambahan fitur, dan perbaikan pada sistem dicatat secara transparan di dokumen ini.

Format Berdasarkan Versi Sistem: `v[Mayor].[Minor].[Patch]`

---

## [v9.9.0] - 2026-07-27 (Rilis Anti-Layout Mutation & Asset Guard Engine)

### 🌟 Fitur Baru & Pembaruan
- **Anti-Layout Mutation & Asset Guard Engine (`v9.9.0`):** Menangani masalah di mana permintaan pergantian gambar/foto malah menyebabkan Grafity merubah bentuk Navbar, struktur HTML layout, CSS classes, atau merembet ke berkas halaman lain.
- **Single-Attribute Surgical Mutation (`v9.9.0`):** Mengunci pergantian gambar HANYA pada nilai atribut `src="..."` atau `background-image: url(...)` dengan batasan ketat **maksimal 1-3 baris perubahan pada git diff**.
- **Chip Pintas `[🖼️ Ganti Gambar (Aman)]` (`v9.9.0`):** Menyediakan aksi cepat di panel UI untuk menyusun Draf Bedah Gambar terproteksi.
- **Micro-Scoped Prompt Slicer Engine (`v9.8.0`):** Mengisolasi instruksi prompt hanya untuk **1 berkas atau 1 komponen target spesifik** dalam satu waktu.
- **Kontrak Embargo Berkas (`v9.8.0`):** Secara eksplisit melarang Grafity menyentuh berkas atau fungsi di luar potongan kode target.
- **Injeksi Potongan Kode Target (`v9.8.0`):** Otomatis menyertakan potongan kode asli editor aktif ke dalam prompt presisi.
- **Mode Design & Grafity Super-Prompt Engine (`v9.7.0`):** Mengimplementasikan generator Super-Prompt perintah untuk Grafity yang dipagari oleh 5 Dinding Kontrak Kepatuhan.

---

## [v1.0.0] - 2026-07-22 (Rilis Perdana Sistem)

### 🌟 Fitur Baru
- Peluncuran modul Manajemen Pengguna dan Hak Akses Perusahaan.
- Integrasi Layanan Pembayaran Otomatis (QRIS & Transfer Bank).
- Dasbor Rekap Laporan Penjualan dan Aktivitas Pelanggan.

---

*Catatan: Dokumen ini diperbarui secara otomatis oleh Asisten Joe v9.9.0.*
