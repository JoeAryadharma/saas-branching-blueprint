# 📓 CATATAN RIWAYAT PERUBAHAN SISTEM (CHANGELOG)

Seluruh pembaruan, penambahan fitur, dan perbaikan pada sistem dicatat secara transparan di dokumen ini.

Format Berdasarkan Versi Sistem: `v[Mayor].[Minor].[Patch]`

---

## [v9.6.1] - 2026-07-27 (Rilis Pure Prompt Generator & Smart Context Compressor - Tahap 2 Optimasi)

### 🌟 Fitur Baru & Pembaruan
- **Pure Prompt Output Enforcer (`v9.6.1`):** Menegaskan aturan sistem bahwa Asisten Joe SELALU menghasilkan output berupa **Draf Prompt Presisi Terstruktur** (Prompt Generator Engine) dan tidak memberikan kode mentah langsung.
- **Smart Context Compressor (`v9.6.1` - Tahap 2 Optimasi):** Menyaring diff/konteks proyek besar menjadi ringkasan simbol dan AST untuk menghemat token Antigravity hingga 70%.
- **Real-Time Token Streaming (`v9.6.0` - Tahap 1 Optimasi):** Mengimplementasikan alur streaming respons kata demi kata (`askStream`) dari Antigravity AI Engine ke Webview UI.
- **Integrasi Token Native Antigravity IDE (`v9.5.8`):** Terhubung langsung dengan mesin AI bawaan Antigravity IDE via `vscode.lm` API.

---

## [v1.0.0] - 2026-07-22 (Rilis Perdana Sistem)

### 🌟 Fitur Baru
- Peluncuran modul Manajemen Pengguna dan Hak Akses Perusahaan.
- Integrasi Layanan Pembayaran Otomatis (QRIS & Transfer Bank).
- Dasbor Rekap Laporan Penjualan dan Aktivitas Pelanggan.

### 🔧 Perbaikan & Penyempurnaan
- Penyempurnaan kecepatan pemrosesan cetak faktur.
- Pembatasan batas waktu sesi untuk meningkatkan keamanan akun.

---

*Catatan: Dokumen ini diperbarui secara otomatis oleh Asisten Joe v9.6.1.*
