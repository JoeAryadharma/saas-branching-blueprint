# PUSAT REPOSITORI SAAS & EKSTENSI ASISTEN JOE v10.7.0

Selamat datang di repositori resmi **SaaS Branching Blueprint** dan **Ekstensi Asisten Joe v10.7.0 (Object-Agnostic Emergency Brakes Suite)**. Dokumen ini disusun untuk memberikan panduan alur kerja digital dan pengoperasian ekstensi pengawal Vibe Coding di Antigravity IDE.

---

## ASISTEN JOE v10.7.0 -- OBJECT-AGNOSTIC EMERGENCY BRAKES SUITE

Ekstensi pendamping Vibe Coding & Dedicated Prompt Generator di Antigravity IDE / VS Code yang mengadopsi repositori open-source tingkat tinggi teruji dari GitHub (`skills.sh`, `OpenClaw`, `Promptfoo`, & `Stanford DSPy`):

1. **Object-Agnostic Emergency Brakes Engine (v10.7.0):** Sistem Rem Darurat Mutlak Generik Universal yang Berkelakuan Abstrak Tanpa Hardcode Objek Spesifik:
   - Target Scope Isolation Brake: Mengunci eksekusi secara absolut pada berkas target `${targetFile}` tanpa memicu Scope Creep.
   - Non-Target Embargo Brake: Melarang keras merubah, menghapus, atau merusak komponen, modul, fungsi, atau berkas tetangga di luar target.
   - Architectural & Design Standard Constraint Brake: Memaksa kepatuhan standar proyek (`BRAND.md` untuk UI, OpenAPI/REST untuk API, Normalisasi 3NF untuk DB, Standar CLI) tanpa menyuntikkan *ghost pattern*.
   - Minimal Mutation Threshold Brake: Membatasi perubahan `git diff` seminimal mungkin pada area kerja presisi.
2. **Visual Page Inspector & IDE Prompt Generator Engine (v10.6.0):** Alur kerja inspeksi visual halaman web (memecah halaman web menjadi komponen terisolasi).
3. **Interactive Before & After Design Preview Modal Engine (v10.5.0):** Menampilkan Pop-Up Modal simulasi pratinjau visual komparasi tampilan **SEBELUM (AS-IS)** vs **SESUDAH (TO-BE)** secara interaktif.
4. **RDBMS Architecture & Migration Guard Engine (v10.4.0):** Audit otomatis skema basis data relasional (Normalisasi 3NF, Indeks B-Tree FK, Zero-Downtime Migration, SAST SQL Injection Guard).
5. **AS-IS vs. TO-BE Architectural Transformation Engine (v10.3.0):** Generator perbandingan visual side-by-side kondisi arsitektur sistem saat ini (**AS-IS**) lawan kondisi arsitektur target setelah prompt dieksekusi (**TO-BE**).
6. **Multi-Diagram Project Visualizer Engine (v10.2.0):** Menghasilkan 5 diagram visual utuh untuk proyek Anda berstandar Mermaid.js.
7. **Human-Friendly Layperson Commit Engine (v10.1.0):** Mengubah pesan commit teknis yang rumit menjadi **Format Pesan Commit Ringkas & Terstruktur** yang Sangat Mudah Dibaca oleh Klien dan Product Manager.
8. **Semantic Versioning Automator Engine (v10.0.0):** Mengotomatiskan & mengoptimalkan penomoran skema Semantic Versioning (`v[Major].[Minor].[Patch]` / `x.x.0`).
9. **Anti-Layout Mutation & Asset Guard Engine (v9.9.0):** Memutus kebiasaan buruk Grafity yang sering merusak Navbar, layout CSS, atau halaman web lain saat diminta sekadar mengganti gambar/foto.

### Pemasangan Ekstensi (.vsix)

