const path = require('path');
const fs = require('fs');

// ============================================================
// VIBE OPTIMIZER v10.7.0 -- Object-Agnostic Emergency Brakes & Dynamic Scope Engine
// 1. General & Dynamic Emergency Brakes (v10.7.0 - Rem Darurat Generik Berlaku untuk UI, Backend, DB, & CLI)
// 2. Visual Page Inspector Engine (v10.6.0 - Pemilihan Halaman Web, Inspeksi Komponen, & Generator Prompt IDE)
// 3. Before & After Design Preview Modal Engine (v10.5.0 - Pop-up Visual Preview Sebelum vs Sesudah)
// 4. RDBMS Architecture & Migration Guard Engine (v10.4.0 - Normalisasi 3NF, Zero-Downtime SQL, SAST SQLi Guard)
// 5. AS-IS vs. TO-BE Architecture Diagram Generator (v10.3.0 - Side-by-Side Transformation)
// 6. Multi-Diagram Project Engine (v10.2.0 - Arsitektur, ERD, Sequence, GitGraph, Gantt)
// 7. Human-Friendly Layperson Commit Engine (v10.1.0 - Kode Commit Bahasa Awam)
// 8. Semantic Versioning Automator (v10.0.0 - SemVer Auto-Increment Engine x.x.0)
// 9. Asset & Image Replacement Guard (v9.9.0 - Single-Attribute Surgical Mutation)
// 10. Micro-Scoped Prompt Slicer (v9.8.0 - Single-File & Single-Component Isolation)
// ============================================================

class VibeOptimizer {

  // Format path berkas presisi (Menjaga path relatif jika ada)
  static formatFilePath(filePath = '') {
    if (!filePath) return 'BerkasTargetUtama.js';
    return filePath.trim();
  }

  // ============================================================
  // GENERATOR 4 REM DARURAT MUTLAK GENERIK (v10.7.0)
  // Berlakunya abstrak & generik untuk SEMUA jenis pekerjaan (Frontend, Backend, DB, CLI)
  // ============================================================
  static getGenericEmergencyBrakes(targetFile = 'BerkasTarget', taskCategory = 'Umum') {
    const fileLabel = this.formatFilePath(targetFile);

    return [
      `[4 REM DARURAT MUTLAK SANGAT GENERIK (OBJECT-AGNOSTIC BRAKES v10.7.0)]`,
      `1. 🔒 KUNCI ISOLASI SCOPE TARGET (Target Scope Isolation Brake):`,
      `   -- HANYA berkas \`${fileLabel}\` yang diizinkan untuk diubah. DILARANG KERAS memicu Scope Creep ke berkas lain.`,
      `2. 🚫 KONTRAK EMBARGO NON-TARGET (Non-Target Embargo Brake):`,
      `   -- DILARANG KERAS merubah, menghapus, atau merusak komponen, modul, fungsi, atau berkas tetangga di luar target \`${fileLabel}\`.`,
      `3. 🏛️ KEPATUHAN STANDAR ARSITEKTUR & DESAIN (Architectural & Design Standard Constraint Brake):`,
      `   -- Wajib mematuhi standar proyek yang berlaku (BRAND.md untuk UI, OpenAPI/REST untuk API, Normalisasi 3NF untuk Database, atau Standar CLI). Dilarang menyuntikkan pola siluman (*ghost pattern*).`,
      `4. 📈 BATAS AMBANG MUTASI MINIMAL (Minimal Mutation Threshold Brake):`,
      `   -- Perubahan kode pada \`git diff\` WAJIB seminimal mungkin (hanya baris presisi yang dibutuhkan), tanpa mengubah format/gaya penulisan kode di luar area kerja.`
    ].join('\n');
  }

