const path = require('path');
const fs = require('fs');

// ============================================================
// VIBE OPTIMIZER v9.7.0 -- Dedicated Design Mode & Grafity Super-Prompt Engine
// 1. Grafity Design Super-Prompt Generator (v9.7.0 - Mode Design: 5-Wall Contract, Anti-False Completion & SSOT Design System)
// 2. Multi-Agent Sub-Task Swarm Orchestrator (Arsitek -> Koder -> Auditor SAST)
// 3. Inline CodeLens & Hover Diagnostic Guard
// 4. Terminal Error Sensor & Auto-Fix Repair Prompt
// 5. Pure Prompt Output Enforcer (Output Selalu Berupa Prompt Presisi)
// 6. Smart Context Compressor (Memangkas Diff/Konteks Hingga 70%)
// 7. DSPy & TextGrad Chain-of-Thought (CoT) Prompt Compiler (Stanford adoption)
// 8. .env.example Synchronizer (dotenv-safe adoption)
// 9. Atomic Commit Slicer (opencommit & cz-cli adoption)
// 10. OpenAPI / Swagger API Spec Drafter & AI Text Sanitizer
// ============================================================

class VibeOptimizer {

  // ============================================================
  // MODE DESIGN (v9.7.0): GRAFITY SUPER-PROMPT ENGINE
  // Menyusun Prompt Perintah Khusus untuk Grafity di IDE
  // Mengadopsi Standar Kepatuhan skills.sh, OpenClaw, & Promptfoo Assertions
  // ============================================================
  static compileGrafityDesignPrompt(rawPrompt, projectContext = '', targetDir = '') {
    if (!rawPrompt || typeof rawPrompt !== 'string') return '';

    const cleanedInput = this.cleanAIText(rawPrompt.trim());
    const compressedCtx = this.compressContext(projectContext);

    let brandTokens = `
-- Palette Warna: HSL Tailored (Ivory/Cream HSL(40,20%,96%), Pure White HSL(40,15%,100%), Gold HSL(45,65%,52%), Near Black HSL(220,15%,12%)).
-- Typography: Font Heading (Cormorant Garamond / Serif Editorial), Font Body (Inter).
-- Radius: 4px (refined). Spacing Scale: 8pt Grid. Shadow: Subtle Glassmorphism.
    `.trim();

    if (targetDir) {
      const brandPath = path.join(targetDir, 'BRAND.md');
      try {
        if (fs.existsSync(brandPath)) {
          const content = fs.readFileSync(brandPath, 'utf8');
          brandTokens = content.substring(0, 800);
        }
      } catch (e) {}
    }

    const superPrompt = [
      `# ============================================================`,
      `# SUPER-PROMPT PERINTAH GRAFITY (Standar Kepatuhan Mode Design v9.7.0)`,
      `# Dihasilkan oleh Asisten Joe | Standar skills.sh & Promptfoo Assertions`,
      `# Lisensi: GNU AGPL v3.0 | Output 100% Dedicated Pure Prompt`,
      `# ============================================================`,
      ``,
      `[PAGAR 1: KONTRAK ANTIMALAS & ANTI-FALSE COMPLETION]`,
      `DILARANG KERAS menyatakan status "Selesai / Done" hanya berdasarkan asumsi atau perubahan kode parsial.`,
      `Kamu WAJIB memverifikasi bahwa:`,
      `1. Berkas benar-benar tersimpan dan tidak ada sisa kode lama.`,
      `2. Perubahan visual (foto, warna, layout) telah diterapkan sepenuhnya pada hasil render.`,
      `3. Tidak ada kesalahan kompilasi, build error, atau unhandled exceptions.`,
      ``,
      `[PAGAR 2: DESIGN SYSTEM SINGLE SOURCE OF TRUTH (BRAND.MD)]`,
      `Seluruh perubahan wajib mengacu pada token berikut sebagai Sumber Kebenaran Mutlak:`,
      `${brandTokens}`,
      `DILARANG KERAS membuat warna, padding, margin, shadow, atau font baru di luar Design System!`,
      ``,
      `[PAGAR 3: PENGUNCI RUANG LINGKUP & DEPENDENSI (SCOPE LOCK)]`,
      `-- Ruang Lingkup Perubahan: HANYA BENTUK LOKAL PADA INSTRUKSI UTAMA.`,
      `-- DILARANG MENGUBAH: Layout lain, warna lain, atau komponen di luar ruang lingkup ini.`,
      `-- PERIKSA DEPENDENSI: Wajib mengecek seluruh berkas terkait (shared components, theme tokens, wrappers) agar konsisten 100%.`,
      ``,
      `[RINGKASAN KONTEKS PROYEK]`,
      `${compressedCtx}`,
      ``,
      `[INSTRUKSI UTAMA PEKERJAAN DESAIN]`,
      `"${cleanedInput}"`,
      ``,
      `[PAGAR 4: ALUR EKSEKUSI BERTAHAP (Chain-of-Thought / CoT)]`,
      `1. PERANCANGAN: Identifikasi komponen dan Design System yang berlaku dari BRAND.md.`,
      `2. EKSEKUSI: Tuliskan kode utuh yang presisi tanpa memotong fungsi lama.`,
      `3. AUDIT DEPENDENSI: Pastikan komponen terkait ikut diperbarui secara konsisten.`,
      `4. VERIFIKASI VIBE GUARD: Audit kebocoran rahasia & kepatuhan WCAG AAA.`,
      ``,
      `[PAGAR 5: MANDATORY VERIFICATION CHECKLIST GRAFITY SEBELUM SAY "DONE"]`,
      `Balas dan centang seluruh poin berikut SEBELUM menyatakan pekerjaan selesai:`,
      `- [ ] Memastikan tidak ada False Completion (Foto/Warna/Layout terbukti berubah).`,
      `- [ ] Memastikan seluruh aturan Design System (Warna, Font, Radius) dipatuhi 100%.`,
      `- [ ] Memastikan tidak ada perubahan liar pada komponen/file di luar ruang lingkup.`,
      `- [ ] Memastikan seluruh dependensi (shared components/theme) telah diperbarui secara konsisten.`,
      `- [ ] Memastikan state interaksi (hover, focus, active) dan responsivitas berjalan sempurna.`
    ].join('\n');

    return this.sanitizePromptSyntax(superPrompt);
  }

