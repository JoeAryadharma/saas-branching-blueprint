# 🏢 PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v9.8.0

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v9.8.0 (Micro-Scoped Prompt Slicer Engine)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## 🛡️ ASISTEN JOE v9.8.0 -- MICRO-SCOPED PROMPT SLICER ENGINE

Ekstensi pendamping Vibe Coding & Dedicated Prompt Generator di Antigravity IDE / VS Code yang mengadopsi repositori open-source tingkat tinggi teruji dari GitHub (`skills.sh`, `OpenClaw`, `Promptfoo`, & `Stanford DSPy`):

1. **Micro-Scoped Prompt Slicer Engine (v9.8.0):** Memotong instruksi bisnis/desain yang luas menjadi **Prompt Perintah Mikro Terisolasi 1-Berkas & Single-Component Lock**. Grafity hanya fokus pada berkas/komponen target tanpa mengacak-acak berkas lain.
2. **Kontrak Embargo Berkas (v9.8.0):** Menyuntikkan instruksi embargo mutlak yang melarang Grafity menyentuh atau merubah berkas/fungsi di luar ruang lingkup target.
3. **Injeksi Potongan Kode Target (v9.8.0):** Otomatis membaca editor aktif dan menyertakan potongan kode asli target di dalam prompt sehingga Grafity tidak perlu menebak-nebak kode mana yang diubah.
4. **Mode Design & Grafity Super-Prompt Engine (v9.7.0):** Menyusun **Super-Prompt Perintah Khusus untuk Grafity** yang dipagari oleh **5 Dinding Kontrak Kepatuhan**:
   - **Pagar 1:** Kontrak Antimalas & Anti-False Completion (melarang klaim selesai tanpa bukti verifikasi empiris).
   - **Pagar 2:** Design System Single Source of Truth (`BRAND.md` token lock: HSL warna, font, radius, shadow, & grid scale).
   - **Pagar 3:** Pengunci Ruang Lingkup & Audit Dependensi (Scope Lock).
   - **Pagar 4:** Alur Berpikir CoT (Perancangan $\rightarrow$ Eksekusi $\rightarrow$ Audit Dependensi $\rightarrow$ Verifikasi).
   - **Pagar 5:** Mandatory Verification Checklist (Grafity dipaksa mencentang 12 checklist sebelum menyatakan *Done*).
5. **Adopsi Standar `skills.sh` & Promptfoo Assertions (v9.7.0):** Menjamin seluruh hasil prompt memiliki batasan ketat agar AI eksekutor tidak melakukan kesalahan yang tidak diinginkan.
6. **Multi-Agent Sub-Task Swarm Orchestrator (v9.6.4):** Menjalankan alur 3 Sub-Agent Maya secara berurutan (**Software Architect $\rightarrow$ Lead Coder $\rightarrow$ SAST Security Auditor**).
7. **Inline CodeLens Provider (v9.6.3):** Menampilkan tombol aksi melayang `[🛡️ Asisten Joe: Susun Prompt Modul Ini]` tepat di atas baris deklarasi fungsi atau kelas pada editor.
8. **Hover Diagnostic Guard (v9.6.3):** Kartu peringatan kebocoran rahasia muncul otomatis saat kursor diarahkan ke variabel/kode yang mengandung API key atau URL database.
9. **Terminal Error Sensor & Repair Prompt (v9.6.2):** Menangkap pesan error kompilasi/terminal secara otomatis dan menyodorkan tombol pintas **`[Perbaiki Error Terminal]`**.
10. **Pure Prompt Output Enforcer (v9.6.1):** Seluruh respons, analisis, dan solusi dari Asisten Joe SELALU diformat sebagai **Draf Prompt Presisi Terstruktur (Prompt Generator Engine)**.
11. **Smart Context Compressor (v9.6.1):** Memangkas berkas dan `git diff` besar menjadi ringkasan simbol dan AST untuk **menghemat penggunaan token Antigravity hingga 70%**.
12. **Real-Time Token Streaming (v9.6.0):** Respons dari Antigravity AI mengalir kata demi kata secara real-time ke panel obrolan Webview tanpa penundaan.
13. **Integrasi AI Engine Native Antigravity IDE (v9.5.8):** Otomatis mendeteksi dan menggunakan model AI bawaan (Gemini 3.6 Flash / Antigravity LM) via `vscode.lm` API.
14. **DSPy & TextGrad Prompt Compiler (v9.5.7):** Menyusun instruksi prompt terstruktur berstandar industri.
15. **Penangan Kendala Mandiri / Smart Error Boundary (v9.5.5):** Menangkap kendala tak terduga secara terpusat dengan aksi pemulihan mandiri.
16. **Pemulihan Status Draf Obrolan Otomatis (v9.5.4):** Menyimpan draf ketikan secara real-time agar tidak hilang saat tab tertutup/reload.
17. **Pemuat API Spec OpenAPI/Swagger (v9.5.0):** Menyusun berkas `DOKUMENTASI_API.md`.
18. **Pengawal Performa & Pustaka (v9.4.0):** Memindai pustaka berat (`moment`, `lodash`) dan memberikan alternatif ringan.
19. **Pemindai Kerentanan Kode Statis (Semgrep SAST):** Memindai celah SQL Injection, XSS, dan unhandled async errors.
20. **Sensor Kunci Rahasia 25+ Database:** Mendeteksi kebocoran Stripe, AWS, GitHub PAT, OpenAI, Midtrans, dan URL Database secara real-time.

### 📲 Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas $\rightarrow$ Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-9.8.0.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-9.8.0.vsix)**

---

## 📌 Ruang Kerja Digital (Branching Structure)

Proyek ini menggunakan 6 ruang kerja terisolasi:
1. **`main` (Sistem Utama Aktif):** Live Output.
2. **`staging` (Ruang Simulasi Akhir):** Pre-release simulation.
3. **`close-packing` (Ruang Penutupan & Audit Akhir):** Code freeze.
4. **`develop` (Ruang Integrasi Tim):** Daily integration.
5. **`feature/*` (Ruang Kerja Fitur Baru):** Isolated feature branches.
6. **`hotfix/*` (Jalur Perbaikan Darurat):** Emergency hotfix.

---

## 📜 Lisensi & Perlindungan Hukum

Proyek ini dilindungi secara resmi oleh **[GNU Affero General Public License v3.0 (AGPL v3)](file:///Users/user/Downloads/Prompt%20Engginer/LICENSE)** (Copyright 2026 Joe Aryadharma / Joe Company Agent Lab).