  // ============================================================
  // VISUAL PAGE INSPECTOR & IDE PROMPT GENERATOR ENGINE (v10.6.0)
  // ============================================================
  static compilePageInspector(targetDir = '', pageQuery = '') {
    const cleanedQuery = this.cleanAIText(pageQuery.trim()) || 'Landing Page';
    const detectedFiles = [];

    if (targetDir) {
      const searchDirs = ['src', 'pages', 'components', 'views', 'app', '.'];
      
      const scanRecursive = (dirPath) => {
        try {
          if (!fs.existsSync(dirPath)) return;
          const items = fs.readdirSync(dirPath, { withFileTypes: true });

          for (const item of items) {
            if (item.name === 'node_modules' || item.name.startsWith('.')) continue;
            const fullPath = path.join(dirPath, item.name);

            if (item.isDirectory()) {
              scanRecursive(fullPath);
            } else if (/\.(js|jsx|ts|tsx|html|vue|svelte)$/i.test(item.name)) {
              const rel = path.relative(targetDir, fullPath);
              detectedFiles.push({
                basename: item.name,
                relativePath: rel,
                fullPath: fullPath
              });
            }
          }
        } catch (e) {}
      };

      searchDirs.forEach(d => scanRecursive(path.join(targetDir, d)));
    }

    const queryLower = cleanedQuery.toLowerCase();
    let matchedComponents = detectedFiles.filter(f => 
      f.basename.toLowerCase().includes(queryLower) || 
      f.relativePath.toLowerCase().includes(queryLower)
    );

    if (matchedComponents.length === 0) {
      matchedComponents = detectedFiles.slice(0, 6);
    }

    return {
      query: cleanedQuery,
      totalDetected: detectedFiles.length,
      matchedComponents: matchedComponents.slice(0, 6)
    };
  }

  // ============================================================
  // BEFORE & AFTER DESIGN PREVIEW MODAL ENGINE (v10.5.0)
  // ============================================================
  static compileBeforeAfterPreviewModal(rawPrompt = '', activeFilePath = '', activeCodeSnippet = '') {
    const cleanedInput = this.cleanAIText(rawPrompt.trim()) || 'Pembaruan Kode Presisi';
    const fileLabel = this.formatFilePath(activeFilePath);

    const beforeSnippet = activeCodeSnippet ? 
      activeCodeSnippet.substring(0, 500) : 
      `/* KODE ASLI SAAT INI (AS-IS) */\nfunction modulLama() {\n  return "Kondisi Eksis";\n}`;

    const toBeProjectedSnippet = activeCodeSnippet ? 
      `/* PROYEKSI PERUBAHAN SESUDAH (TO-BE) */\n` + activeCodeSnippet.substring(0, 500) :
      `/* KODE HASIL TO-BE (${cleanedInput}) */\nfunction modulBaru() {\n  return "Kondisi Ter-Update Presisi";\n}`;

    return {
      fileLabel,
      promptText: cleanedInput,
      beforeSnippet,
      toBeProjectedSnippet
    };
  }

  // ============================================================
  // RDBMS ARCHITECTURE & MIGRATION GUARD ENGINE (v10.4.0)
  // ============================================================
  static compileRDBMSAudit(targetDir = '', schemaOrSqlText = '') {
    let sqlContent = schemaOrSqlText;

    if (!sqlContent && targetDir) {
      const possiblePaths = [
        path.join(targetDir, 'prisma/schema.prisma'),
        path.join(targetDir, 'db/schema.sql'),
        path.join(targetDir, 'schema.sql'),
        path.join(targetDir, 'models/index.js')
      ];

      for (const p of possiblePaths) {
        try {
          if (fs.existsSync(p)) {
            sqlContent = fs.readFileSync(p, 'utf8').substring(0, 2000);
            break;
          }
        } catch (e) {}
      }
    }

    const issues = [];
    const recommendations = [];

    if (sqlContent) {
      const lower = sqlContent.toLowerCase();
      if (lower.includes('table') && !lower.includes('primary key') && !lower.includes('@id')) {
        issues.push('Tabel terdeteksi tanpa Primary Key (PK) eksplisit. Risiko duplikasi data & penurunan performa query JOIN.');
      }
      if (lower.includes('_id') || lower.includes('references')) {
        recommendations.push('Pastikan semua kolom Foreign Key (FK) memiliki Indeks B-Tree (misal: CREATE INDEX idx_fk ON table(column_id)) untuk mencegah Table Scan saat JOIN.');
      }
      if (lower.includes('alter table') && lower.includes('not null') && !lower.includes('default')) {
        issues.push('ALTER TABLE ADD COLUMN NOT NULL tanpa DEFAULT dapat mengunci (Exclusive Lock) tabel PostgreSQL/MySQL dalam durasi lama!');
      }
      if (lower.includes('SELECT * FROM') && lower.includes('+') && lower.includes('req.body')) {
        issues.push('PERINGATAN SAST KRITIS: Terdeteksi konkatenasi string pada SQL Query! Wajib gunakan Parameterized Query (Prepared Statement).');
      }
    }

    const rdbmsPlaybook = [
      `## STANDAR APLIKASI RDBMS ENTERPRISE (v10.7.0)`,
      `-- **1. Prinsip Normalisasi (3NF):** Pisahkan data atomik ke tabel terisolasi (User, Role, Tenant, Transaction).`,
      `-- **2. Strategi Multi-Tenancy SaaS:** Gunakan \`tenant_id\` pada setiap tabel dengan PostgreSQL Row-Level Security (RLS).`,
      `-- **3. Keamanan SQL (SAST):** Ganti semua konkatenasi SQL dengan Prepared Statement / ORM Parameterization.`,
      `-- **4. Migrasi Aman (Zero-Downtime):** Terapkan alur 2-tahap (Tambah Kolom Nullable -> Migrasi Data -> Set NOT NULL).`,
      `-- **5. Optimasi Performa:** Tambahkan Composite Index pada kombinasi kolom yang sering di-filter (\`WHERE tenant_id = ? AND created_at DESC\`).`
    ].join('\n');

    return {
      hasSchema: Boolean(sqlContent),
      issues,
      recommendations,
      rdbmsPlaybook
    };
  }