1. Buka **Extensions** di Antigravity IDE (`Cmd + Shift + X`).
2. Klik `...` di kanan atas -> Pilih **"Install from VSIX..."**.
3. Pilih berkas rilis resmi:  
   👉 **[saas-workflow-ide-plugin-10.7.0.vsix](file:///Users/user/Downloads/Prompt%20Engginer/plugin-ide/saas-workflow-ide-plugin-10.7.0.vsix)**

---

## VISUALISASI ARSITEKTUR SISTEM (7 DIAGRAM SISTEM)

Berikut adalah 7 Diagram Visual yang disajikan murni tanpa kode HTML, tanpa tag div, dan tanpa emoji:

### 1. DIAGRAM PETA 6 LAPISAN UTAMA SISTEM

```mermaid
flowchart TD
    classDef default text-align:center;
    SYSTEM["ASISTEN JOE v10.7.0\nManajer Utama Sistem Aplikasi\nPengawal Penuh Seluruh Layanan"]

    SYSTEM --> L1["1. LAPISAN VISUAL DAN TAMPILAN DEPAN\nMengatur Halaman Utama dan Tombol\nMenampilkan Pratinjau Sebelum dan Sesudah"]
    SYSTEM --> L2["2. LAPISAN SERVER DAN ATURAN BISNIS\nMengelola Logika Bisnis dan Transaksi\nMengirim Pesan Otomatis dan Otentikasi"]
    SYSTEM --> L3["3. LAPISAN PENYIMPANAN DATA\nMenyimpan Data Pengguna dan Produk\nMemperbarui Data Tanpa Mematikan Website"]
    SYSTEM --> L4["4. LAPISAN KEAMANAN DAN BENTENG\nMemeriksa Kunci Rahasia Aplikasi\nMelindungi Data Dari Celah Peretasan"]
    SYSTEM --> L5["5. LAPISAN OTOMATISASI DAN DEVOPS\nMencatat Pembaruan Sistem Terstruktur\nMenyimpan Hasil Pekerjaan ke Ruang Rilis"]
    SYSTEM --> L6["6. LAPISAN PERFORMA DAN BENGKEL\nMembersihkan Pustaka Penyebab Lambat\nMemperbaiki Otomatis Saat Terjadi Kendala"]
```

### 2. DIAGRAM ALUR KERJA UTAMA

```mermaid
flowchart TD
    classDef default text-align:center;
    subgraph PERINTAH["1. PENGGUNA MEMBERI INSTRUKSI"]
        A["Pengguna Mengetik Instruksi Bisnis\nMeminta Pembaruan Halaman Web Utama\nContoh Mengganti Gambar Banner Utama"]
    end

    subgraph MANAJER["2. ASISTEN JOE MEMASANG REM DARURAT"]
        B["Inspektur Visual Menganalisis Halaman\nMemecah Halaman Web Utama\nMenjadi Bagian Komponen Kecil Terisolasi"]
        C["Pop Up Pratinjau Menampilkan Gambar\nMembandingkan Hasil Tampilan Visual\nKondisi Sebelum dan Sesudah Diproses"]
        D["Asisten Joe Memasang Rem Darurat\nMengunci Area Kerja Pengerja Otomatis\nHanya Boleh Mengubah Satu Berkas Target"]
    end

    subgraph EKSEKUSI["3. PENGERJA OTOMATIS BEKERJA AMAN"]
        E["Pengerja Otomatis Menerima Perintah\nMengerjakan Tugas Secara Presisi\nMematuhi Aturan 4 Rem Darurat Mutlak"]
        F["Pekerjaan Selesai Secara Aman\nMengubah Bagian Target Sempurna\nTanpa Merusak Bagian Tetangga Lainnya"]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
```

### 3. DIAGRAM PETA 4 PILAR PELINDUNG SISTEM (DIAGRAM LR - RATA KIRI)

```mermaid
flowchart LR
    classDef default text-align:left;
    SYSTEM["ASISTEN JOE v10.7.0\nPengawal Utama Vibe Coding\nPelindung Keamanan Aplikasi"]

    SYSTEM --> PILAR1["1. Inspektur Visual Halaman\nMemilih Bagian Komponen Target\nUntuk Dianalisis Sebelum Diubah"]
    SYSTEM --> PILAR2["2. Pratinjau Visual Interaktif\nMenampilkan Proyeksi Tampilan\nSebelum Data Asli Diubah"]
    SYSTEM --> PILAR3["3. 4 Rem Darurat Mutlak\nMengunci Area Kerja Pengerja\nMencegah Kerusakan Bagian Tetangga"]
    SYSTEM --> PILAR4["4. Audit Keamanan Utama\nMemeriksa Kebocoran Kunci Rahasia\nMenutup Celah Peretasan Hacker"]

    style SYSTEM text-align:left
    style PILAR1 text-align:left
    style PILAR2 text-align:left
    style PILAR3 text-align:left
    style PILAR4 text-align:left
```

### 4. DIAGRAM TRANSFORMASI ARSITEKTUR

```mermaid
flowchart TD
    classDef default text-align:center;
    subgraph SEBELUM["KONDISI SEBELUMNYA (AS-IS)"]
        A1["Kondisi Sebelumnya (AS-IS)\nMenggunakan Tampilan dan Bagian Lama\nBelum Memiliki Fitur Baru"]
        A2["Risiko Pengerjaan Manual\nMenyebabkan Kesalahan Koding\nBerisiko Merusak Bagian Tetangga"]
    end

    subgraph PROSES["PROSES PENGAWASAN ASISTEN JOE"]
        P1["Pengawasan Asisten Joe\nMenganalisis Berkas Target Presisi\nMengunci Scope Ruang Kerja"]
    end

    subgraph SESUDAH["KONDISI HASIL TARGET (TO-BE)"]
        B1["Kondisi Target Baru (TO-BE)\nMemasang Fitur Baru Presisi\nSeluruh Bagian Tetangga Utuh Aman"]
        B2["Penyimpanan Data Otomatis\nMemverifikasi Pekerjaan Bersih\nSiap Digunakan Oleh Pengguna Live"]
    end

    SEBELUM --> PROSES
    PROSES --> SESUDAH
```

### 5. DIAGRAM SIKLUS PERJALANAN FITUR BARU

```mermaid
sequenceDiagram
    autonumber
    actor User as Anda (Pemilik Bisnis)
    participant Joe as Asisten Joe (Manajer AI)
    participant Pengerja as Pengerja Otomatis
    participant Penyimpanan as Penyimpanan Utama

    User->>Joe: 1. Masukkan Ide atau Fitur Baru
    Joe->>User: 2. Tampilkan Pratinjau Visual dan Draf Perintah
    User-->>Joe: 3. Tekan Tombol [Setujui dan Salin Perintah]
    Joe->>Pengerja: 4. Kirim Instruksi Terkunci 4 Rem Darurat
    Pengerja-->>Joe: 5. Pengerjaan Selesai
    Joe->>Joe: 6. Uji Keamanan dan Bebas Kebocoran Data
    Joe->>Penyimpanan: 7. Simpan Hasil Pekerjaan dengan Catatan Pembaruan Sistem
    Joe-->>User: 8. Laporan: Fitur Berhasil Diluncurkan!
```

### 6. DIAGRAM STRUKTUR RELASI DATA PROMPT ENGINEERING

```mermaid
flowchart TD
    classDef default text-align:center;
    subgraph DATA["STRUKTUR HUBUNGAN DATA PROMPT ENGINEERING"]
        PENGGUNA["Data Prompt Engineer\nMenyimpan Identitas Akun Pengguna\nMencatat Status Ruang Kerja Aktif"]
        
        PROMPT["Data Draf Super Prompt\nMenyimpan Instruksi Komponen Target\nMengunci Aturan 4 Rem Darurat Mutlak"]
        
        AUDIT["Data Riwayat Audit Keamanan\nMenyimpan Catatan Hasil Uji SAST\nMemastikan Bebas Kebocoran Data"]
    end

    PENGGUNA --> PROMPT
    PROMPT --> AUDIT
```

### 7. DIAGRAM PETA ALUR RUANG KERJA DAN RILIS SISTEM

```mermaid
flowchart TD
    classDef default text-align:center;
    subgraph ALUR["ALUR RUANG KERJA DAN RILIS APLIKASI"]
        FITUR["Ruang Kerja Fitur Baru\nMengerjakan Fitur Baru Terisolasi\nAgar Tidak Mengganggu Aplikasi Utama"]
        
        UJI["Pengujian Keamanan Sistem\nMemeriksa Ulang Celah Peretasan\nMenguji Keutuhan Seluruh Data"]
        
        UTAMA["Ruang Kerja Utama Live\nMengaktifkan Aplikasi Utama Terbarui\nSiap Digunakan Oleh Pengguna Secara Live"]
    end

    FITUR --> UJI
    UJI --> UTAMA
```

---

## Ruang Kerja Digital (Branching Structure)

Proyek ini menggunakan 6 ruang kerja terisolasi:
1. **`main` (Sistem Utama Aktif):** Live Output.
2. **`staging` (Ruang Simulasi Akhir):** Pre-release simulation.
3. **`close-packing` (Ruang Penutupan & Audit Akhir):** Code freeze.
4. **`develop` (Ruang Integrasi Tim):** Daily integration.
5. **`feature/*` (Ruang Kerja Fitur Baru):** Isolated feature branches.
6. **`hotfix/*` (Jalur Perbaikan Darurat):** Emergency hotfix.

---

## Lisensi & Perlindungan Hukum

Proyek ini dilindungi secara resmi oleh **[GNU Affero General Public License v3.0 (AGPL v3)](file:///Users/user/Downloads/Prompt%20Engginer/LICENSE)** (Copyright 2026 Joe Aryadharma / Joe Company Agent Lab).
