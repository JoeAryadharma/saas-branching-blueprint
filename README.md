# 🏢 PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v9.5.8

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v9.5.8 (Antigravity AI Powered & DSPy Prompt Compiler)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## 🛡️ ASISTEN JOE v9.5.8 -- ANTIGRAVITY AI POWERED SUITE

Ekstensi pendamping Vibe Coding & Prompt Generator di Antigravity IDE / VS Code yang mengadopsi repositori open-source tingkat tinggi teruji dari GitHub:

1. **Integrasi AI Engine Native Antigravity IDE (v9.5.8):** Otomatis mendeteksi dan menggunakan model AI bawaan (Gemini 3.6 Flash / Antigravity LM) beserta kuota/token akun Antigravity Anda via `vscode.lm` API tanpa perlu menginput API Key manual.
2. **Dukungan Custom Token / API Key Opsional (v9.5.8):** Mendukung pengisian API Key kustom (`GEMINI_API_KEY` / `ANTIGRAVITY_API_KEY` di `.env` atau via setting `saasWorkflow.apiKey`) jika dijalankan di luar Antigravity IDE.
3. **DSPy & TextGrad Prompt Compiler (v9.5.7 - Stanford NLP adoption):** Menyusun instruksi prompt terstruktur berstandar industri dengan alur berpikir bertahap (*Chain-of-Thought / CoT*) dan umpan balik kesalahan.
4. **Pemformat & Auto-Fixer Sintaks Prompt Generator (v9.5.6):** Merapikan prompt kasar pengguna menjadi instruksi presisi terstruktur tanpa halusinasi AI.
5. **Penangan Kendala Mandiri / Smart Error Boundary (v9.5.5 - cline adoption):** Menangkap kendala tak terduga secara terpusat dengan aksi pemulihan mandiri.
6. **Pemulihan Status Draf Obrolan Otomatis (v9.5.4 - continuedev adoption):** Menyimpan draf ketikan secara real-time agar tidak hilang saat tab tertutup/reload.
7. **Akselerasi Kecepatan Cache Git 500ms (v9.5.3 - simple-git adoption):** Menghemat CPU hingga 70% dan membuat respon panel 3x lebih cepat.
8. **Pembersih Kode & Teks AI (v9.5.2 - strip-ansi adoption):** Menyaring zero-width spaces (`\u200B`) dan kode warna ANSI secara otomatis.
9. **Pembuat Dokumentasi API Otomatis (v9.5.0):** Menyusun berkas `DOKUMENTASI_API.md` berstandar OpenAPI/Swagger.
10. **Pengawal Performa & Ukuran Pustaka (v9.4.0):** Memindai pustaka berat (`moment`, `lodash`) dan memberikan alternatif ringan (`date-fns`, `lodash-es`).
11. **Generator Diagram Arsitektur Seketika (v9.3.0):** Diagram alur hubungan modul berbasis Mermaid.
12. **Visual Papan Tugas & Peta Jalan (v9.2.0):** Pemantau tiket pekerjaan `PETA_JALAN.md`.
13. **Ringkasan Eksekutif Manajemen (v9.1.0):** Laporan kesehatan sistem untuk manajemen.
14. **Sinkronisasi `.env.example` Otomatis (dotenv-safe adoption):** Otomatis mendeteksi variabel `process.env.XXX` baru.
15. **Pemindai Kerentanan Kode Statis (Semgrep SAST adoption):** Memindai celah SQL Injection, XSS, dan unhandled async errors.
16. **Sensor Kunci Rahasia 25+ Database:** Mendeteksi kebocoran Stripe, AWS, GitHub PAT, OpenAI, Claude, Midtrans, Xendit, dan URL Database secara real-time.

### 📲 Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas $\rightarrow$ Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-9.5.8.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-9.5.8.vsix)**

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

Proyek ini dilindungi secara resmi oleh **[GNU Affero General Public License v3.0 (AGPL v3)](file:///Users/user/Downloads/Prompt%20Engginer/LICENSE)** (Copyright 2026 Joe Aryadharma / Joe Company Agent Lab).