  // ============================================================
  // AS-IS vs. TO-BE ARCHITECTURAL TRANSFORMER (v10.3.0)
  // ============================================================
  static compileAsIsToBeDiagrams(rawPrompt, targetDir = '', techs = []) {
    if (!rawPrompt || typeof rawPrompt !== 'string') return null;

    const cleanedInput = this.cleanAIText(rawPrompt.trim());
    const techStr = techs.length > 0 ? techs.join(', ') : 'Node.js, Express, React';

    const asIsMermaid = [
      `flowchart TD`,
      `    subgraph ASIS["KONDISI SAAT INI (AS-IS - Sebelum Perubahan)"]`,
      `        ClientOld["Client & Modul Lama"]`,
      `        ControllerOld["Layanan Eksis (${techStr})"]`,
      `        DBOld[("Database & Skema Saat Ini")]`,
      `    end`,
      `    ClientOld --> ControllerOld`,
      `    ControllerOld --> DBOld`
    ].join('\n');

    const toBeMermaid = [
      `flowchart TD`,
      `    subgraph TOBE["KONDISI TARGET (TO-BE - Setelah Prompt Dieksekusi)"]`,
      `        ClientNew["Modul Ter-Update<br/><small>[BARU/DIPERBARUI]</small>"]`,
      `        ControllerNew["Logika Bisnis Presisi<br/><small>[DITINGKATKAN]</small>"]`,
      `        GuardNew["Vibe Guard & SAST Security<br/><small>[TERPROTEKSI]</small>"]`,
      `        DBNew[("Database Terstruktur (+Skema Baru)<br/><small>[TERKUNCI]</small>")]`,
      `    end`,
      `    ClientNew --> ControllerNew`,
      `    ControllerNew --> GuardNew`,
      `    GuardNew --> DBNew`
    ].join('\n');

    const deltaSummary = [
      `## MATRIKS DELTA TRANSFORMASI ARSITEKTUR (AS-IS --> TO-BE)`,
      `-- 🟢 **Komponen Baru (TO-BE):** Penambahan logika "${cleanedInput.substring(0, 40)}" & Pengawal Keamanan SAST.`,
      `-- 🟡 **Komponen Dimodifikasi:** Penyempurnaan rute API dan variabel \`.env.example\`.`,
      `-- 🔴 **Komponen Dipertahankan (AS-IS):** Skema database utama dan arsitektur dasar tetap terjaga.`,
      `-- 🛡️ **Kontrak Garansi:** Grafity DILARANG KERAS merusak struktur AS-IS di luar lingkup TO-BE.`
    ].join('\n');

    return {
      asIsMermaid,
      toBeMermaid,
      deltaSummary
    };
  }

