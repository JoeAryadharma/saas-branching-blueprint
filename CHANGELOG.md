# 📓 CATATAN RIWAYAT PERUBAHAN SISTEM (CHANGELOG)

Seluruh pembaruan, penambahan fitur, dan perbaikan pada sistem dicatat secara transparan di dokumen ini.

Format Berdasarkan Versi Sistem: `v[Mayor].[Minor].[Patch]`

---

## [v9.5.8] - 2026-07-27 (Rilis Antigravity AI Engine Powered Edition)

### 🌟 Fitur Baru & Pembaruan
- **Integrasi Token Native Antigravity IDE (`v9.5.8`):** Asisten Joe kini terhubung secara langsung dengan mesin AI bawaan Antigravity IDE via `vscode.lm` API. Menggunakan kuota dan token akun Antigravity / Gemini 3.6 Flash aktif secara otomatis tanpa perlu mengisi API Key secara manual.
- **Fallback API Key Kustom (`v9.5.8`):** Mendukung pengisian API Key kustom (`GEMINI_API_KEY` / `ANTIGRAVITY_API_KEY` di `.env` atau via pengaturan VS Code `saasWorkflow.apiKey`) jika berjalan di luar Antigravity IDE.
- **DSPy & TextGrad Prompt Compiler (`v9.5.7` - Stanford Adoption):** Mengadopsi teknik *Teleprompter Signature* dari DSPy dan *Textual Gradient Loop* dari TextGrad untuk menyusun prompt dengan struktur *Chain-of-Thought (CoT)*.
- **Prompt Generator Syntax Auto-Fixer (`v9.5.6`):** Menambahkan modul pemformat dan pembersih otomatis prompt AI.
- **Smart Error Boundary (`v9.5.5` - cline adoption):** Penanganan kendala tak terduga terpusat dengan tombol pemulihan mandiri.

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

*Catatan: Dokumen ini diperbarui secara otomatis oleh Asisten Joe v9.5.8.*
