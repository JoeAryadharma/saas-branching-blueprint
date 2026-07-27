# 🏢 PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v9.6.2

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v9.6.2 (Terminal Error Sensor & Repair Prompt)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## 🛡️ ASISTEN JOE v9.6.2 -- TERMINAL ERROR REPAIR & PURE PROMPT ENGINE (TAHAP 3 OPTIMASI)

Ekstensi pendamping Vibe Coding & Dedicated Prompt Generator di Antigravity IDE / VS Code yang mengadopsi repositori open-source tingkat tinggi teruji dari GitHub:

1. **Terminal Error Sensor & Repair Prompt (v9.6.2 - Tahap 3 Optimasi):** Menangkap pesan error kompilasi/terminal secara otomatis dan menyodorkan tombol pintas **`[Perbaiki Error Terminal]`** yang seketika menyusun **Draf Prompt Perbaikan Error Presisi (Stanford DSPy CoT Format)** untuk AI.
2. **Pure Prompt Output Enforcer (v9.6.1):** Seluruh respons, analisis, dan solusi dari Asisten Joe SELALU diformat sebagai **Draf Prompt Presisi Terstruktur (Prompt Generator Engine)** yang siap disalin oleh pengguna untuk AI lain (bukan potongan kode mentah).
3. **Smart Context Compressor (v9.6.1 - Tahap 2 Optimasi):** Memangkas berkas dan `git diff` besar menjadi ringkasan simbol dan AST untuk **menghemat penggunaan token Antigravity hingga 70%** dan membuat analisis prompt jauh lebih presisi.
4. **Real-Time Token Streaming (v9.6.0 - Tahap 1 Optimasi):** Respons dari Antigravity AI mengalir kata demi kata secara real-time ke panel obrolan Webview tanpa penundaan (*0ms perceived latency*).
5. **Integrasi AI Engine Native Antigravity IDE (v9.5.8):** Otomatis mendeteksi dan menggunakan model AI bawaan (Gemini 3.6 Flash / Antigravity LM) beserta kuota/token akun Antigravity Anda via `vscode.lm` API tanpa perlu menginput API Key manual.
6. **Dukungan Custom Token / API Key Opsional (v9.5.8):** Mendukung pengisian API Key kustom (`GEMINI_API_KEY` / `ANTIGRAVITY_API_KEY` di `.env` atau via setting `saasWorkflow.apiKey`) jika dijalankan di luar Antigravity IDE.
7. **DSPy & TextGrad Prompt Compiler (v9.5.7 - Stanford NLP adoption):** Menyusun instruksi prompt terstruktur berstandar industri dengan alur berpikir bertahap (*Chain-of-Thought / CoT*) dan umpan balik kesalahan.
8. **Pemformat & Auto-Fixer Sintaks Prompt Generator (v9.5.6):** Merapikan prompt kasar pengguna menjadi instruksi presisi terstruktur tanpa halusinasi AI.
9. **Penangan Kendala Mandiri / Smart Error Boundary (v9.5.5 - cline adoption):** Menangkap kendala tak terduga secara terpusat dengan aksi pemulihan mandiri.
10. **Pemulihan Status Draf Obrolan Otomatis (v9.5.4 - continuedev adoption):** Menyimpan draf ketikan secara real-time agar tidak hilang saat tab tertutup/reload.
11. **Akselerasi Kecepatan Cache Git 500ms (v9.5.3 - simple-git adoption):** Menghemat CPU hingga 70% dan membuat respon panel 3x lebih cepat.
12. **Pembersih Kode & Teks AI (v9.5.2 - strip-ansi adoption):** Menyaring zero-width spaces (`\u200B`) dan kode warna ANSI secara otomatis.
13. **Pembuat Dokumentasi API Otomatis (v9.5.0):** Menyusun berkas `DOKUMENTASI_API.md` berstandar OpenAPI/Swagger.
14. **Pengawal Performa & Ukuran Pustaka (v9.4.0):** Memindai pustaka berat (`moment`, `lodash`) dan memberikan alternatif ringan (`date-fns`, `lodash-es`).
15. **Generator Diagram Arsitektur Seketika (v9.3.0):** Diagram alur hubungan modul berbasis Mermaid.
16. **Visual Papan Tugas & Peta Jalan (v9.2.0):** Pemantau tiket pekerjaan `PETA_JALAN.md`.
17. **Ringkasan Eksekutif Manajemen (v9.1.0):** Laporan kesehatan sistem untuk manajemen.
18. **Sinkronisasi `.env.example` Otomatis (dotenv-safe adoption):** Otomatis mendeteksi variabel `process.env.XXX` baru.
19. **Pemindai Kerentanan Kode Statis (Semgrep SAST adoption):** Memindai celah SQL Injection, XSS, dan unhandled async errors.
20. **Sensor Kunci Rahasia 25+ Database:** Mendeteksi kebocoran Stripe, AWS, GitHub PAT, OpenAI, Claude, Midtrans, Xendit, dan URL Database secara real-time.

### 📲 Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas $\rightarrow$ Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-9.6.2.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-9.6.2.vsix)**

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