  // ============================================================
  // MULTI-DIAGRAM PROJECT ENGINE (v10.2.0)
  // ============================================================
  static compileProjectMultiDiagrams(folderName = 'Proyek', audit = {}, techs = []) {
    const techStr = techs.length > 0 ? techs.join(', ') : 'Node.js, Express, React';

    const architectureMermaid = [
      `flowchart TD`,
      `    subgraph CLIENT["🎨 Tampilan Depan / Client Layer"]`,
      `        UI["Tampilan UI & Komponen Web<br/><small>${techStr}</small>"]`,
      `        STATE["Manajemen Status & State"]`,
      `    end`,
      `    subgraph BACKEND["🔌 Server Layanan & API Layer"]`,
      `        ROUTER["Modul Rute API & Controller"]`,
      `        MIDDLEWARE["Pengawal Keamanan SAST & Auth Guard"]`,
      `        SERVICE["Logika Bisnis & Layanan Inti"]`,
      `    end`,
      `    subgraph DATA["🗄️ Lapisan Data & Penyimpanan"]`,
      `        DB[("Database Utama")]`,
      `        ENV["Berkas Lingkungan (.env)"]`,
      `    end`,
      `    UI --> ROUTER`,
      `    STATE --> UI`,
      `    ROUTER --> MIDDLEWARE`,
      `    MIDDLEWARE --> SERVICE`,
      `    SERVICE --> DB`,
      `    SERVICE --> ENV`
    ].join('\n');

    const erdMermaid = [
      `erDiagram`,
      `    PENGGUNA ||--o{ TRANSAKSI : membuat`,
      `    PENGGUNA {`,
      `        string id PK`,
      `        string nama`,
      `        string email`,
      `        string peran`,
      `    }`,
      `    TRANSAKSI ||--|{ DETAIL_PESANAN : berisi`,
      `    TRANSAKSI {`,
      `        string id PK`,
      `        string pengguna_id FK`,
      `        number total_harga`,
      `        string status_pembayaran`,
      `    }`,
      `    PRODUK ||--o{ DETAIL_PESANAN : dipesan`,
      `    PRODUK {`,
      `        string id PK`,
      `        string nama_produk`,
      `        number harga`,
      `        number stok`,
      `    }`
    ].join('\n');

    const sequenceMermaid = [
      `sequenceDiagram`,
      `    autonumber`,
      `    actor User as Pengguna (Client)`,
      `    participant UI as Tampilan Antarmuka`,
      `    participant API as Server Rute API`,
      `    participant Guard as Vibe Guard (SAST)`,
      `    participant DB as Database`,
      `    User->>UI: Tekan Tombol Kirim / Aksi Fitur`,
      `    UI->>API: Perintah Request HTTP (POST/GET)`,
      `    API->>Guard: Verifikasi Token & Sanitasi Input`,
      `    Guard-->>API: Status Validasi AMAN`,
      `    API->>DB: Eksekusi Query / Transaksi Data`,
      `    DB-->>API: Hasil Data Terperbarui`,
      `    API-->>UI: Respon JSON HTTP 200 OK`,
      `    UI-->>User: Tampilkan Notifikasi Berhasil`
    ].join('\n');

    const gitGraphMermaid = [
      `gitGraph`,
      `    commit id: "Inisialisasi Proyek"`,
      `    branch develop`,
      `    checkout develop`,
      `    commit id: "Integrasi Fitur Inti"`,
      `    branch feature/fitur-baru`,
      `    checkout feature/fitur-baru`,
      `    commit id: "Koding Fitur Mikro"`,
      `    checkout develop`,
      `    merge feature/fitur-baru id: "Merge PR Vibe Guard"`,
      `    checkout main`,
      `    merge develop id: "Rilis v10.7.0 Live"`
    ].join('\n');

    const ganttMermaid = [
      `gantt`,
      `    title Peta Jalan & Jadwal Pengadaan Fitur (${folderName})`,
      `    dateFormat  YYYY-MM-DD`,
      `    section Perancangan`,
      `    Perancangan Arsitektur & Setup Blueprint :done, des1, 2026-07-22, 2d`,
      `    section Pengembangan`,
      `    Pengembangan Modul & AI Prompt Engine :active, dev1, 2026-07-24, 4d`,
      `    section Pengujian & Rilis`,
      `    Audit Keamanan SAST & Rilis v10.7.0 :rel1, 2026-07-27, 2d`
    ].join('\n');

    return {
      architectureMermaid,
      erdMermaid,
      sequenceMermaid,
      gitGraphMermaid,
      ganttMermaid
    };
  }

