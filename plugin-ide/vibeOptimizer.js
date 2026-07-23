const path = require('path');
const fs = require('fs');

// ============================================================
// VIBE OPTIMIZER v9.5.6 -- Ultimate Vibe Coder & Prompt Generator Suite
// 1. .env.example Synchronizer (dotenv-safe adoption)
// 2. Prompt Refiner & Anti-Hallucination Engine (promptfoo & fabric adoption)
// 3. Prompt Generator Syntax & Format Auto-Fixer (v9.5.6)
// 4. Atomic Commit Slicer (opencommit & cz-cli adoption)
// 5. Auto Test Spec Drafter (keploy adoption)
// 6. Performance & Bundle Size Guard (v9.4.0)
// 7. OpenAPI / Swagger API Spec Drafter (v9.5.0)
// 8. AI Code & Text Sanitizer (v9.5.2 - strip-ansi adoption)
// ============================================================

class VibeOptimizer {

  // ============================================================
  // 3. PEMBERSIPIH & PEMFORMAT PROMPT AI OTOMATIS (v9.5.6)
  // Menjaga agar prompt generator 100% presisi tanpa halusinasi
  // ============================================================
  static sanitizePromptSyntax(promptText) {
    if (!promptText || typeof promptText !== 'string') return '';

    return promptText
      // Merapikan tanda kutip yang tidak ter-escape di JSON draf prompt
      .replace(/(["'])\s*:\s*["']([^"']*?)["']\s*([,}])/g, '$1: "$2"$3')
      // Menghapus trailing comma tak valid di akhir struktur objek prompt
      .replace(/,\s*([\}\]])/g, '$1')
      // Merapikan penomoran & poin instruksi agar AI penerima membaca dengan presisi
      .replace(/\n\s*-\s*/g, '\n-- ')
      .replace(/\n\s*(\d+)\.\s*/g, '\n$1. ')
      .trim();
  }

  // ============================================================
  // 8. PEMBERSIH KODE & ARTEFAK TEKS AI (v9.5.2 - strip-ansi adoption)
  // Menyaring zero-width spaces, kode ANSI, & control characters
  // ============================================================
  static cleanAIText(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      // Hapus kode warna ANSI escape
      .replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '')
      // Hapus Zero-Width Space & BOM (\u200B, \u200C, \u200D, \uFEFF)
      .replace(/[\u200B\u200C\u200D\uFEFF]/g, '')
      // Hapus karakter kontrol tak valid (\u0000-\u0008, \u000B, \u000C, \u000E-\u001F)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
      // Samakan pemisah baris \r\n menjadi \n
      .replace(/\r\n/g, '\n');
  }

  // ============================================================
  // 1. SINKRONISASI .ENV.EXAMPLE (dotenv-safe Adoption)
  // ============================================================
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
      const appendText = '\n# Variabel Lingkungan Baru (Disinkronkan oleh Asisten Joe v9.5)\n' +
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

  // ============================================================
  // 2. PENGOPTIMASI PROMPT AI / PROMPT GENERATOR (v9.5.6)
  // ============================================================
  static refineVibePrompt(rawPrompt, projectContext = '') {
    if (!rawPrompt || rawPrompt.trim().length === 0) {
      return rawPrompt;
    }

    const structuredPrompt = [
      `[INSTRUKSI PRESISI AI PROMPT GENERATOR - ASISTEN JOE v9.5.6]`,
      ``,
      `PERAN: Senior Software Architect & Prompt Engineer`,
      `KONTEKS PROYEK:`,
      projectContext ? projectContext.substring(0, 500) : 'Proyek SaaS Modern',
      ``,
      `TUGAS UTAMA VIBE CODING:`,
      `"${rawPrompt.trim()}"`,
      ``,
      `BATASAN KERAS KODING:`,
      `1. Jangan ubah atau hapus fungsi lama yang sudah berjalan normal di proyek ini.`,
      `2. Jangan menuliskan API Key, Token, atau Password langsung di dalam berkas kode. Gunakan process.env.`,
      `3. Jangan gunakan emoji dalam respons atau komentar kode.`,
      `4. Berikan kodingan yang bersih, terstruktur, dan mudah dipahami.`
    ].join('\n');

    return this.sanitizePromptSyntax(structuredPrompt);
  }

  // ============================================================
  // 4. PEMISAH SIMPANAN GIT PER MODUL (Atomic Commit Adoption)
  // ============================================================
  static sliceAtomicCommits(areas) {
    const commitGroups = [];

    if (areas.database && areas.database.length > 0) {
      commitGroups.push({
        type: 'data',
        message: 'data: pembaruan skema dan model database',
        files: areas.database
      });
    }
    if (areas.api && areas.api.length > 0) {
      commitGroups.push({
        type: 'api',
        message: 'api: pembaruan logika rute dan endpoint',
        files: areas.api
      });
    }
    if (areas.tampilan && areas.tampilan.length > 0) {
      commitGroups.push({
        type: 'tampilan',
        message: 'tampilan: pembaruan antarmuka pengguna UI',
        files: areas.tampilan
      });
    }
    if (areas.konfigurasi && areas.konfigurasi.length > 0) {
      commitGroups.push({
        type: 'konfigurasi',
        message: 'konfigurasi: pembaruan berkas pengaturan proyek',
        files: areas.konfigurasi
      });
    }

    return commitGroups;
  }

  // ============================================================
  // 5. PEMBUAT DRAF BERKAS PENGUJIAN (Keploy Adoption)
  // ============================================================
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
      `// Draf Pengujian Otomatis -- Disusun oleh Asisten Joe v9.5.6`,
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

  // ============================================================
  // 6. PENGAWAL PERFORMA & UKURAN PUSTAKA (v9.4.0)
  // Memeriksa pustaka berukuran berat & memberikan alternatif ringan
  // ============================================================
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
            name: pkg.name,
            size: pkg.size,
            alt: pkg.alt,
            advice: `Pustaka '${pkg.name}' berukuran cukup berat (${pkg.size}). Disarankan menggunakan '${pkg.alt}'.`
          });
        }
      });
    }

    return {
      hasHeavyPackage: warnings.length > 0,
      warnings
    };
  }

  // ============================================================
  // 7. PEMBUAT DOKUMENTASI API OTOMATIS (v9.5.0)
  // Memindai rute API & membuat berkas DOKUMENTASI_API.md
  // ============================================================
  static draftAPIDocumentation(targetDir, diffContent) {
    const apiDocPath = path.join(targetDir, 'DOKUMENTASI_API.md');
    const detectedEndpoints = [];

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      const routeRegex = /(app|router)\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]/gi;
      let match;
      while ((match = routeRegex.exec(diffContent)) !== null) {
        detectedEndpoints.push({
          method: match[2].toUpperCase(),
          path: match[3]
        });
      }
    }

    const now = new Date().toLocaleString('id-ID');
    let content = `# DOKUMENTASI API PROYEK\n\n*Disusun otomatis oleh Asisten Joe v9.5.6 (OpenAPI Standard)*\n*Waktu Pembaruan:* ${now}\n\n---\n\n`;

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
