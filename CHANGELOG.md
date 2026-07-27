# 📓 CATATAN RIWAYAT PERUBAHAN SISTEM (CHANGELOG)

Seluruh pembaruan, penambahan fitur, dan perbaikan pada sistem dicatat secara transparan di dokumen ini.

Format Berdasarkan Versi Sistem: `v[Mayor].[Minor].[Patch]`

---

## [v9.8.0] - 2026-07-27 (Rilis Micro-Scoped Prompt Slicer Engine)

### 🌟 Fitur Baru & Pembaruan
- **Micro-Scoped Prompt Slicer Engine (`v9.8.0`):** Mengisolasi instruksi prompt hanya untuk **1 berkas atau 1 komponen target spesifik** dalam satu waktu, mencegah Grafity dari kebingungan atau mengacak-acak berkas di luar target.
- **Kontrak Embargo Berkas (`v9.8.0`):** Secara eksplisit melarang Grafity menyentuh berkas atau fungsi di luar potongan kode target.
- **Injeksi Potongan Kode Target (`v9.8.0`):** Otomatis menyertakan potongan kode asli editor aktif ke dalam prompt presisi.
- **Mode Design & Grafity Super-Prompt Engine (`v9.7.0`):** Mengimplementasikan generator Super-Prompt perintah untuk Grafity yang dipagari oleh 5 Dinding Kontrak Kepatuhan (Anti-False Completion, SSOT Design System `BRAND.md`, Scope Lock, CoT Steps, & Mandatory 12-Checklist Verification).
- **Adopsi Standar `skills.sh` & Promptfoo Assertions (`v9.7.0`):** Mengunci perilaku Grafity di IDE agar tidak lagi melakukan klaim selesai palsu (*false completion*), mengabaikan Design System, atau mengubah berkas di luar ruang lingkup.
- **Multi-Agent Sub-Task Swarm Orchestrator (`v9.6.4`):** Sinergi 3 Sub-Agent Maya (Software Architect -> Lead Coder -> SAST Security Auditor).
- **Inline CodeLens Provider (`v9.6.3`):** Tombol `[🛡️ Asisten Joe: Susun Prompt Modul Ini]` melayang langsung di atas fungsi/kelas editor.
- **Hover Diagnostic Guard (`v9.6.3`):** Kartu peringatan kebocoran rahasia saat kursor diarahkan ke kode.
- **Terminal Error Sensor & Repair Prompt (`v9.6.2`):** Menangkap log error terminal dan menyusun Draf Prompt Perbaikan (Stanford DSPy Format).
- **Pure Prompt Output Enforcer (`v9.6.1`):** Menegaskan aturan sistem bahwa Asisten Joe SELALU menghasilkan output berupa Draf Prompt Presisi.
- **Smart Context Compressor (`v9.6.1`):** Menyaring diff/konteks proyek besar untuk menghemat token Antigravity hingga 70%.
- **Real-Time Token Streaming (`v9.6.0`):** Alur streaming respons kata demi kata (`askStream`).

---

## [v1.0.0] - 2026-07-22 (Rilis Perdana Sistem)

### 🌟 Fitur Baru
- Peluncuran modul Manajemen Pengguna dan Hak Akses Perusahaan.
- Integrasi Layanan Pembayaran Otomatis (QRIS & Transfer Bank).
- Dasbor Rekap Laporan Penjualan dan Aktivitas Pelanggan.

---

*Catatan: Dokumen ini diperbarui secara otomatis oleh Asisten Joe v9.8.0.*