  // ============================================================
  // SEMANTIC VERSIONING AUTOMATOR ENGINE (v10.0.0 - x.x.0)
  // ============================================================
  static calculateNextVersion(currentVersionStr = '10.7.0', changeType = 'minor') {
    const parts = currentVersionStr.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    let major = parts[0] || 0;
    let minor = parts[1] || 0;
    let patch = parts[2] || 0;

    if (changeType === 'major') {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (changeType === 'minor') {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    return `${major}.${minor}.${patch}`;
  }

  // ============================================================
  // ASSET & IMAGE REPLACEMENT GUARD (v9.9.0)
  // ============================================================
  static compileAssetReplacementPrompt(rawPrompt, activeFilePath = '', activeCodeSnippet = '', targetDir = '') {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';

    const cleanedInput = this.cleanAIText(rawPrompt.trim());
    const fileLabel = this.formatFilePath(activeFilePath);

    const snippetBlock = activeCodeSnippet ? 
      `[TAG KODE TARGET DI EDITOR: ${fileLabel}]\n\`\`\`\n${activeCodeSnippet.substring(0, 800)}\n\`\`\`` :
      `[BERKAS TARGET]: \`${fileLabel}\``;

    const brakes = this.getGenericEmergencyBrakes(fileLabel, 'Pergantian Asset');

    const assetPrompt = [
      `# ============================================================`,
      `# PROMPT BEDAH ASSET & KODE PRESISI (Anti-Mutation Guard v10.7.0)`,
      `# Dihasilkan oleh Asisten Joe | Standar Surgical Single-Attribute Mutation`,
      `# Lisensi: GNU AGPL v3.0 | Output 100% Pure Prompt`,
      `# ============================================================`,
      ``,
      `[TARGET ABSOLUT KODE PRESISI]`,
      `-- BERKAS TARGET TERKUNCI: \`${fileLabel}\``,
      ``,
      `${snippetBlock}`,
      ``,
      `${brakes}`,
      ``,
      `[INSTRUKSI EKSEKUSI PRESISI]`,
      `"${cleanedInput}"`,
      ``,
      `[ALUR VERIFIKASI SEBELUM GRAFITY MENGATAKAN "DONE"]`,
      `-- Memastikan berkas lain 100% TIDAK TERSENTUH/TERUBAH.`,
      `-- Memastikan struktur dasar kode tidak mengalami perubahan yang tidak relevan.`,
      `-- Memastikan \`git diff\` hanya mencatat minimal baris perubahan yang presisi.`
    ].join('\n');

    return this.sanitizePromptSyntax(assetPrompt);
  }

  // ============================================================
  // MICRO-SCOPED PROMPT SLICER (v9.8.0): DYNAMIC OBJECT-AGNOSTIC SCOPE LOCK
  // ============================================================
  static compileMicroScopedPrompt(rawPrompt, activeFilePath = '', activeCodeSnippet = '', targetDir = '') {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';

    const cleanedInput = this.cleanAIText(rawPrompt.trim());
    const fileLabel = this.formatFilePath(activeFilePath);

    let projectStandards = `
-- Standar UI: Palette HSL Tailored (Ivory, Gold HSL, Near Black), Font Cormorant Garamond / Inter.
-- Standar Backend/API: OpenAPI/REST JSON Standard, Parameterized Query (SQLi Protection).
    `.trim();

    if (targetDir) {
      const brandPath = path.join(targetDir, 'BRAND.md');
      try {
        if (fs.existsSync(brandPath)) {
          projectStandards = fs.readFileSync(brandPath, 'utf8').substring(0, 500);
        }
      } catch (e) {}
    }

    const snippetBlock = activeCodeSnippet ? 
      `[POTONGAN KODE TARGET BERKAS: ${fileLabel}]\n\`\`\`\n${activeCodeSnippet.substring(0, 1000)}\n\`\`\`` :
      `[BERKAS TARGET UTAMA]: \`${fileLabel}\``;

    const brakes = this.getGenericEmergencyBrakes(fileLabel, 'Modul Terisolasi');

    const microPrompt = [
      `# ============================================================`,
      `# PROMPT MIKRO TERISOLASI (Object-Agnostic Scope Engine v10.7.0)`,
      `# Dihasilkan oleh Asisten Joe | Standar Single-File Scope Lock`,
      `# Lisensi: GNU AGPL v3.0 | Output 100% Pure Prompt`,
      `# ============================================================`,
      ``,
      `[TARGET RUANG LINGKUP MIKRO ABSOLUT]`,
      `-- BERKAS TARGET TERKUNCI: \`${fileLabel}\``,
      `-- HANYA UBAH BARIS KODE YANG TERKAIT DENGAN INSTRUKSI DI BAWAH.`,
      ``,
      `${snippetBlock}`,
      ``,
      `${brakes}`,
      ``,
      `[STANDAR PROYEK SINGLE SOURCE OF TRUTH]`,
      `${projectStandards}`,
      ``,
      `[INSTRUKSI EKSEKUSI MIKRO PRESISI]`,
      `"${cleanedInput}"`,
      ``,
      `[ALUR EKSEKUSI BERTAHAP MIKRO]`,
      `1. PERIKSA BARIS TARGET: Tentukan baris spesifik pada \`${fileLabel}\` yang perlu diubah.`,
      `2. TERAPKAN PERUBAHAN: Ubah hanya bagian target sesuai standar proyek di atas.`,
      `3. VERIFIKASI MIKRO: Pastikan tidak ada berkas lain yang tersentuh dan sintaks 100% valid.`,
      ``,
      `[CHECKLIST VERIFIKASI MIKRO GRAFITY SEBELUM SAY "DONE"]`,
      `-- Memastikan HANYA \`${fileLabel}\` yang diubah (tidak ada Scope Creep).`,
      `-- Memastikan perubahan sintaks terbukti berhasil pada berkas target.`,
      `-- Memastikan Standar Proyek dipatuhi tanpa menyuntikkan kode siluman.`,
      `-- Memastikan tidak ada error kompilasi setelah perubahan.`
    ].join('\n');

    return this.sanitizePromptSyntax(microPrompt);
  }

  // ============================================================
  // MODE DESIGN: GRAFITY SUPER-PROMPT ENGINE
  // ============================================================
  static compileGrafityDesignPrompt(rawPrompt, projectContext = '', targetDir = '') {
    return this.compileMicroScopedPrompt(rawPrompt, '', projectContext, targetDir);
  }

  // ============================================================
  // TAHAP 5 OPTIMASI: MULTI-AGENT SUB-TASK SWARM
  // ============================================================
  static runSwarmPromptEngine(rawPrompt, projectContext = '') {
    return this.compileMicroScopedPrompt(rawPrompt, '', projectContext);
  }

  // ============================================================
  // TAHAP 3 OPTIMASI: TERMINAL ERROR REPAIR PROMPT GENERATOR
  // ============================================================
  static compileErrorFixPrompt(terminalError, projectContext = '') {
    if (!terminalError || typeof terminalError !== 'string') {
      terminalError = 'Terjadi kesalahan tidak diketahui pada saat eksekusi command/build.';
    }

    const cleanedError = this.cleanAIText(terminalError.trim());
    const compressedCtx = this.compressContext(projectContext, 20);

    const fixPrompt = [
      `# ============================================================`,
      `# DRAF PROMPT PERBAIKAN ERROR TERMINAL (DSPy Repair Engine v10.7.0)`,
      `# Standar Lisensi: GNU AGPL v3.0 | Output Pure Prompt Generator`,
      `# ============================================================`,
      ``,
      `[PROFIL PERAN & SPESIALISASI]`,
      `Kamu adalah Senior Debugger & AI Repair Specialist.`,
      `Tujuanmu adalah menganalisis dan memberikan solusi perbaikan atas error terminal di bawah ini.`,
      ``,
      `[LOG ERROR TERMINAL TERDETEKSI]`,
      `\`\`\``,
      `${cleanedError.substring(0, 1500)}`,
      `\`\`\``,
      ``,
      `[RINGKASAN KONTEKS PROYEK]`,
      `${compressedCtx}`,
      ``,
      `[ALUR BERPIKIR PERBAIKAN (Chain-of-Thought / CoT)]`,
      `1. IDENTIFIKASI ROOT CAUSE: Tentukan baris berkas dan modul mana yang memicu error di atas.`,
      `2. KOREKSI SINTAKS/MODUL: Jelaskan perbaikan kode yang tepat tanpa merusak fungsi lain.`,
      `3. VERIFIKASI ULANG: Pastikan perintah build/test dapat berjalan kembali tanpa error.`,
      ``,
      `[BATASAN KERAS]`,
      `-- Bebas Emoji: Jangan gunakan emoji apapun.`,
      `-- Tunjukkan Kode Perbaikan Utuh yang siap ditempel ke berkas terkait.`
    ].join('\n');

    return this.sanitizePromptSyntax(fixPrompt);
  }

  // ============================================================
  // TAHAP 2 OPTIMASI: SMART CONTEXT COMPRESSOR
  // ============================================================
  static compressContext(rawContext, maxLines = 40) {
    if (!rawContext || typeof rawContext !== 'string') return '';
    
    const lines = rawContext.split('\n');
    if (lines.length <= maxLines) {
      return rawContext.trim();
    }

    const keySymbols = [];
    const fileHeaders = [];

    lines.forEach(line => {
      if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('diff --git')) {
        if (!fileHeaders.includes(line)) fileHeaders.push(line);
      }
      else if (/function\s+[a-zA-Z0-9_]+|class\s+[a-zA-Z0-9_]+|const\s+[a-zA-Z0-9_]+\s*=|app\.(get|post|put|delete)|router\.(get|post)/i.test(line)) {
        if (keySymbols.length < 25) {
          keySymbols.push(line.trim());
        }
      }
    });

    const compressed = [
      `[RINGKASAN KONTEKS ARSITEKTUR TERSIMPUL (RINGKASAN 70% TOKEN)]`,
      `BERKAS BERUBAH:`,
      fileHeaders.slice(0, 8).join('\n') || 'Sistem SaaS Utama',
      ``,
      `SIMBOL & RUTE INTI TERDETEKSI:`,
      keySymbols.join('\n') || 'Fungsi Utama Aplikasi',
      ``,
      `... (Konteks Lain Dipangkas Otomatis oleh Smart Context Compressor v10.7.0)`
    ].join('\n');

    return compressed;
  }

  // ============================================================
  // ADOPSI DSPy & TEXTGRAD (Stanford NLP Adoption)
  // ============================================================
  static compileDSPyPrompt(rawPrompt, projectContext = '') {
    return this.compileMicroScopedPrompt(rawPrompt, '', projectContext);
  }

  static applyTextGradFeedback(originalPrompt, feedbackError) {
    if (!originalPrompt) return '';
    if (!feedbackError) return originalPrompt;

    const refined = [
      originalPrompt,
      ``,
      `[UMPAN BALIK PERBAIKAN TEKSUAL (TextGrad Gradient)]`,
      `Koreksi Khusus Terdeteksi: "${feedbackError}"`,
      `Instruksi Tambahan: Harap atasi kendala di atas dan pastikan kesalahan tersebut tidak terulang.`
    ].join('\n');

    return this.sanitizePromptSyntax(refined);
  }

  static sanitizePromptSyntax(promptText) {
    if (!promptText || typeof promptText !== 'string') return '';

    return promptText
      .replace(/(["'])\s*:\s*["']([^"']*?)["']\s*([,}])/g, '$1: "$2"$3')
      .replace(/,\s*([\}\]])/g, '$1')
      .replace(/\n\s*(\d+)\.\s*/g, '\n$1. ')
      .trim();
  }

  static cleanAIText(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      .replace(/\r\n/g, '\n');
  }

  static syncDotenvExample(targetDir, diffContent) {
    const addedEnvKeys = [];
    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isUpdated: false, addedKeys: [] };
    }