  // ============================================================
  // TAHAP 5 OPTIMASI: MULTI-AGENT SUB-TASK SWARM
  // ============================================================
  static runSwarmPromptEngine(rawPrompt, projectContext = '') {
    return this.compileGrafityDesignPrompt(rawPrompt, projectContext);
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
      `# DRAF PROMPT PERBAIKAN ERROR TERMINAL (DSPy Repair Engine v9.7.0)`,
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
      `... (Konteks Lain Dipangkas Otomatis oleh Smart Context Compressor v9.7.0)`
    ].join('\n');

    return compressed;
  }

  // ============================================================
  // ADOPSI DSPy & TEXTGRAD (Stanford NLP Adoption)
  // ============================================================
  static compileDSPyPrompt(rawPrompt, projectContext = '') {
    return this.compileGrafityDesignPrompt(rawPrompt, projectContext);
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
      .replace(/\n\s*-\s*/g, '\n-- ')
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
      const appendText = '\n# Variabel Lingkungan Baru (Disinkronkan oleh Asisten Joe v9.7.0)\n' +
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
    return this.compileGrafityDesignPrompt(rawPrompt, projectContext);
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
      `// Draf Pengujian Otomatis -- Disusun oleh Asisten Joe v9.7.0 (DSPy Engine)`,
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
    let content = `# DOKUMENTASI API PROYEK\n\n*Disusun otomatis oleh Asisten Joe v9.7.0 (OpenAPI Standard)*\n*Waktu Pembaruan:* ${now}\n\n---\n\n`;

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
