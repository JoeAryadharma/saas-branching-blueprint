# 🏢 PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v9.0

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v9.0.0 (Ultimate Vibe Coder Suite)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## 🛡️ ASISTEN JOE v9.0 -- ULTIMATE VIBE CODER SUITE

Ekstensi pendamping Vibe Coding di Antigravity IDE / VS Code yang mengadopsi 4 repositori tingkat tinggi teruji dari GitHub:

1. **Pengoptimasi Prompt AI (promptfoo & fabric adoption):** Merapikan prompt kasar pengguna menjadi instruksi presisi terstruktur untuk mencegah halusinasi AI.
2. **Sinkronisasi `.env.example` Otomatis (dotenv-safe adoption):** Otomatis mendeteksi variabel `process.env.XXX` baru dan memperbarui berkas contoh lingkungan.
3. **Pemisah Simpanan Git Per Modul (opencommit adoption):** Memecah commit raksasa menjadi commit terpisah per area (data, API, tampilan, konfigurasi) dengan format Conventional Commits baku.
4. **Pembuat Draf Pengujian Unit Otomatis (keploy adoption):** Menyusun berkas draf pengujian sederhana di folder `test/` untuk fungsi baru.
5. **Pemindai Kerentanan Kode Statis (Semgrep SAST adoption):** Memindai celah SQL Injection, XSS, Unhandled Async Errors, dan penggunaan fungsi berbahaya (`eval`).
6. **Sensor Kunci Rahasia 25+ Database:** Mendeteksi kebocoran Stripe, AWS, GitHub PAT, OpenAI, Claude, Midtrans, Xendit, dan URL Database secara real-time.

### 📲 Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas $\rightarrow$ Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-9.0.0.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-9.0.0.vsix)**

---

## 📌 Ruang Kerja Digital (Branching Structure)

Proyek ini menggunakan 6 ruang kerja terisolasi agar pengembangan fitur baru tidak merusak pengalaman pengguna di sistem aktif:

1. **`main` (Sistem Utama Aktif):** Tempat menyimpan versi aplikasi yang sedang digunakan langsung oleh pelanggan (Live Output).
2. **`staging` (Ruang Simulasi Akhir):** Tempat simulasi akhir sebelum sistem diterbitkan ke pelanggan.
3. **`close-packing` (Ruang Penutupan & Audit Akhir):** Tempat pembekuan fitur baru untuk fokus pada pembersihan bug sisa.
4. **`develop` (Ruang Integrasi Tim):** Ruang penggabungan harian seluruh hasil pekerjaan anggota tim pengembang.
5. **`feature/*` (Ruang Kerja Fitur Baru):** Ruang kerja mandiri sementara untuk menyelesaikan 1 tugas fitur spesifik.
6. **`hotfix/*` (Jalur Perbaikan Darurat):** Ruang pertolongan pertama jika terjadi kendala kritis di sistem aktif.

---

## 📋 Aturan Catatan Simpan Pekerjaan (Conventional Commits)

Format baku yang digunakan oleh Asisten Joe:
- `fitur(nama-modul): penjelasan pekerjaan [ID-TIKET]`
- `perbaikan(nama-modul): penjelasan perbaikan kendala [ID-TIKET]`

---

## 📜 Lisensi & Perlindungan Hukum

Proyek ini dilindungi secara resmi oleh **[Lisensi MIT](file:///Users/user/Downloads/Prompt%20Engginer/LICENSE)** (Copyright 2026 Joe Aryadharma).