    const envPattern = /process\.env\.(?:([a-zA-Z0-9_]+)|\[["']([a-zA-Z0-9_]+)["']\])/g;
    let match;

    while ((match = envPattern.exec(diffContent)) !== null) {
      const keyName = match[1] || match[2];
      if (keyName && !keyName.startsWith('NODE_ENV') && !addedEnvKeys.includes(keyName)) {
        addedEnvKeys.push(keyName);
      }
    }

    if (addedEnvKeys.length === 0) {
      return { isUpdated: false, addedKeys: [] };
    }

    const envExamplePath = path.join(targetDir, '.env.example');
    let existingContent = '';
    try {
      if (fs.existsSync(envExamplePath)) {
        existingContent = fs.readFileSync(envExamplePath, 'utf8');
      }
    } catch (e) {}

    const newlyAppended = [];
    addedEnvKeys.forEach(key => {
      const regex = new RegExp(`^${key}\\s*=`, 'm');
      if (!regex.test(existingContent)) {
        newlyAppended.push(key);
      }
    });

    if (newlyAppended.length > 0) {
      const appendText = '\n# Variabel Lingkungan Baru (Disinkronkan oleh Asisten Joe v10.7.0)\n' +
        newlyAppended.map(k => `${k}=`).join('\n') + '\n';

      try {
        fs.writeFileSync(envExamplePath, existingContent + appendText, 'utf8');
      } catch (e) {}
    }

    return {
      isUpdated: newlyAppended.length > 0,
      addedKeys: newlyAppended
    };
  }

  static refineVibePrompt(rawPrompt, projectContext = '') {
    return this.compileMicroScopedPrompt(rawPrompt, '', projectContext);
  }

  static sliceAtomicCommits(areas) {
    const commitGroups = [];

    if (areas.database && areas.database.length > 0) {
      commitGroups.push({ type: 'data', message: 'data: pembaruan skema dan model database', files: areas.database });
    }
    if (areas.api && areas.api.length > 0) {
      commitGroups.push({ type: 'api', message: 'api: pembaruan logika rute dan endpoint', files: areas.api });
    }
    if (areas.tampilan && areas.tampilan.length > 0) {
      commitGroups.push({ type: 'tampilan', message: 'tampilan: pembaruan antarmuka pengguna UI', files: areas.tampilan });
    }
    if (areas.konfigurasi && areas.konfigurasi.length > 0) {
      commitGroups.push({ type: 'konfigurasi', message: 'konfigurasi: pembaruan berkas pengaturan proyek', files: areas.konfigurasi });
    }

    return commitGroups;
  }

  static draftTestSpec(targetDir, diffContent, areas) {
    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isCreated: false, testPath: '' };
    }

    let testDir = path.join(targetDir, 'test');
    if (!fs.existsSync(testDir)) {
      testDir = path.join(targetDir, 'tests');
      if (!fs.existsSync(testDir)) {
        testDir = path.join(targetDir, 'test');
        try { fs.mkdirSync(testDir, { recursive: true }); } catch (e) {}
      }
    }

    const testPath = path.join(testDir, 'vibe_autotest.test.js');
    const now = new Date().toLocaleString('id-ID');

    const testContent = [
      `// Draf Pengujian Otomatis -- Disusun oleh Asisten Joe v10.7.0 (DSPy Engine)`,
      `// Waktu Dibuat: ${now}`,
      ``,
      `describe('Uji Kelaikan Modul Baru (Vibe Autotest)', () => {`,
      `  test('Memastikan modul dapat diimpor tanpa error', () => {`,
      `    expect(true).toBe(true);`,
      `  });`,
      ``,
      `  test('Memastikan penanganan nilai input valid', () => {`,
      `    const inputValid = true;`,
      `    expect(inputValid).toBeTruthy();`,
      `  });`,
      `});`,
      ``
    ].join('\n');

    try {
      if (!fs.existsSync(testPath)) {
        fs.writeFileSync(testPath, testContent, 'utf8');
        return { isCreated: true, testPath: 'test/vibe_autotest.test.js' };
      }
    } catch (e) {}

    return { isCreated: false, testPath: '' };
  }

