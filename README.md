# 🏢 PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v10.2.0

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v10.2.0 (Multi-Diagram Project Visualizer Suite)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## 🛡️ ASISTEN JOE v10.2.0 -- MULTI-DIAGRAM PROJECT VISUALIZER SUITE

Ekstensi pendamping Vibe Coding & Dedicated Prompt Generator di Antigravity IDE / VS Code yang mengadopsi repositori open-source tingkat tinggi teruji dari GitHub (`skills.sh`, `OpenClaw`, `Promptfoo`, & `Stanford DSPy`):

1. **Multi-Diagram Project Visualizer Engine (v10.2.0):** Menghasilkan 5 diagram visual utuh untuk proyek Anda berstandar Mermaid.js:
   - 🏢 **Diagram Arsitektur Makro (C4 Container):** Menggambarkan hubungan Client, Rute API, Middleware, Service, dan Database.
   - 🗄️ **Diagram Skema Database & Relasi (ERD):** Menggambarkan entitas Pengguna, Transaksi, Detail Pesanan, dan Produk.
   - 🔄 **Diagram Siklus Hidup Rute API (Sequence):** Menggambarkan alur panggilan dari Client $\rightarrow$ API $\rightarrow$ Vibe Guard $\rightarrow$ Database.
   - 🌿 **Diagram Alur Kerja Git Branching (GitGraph):** Menggambarkan siklus `feature/*` $\rightarrow$ `develop` $\rightarrow$ `main`.
   - 📅 **Diagram Peta Jalan & Schedule (Gantt Chart):** Menggambarkan timeline perancangan, pengembangan, dan rilis.
2. **Human-Friendly Layperson Commit Engine (v10.1.0):** Mengubah pesan commit teknis yang rumit menjadi **Bahasa Awam & Bahasa Bisnis yang Sangat Mudah Dibaca** oleh Klien, Product Manager, maupun Pemilik Bisnis non-teknis.
3. **Semantic Versioning Automator Engine (v10.0.0):** Mengotomatiskan & mengoptimalkan penomoran skema Semantic Versioning (`v[Major].[Minor].[Patch]` / `x.x.0`).
4. **Anti-Layout Mutation & Asset Guard Engine (v9.9.0):** Memutus kebiasaan buruk Grafity yang sering merusak Navbar, layout CSS, atau halaman web lain saat diminta sekadar mengganti gambar/foto. Mengunci pergantian HANYA pada atribut `src="..."` atau `background-image: url(...)` dengan batas **maksimal 1-3 baris git diff**!
5. **Micro-Scoped Prompt Slicer Engine (v9.8.0):** Memotong instruksi bisnis/desain yang luas menjadi **Prompt Perintah Mikro Terisolasi 1-Berkas & Single-Component Lock**.
6. **Kontrak Embargo Berkas (v9.8.0):** Menyuntikkan instruksi embargo mutlak yang melarang Grafity menyentuh atau merubah berkas/fungsi di luar ruang lingkup target.
7. **Injeksi Potongan Kode Target (v9.8.0):** Otomatis membaca editor aktif dan menyertakan potongan kode asli target di dalam prompt.
8. **Mode Design & Grafity Super-Prompt Engine (v9.7.0):** Menyusun **Super-Prompt Perintah Khusus untuk Grafity** yang dipagari oleh **5 Dinding Kontrak Kepatuhan**.
9. **Multi-Agent Sub-Task Swarm Orchestrator (v9.6.4):** Sinergi 3 Sub-Agent Maya (**Software Architect $\rightarrow$ Lead Coder $\rightarrow$ SAST Security Auditor**).
10. **Inline CodeLens Provider (v9.6.3):** Menampilkan tombol `[🛡️ Asisten Joe: Susun Prompt Modul Ini]` melayang di atas fungsi/kelas editor.
11. **Hover Diagnostic Guard (v9.6.3):** Kartu peringatan kebocoran rahasia otomatis saat kursor diarahkan ke kode.
12. **Terminal Error Sensor & Repair Prompt (v9.6.2):** Menangkap pesan error terminal & menyusun Draf Prompt Perbaikan (DSPy).
13. **Pure Prompt Output Enforcer (v9.6.1):** Seluruh respons Asisten Joe SELALU diformat sebagai **Draf Prompt Presisi Terstruktur**.
14. **Smart Context Compressor (v9.6.1):** Memangkas diff/konteks proyek besar untuk menghemat token Antigravity hingga 70%.
15. **Real-Time Token Streaming (v9.6.0):** Respons AI mengalir kata demi kata secara real-time ke panel obrolan Webview.

### 📲 Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas $\rightarrow$ Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-10.2.0.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-10.2.0.vsix)**

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
