# 📓 CATATAN RIWAYAT PERUBAHAN SISTEM (CHANGELOG)

Seluruh pembaruan, penambahan fitur, dan perbaikan pada sistem dicatat secara transparan di dokumen ini.

Format Berdasarkan Versi Sistem: `v[Mayor].[Minor].[Patch]`

---

## [v9.6.0] - 2026-07-27 (Rilis Real-Time Token Streaming - Tahap 1 Optimasi)

### 🌟 Fitur Baru & Pembaruan
- **Real-Time Token Streaming (`v9.6.0` - Tahap 1 Optimasi):** Mengimplementasikan alur streaming respons kata demi kata (`askStream`) dari Antigravity AI Engine ke Webview UI. Pengguna tidak perlu menunggu respons selesai untuk mulai membaca.
- **Integrasi Token Native Antigravity IDE (`v9.5.8`):** Asisten Joe terhubung secara langsung dengan mesin AI bawaan Antigravity IDE via `vscode.lm` API.
- **Fallback API Key Kustom (`v9.5.8`):** Mendukung pengisian API Key kustom (`GEMINI_API_KEY` / `ANTIGRAVITY_API_KEY` di `.env` atau via pengaturan VS Code `saasWorkflow.apiKey`).
- **DSPy & TextGrad Prompt Compiler (`v9.5.7` - Stanford Adoption):** Mengadopsi teknik *Teleprompter Signature* dari DSPy dan *Textual Gradient Loop* dari TextGrad.

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

*Catatan: Dokumen ini diperbarui secara otomatis oleh Asisten Joe v9.6.0.*
