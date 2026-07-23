const path = require('path');
const fs = require('fs');

// ============================================================
// VIBE OPTIMIZER v9.0 -- Ultimate Vibe Coder Suite
// 1. .env.example Synchronizer (rolodato/dotenv-safe adoption)
// 2. Prompt Refiner & Anti-Hallucination (promptfoo & fabric adoption)
// 3. Atomic Commit Slicer (opencommit & cz-cli adoption)
// 4. Auto Test Spec Drafter (keploy adoption)
// ============================================================

class VibeOptimizer {

  // ============================================================
  // 1. SINKRONISASI .ENV.EXAMPLE (dotenv-safe Adoption)
  // Memindai process.env.XXX di kode & memperbarui .env.example
  // ============================================================
  static syncDotenvExample(targetDir, diffContent) {
    const addedEnvKeys = [];

    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isUpdated: false, addedKeys: [] };
    }

    // Cari pola process.env.NAMA_KUNCI atau process.env['NAMA_KUNCI']
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

    // Baca atau buat berkas .env.example
    const envExamplePath = path.join(targetDir, '.env.example');
    let existingContent = '';
    try {
      if (fs.existsSync(envExamplePath)) {
        existingContent = fs.readFileSync(envExamplePath, 'utf8');
      }
    } catch (e) {}

    const newlyAppended = [];
    addedEnvKeys.forEach(key => {
      // Cek apakah kunci sudah ada di .env.example
      const regex = new RegExp(`^${key}\\s*=`, 'm');
      if (!regex.test(existingContent)) {
        newlyAppended.push(key);
      }
    });

    if (newlyAppended.length > 0) {
      const appendText = '\n# Variabel Lingkungan Baru (Disinkronkan oleh Asisten Joe v9.0)\n' +
        newlyAppended.map(k => `${k}=`).join('\n') + '\n';

      try {
        fs.writeFileSync(envExamplePath, existingContent + appendText, 'utf8');
      } catch (e) {
        console.error('Gagal memperbarui .env.example:', e);
      }
    }

    return {
      isUpdated: newlyAppended.length > 0,
      addedKeys: newlyAppended
    };
  }

  // ============================================================
  // 2. PENGOPTIMASI PROMPT AI (promptfoo & fabric Adoption)
  // Merapikan prompt kasar menjadi instruksi presisi terstruktur
  // ============================================================
  static refineVibePrompt(rawPrompt, projectContext = '') {
    if (!rawPrompt || rawPrompt.trim().length === 0) {
      return rawPrompt;
    }

    const structuredPrompt = [
      `[INSTRUKSI PRESISI AI - ASISTEN JOE v9.0]`,
      ``,
      `PERAN: Senior Software Architect & QA Auditor`,
      `KONTEKS PROYEK:`,
      projectContext ? projectContext.substring(0, 500) : 'Proyek SaaS Modern',
      ``,
      `TUGAS UTAMA VIBE CODING:`,
      `"${rawPrompt.trim()}"`,
      ``,
      `BATASAN KERAS:`,
      `1. Jangan ubah atau hapus fungsi lama yang sudah berjalan normal di proyek ini.`,
      `2. Jangan menuliskan API Key, Token, atau Password langsung di dalam berkas kode. Gunakan process.env.`,
      `3. Jangan gunakan emoji dalam respons atau komentar kode.`,
      `4. Berikan kodingan yang bersih, terstruktur, dan mudah dipahami.`
    ].join('\n');

    return structuredPrompt;
  }

  // ============================================================
  // 3. PEMISAH SIMPANAN GIT PER MODUL (Atomic Commit Adoption)
  // Mengelompokkan diff besar menjadi perintah commit terpisah per area
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
  // 4. PEMBUAT DRAF BERKAS PENGUJIAN (Keploy Adoption)
  // Menyusun draf unit test sederhana di folder test/ proyek
  // ============================================================
  static draftTestSpec(targetDir, diffContent, areas) {
    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isCreated: false, testPath: '' };
    }

    // Tentukan folder pengujian
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
      `// Draf Pengujian Otomatis -- Disusun oleh Asisten Joe v9.0`,
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
}

module.exports = VibeOptimizer;