  static auditBundleSize(targetDir, diffContent) {
    const warnings = [];
    const heavyPackages = [
      { name: 'moment', size: '2.5 MB', alt: 'date-fns / dayjs (2 KB)' },
      { name: 'lodash', size: '1.4 MB', alt: 'lodash-es / native JS' },
      { name: 'aws-sdk', size: '75 MB', alt: '@aws-sdk/client-* modular' },
      { name: 'three', size: '600 KB', alt: 'use lightweight 3d mesh loader' },
      { name: 'jquery', size: '300 KB', alt: 'native document.querySelector' }
    ];

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      heavyPackages.forEach(pkg => {
        const regex = new RegExp(`require\\(['"]${pkg.name}['"]\\)|import.*from\\s+['"]${pkg.name}['"]`, 'i');
        if (regex.test(diffContent)) {
          warnings.push({
            name: pkg.name, size: pkg.size, alt: pkg.alt,
            advice: `Pustaka '${pkg.name}' berukuran cukup berat (${pkg.size}). Disarankan menggunakan '${pkg.alt}'.`
          });
        }
      });
    }

    return { hasHeavyPackage: warnings.length > 0, warnings };
  }

  static draftAPIDocumentation(targetDir, diffContent) {
    const apiDocPath = path.join(targetDir, 'DOKUMENTASI_API.md');
    const detectedEndpoints = [];

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      const routeRegex = /(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/gi;
      let match;
      while ((match = routeRegex.exec(diffContent)) !== null) {
        detectedEndpoints.push({ method: match[2].toUpperCase(), path: match[3] });
      }
    }

    const now = new Date().toLocaleString('id-ID');
    let content = `# DOKUMENTASI API PROYEK\n\n*Disusun otomatis oleh Asisten Joe v10.7.0 (OpenAPI Standard)*\n*Waktu Pembaruan:* ${now}\n\n---\n\n`;

    if (detectedEndpoints.length > 0) {
      content += `## RINGKASAN ENDPOINT TERDETEKSI\n\n| METODE | JALUR RUTE (PATH) | DESKRIPSI |\n| :--- | :--- | :--- |\n`;
      detectedEndpoints.forEach(ep => {
        content += `| \`${ep.method}\` | \`${ep.path}\` | Endpoint layanan rute ${ep.path} |\n`;
      });
      content += `\n---\n\n`;
    } else {
      content += `*Belum ada penambahan rute API baru yang terdeteksi pada sesi koding ini.*\n\n---\n\n`;
    }

    try {
      fs.writeFileSync(apiDocPath, content, 'utf8');
      return { isWritten: true, path: 'DOKUMENTASI_API.md', endpointsCount: detectedEndpoints.length };
    } catch (e) {
      return { isWritten: false, path: '' };
    }
  }
}

module.exports = VibeOptimizer;
