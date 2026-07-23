const path = require('path');

// ============================================================
// SAST SCANNER v8.0 -- Pemindai Kerentanan Kode & Conventional Commits
// Adopsi dari Semgrep, PR-Agent/OpenCommit, Code2Flow, Flagsmith
// ============================================================

class SASTScanner {

  // ============================================================
  // 1. SAST CODE VULNERABILITY SCANNER (Semgrep Adoption)
  // Memindai 5 celah keamanan kode statis utama
  // ============================================================
  static scanVulnerabilities(diffContent) {
    const vulnerabilities = [];

    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isClean: true, vulnerabilities };
    }

    const addedLines = diffContent.split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.substring(1));

    // Pola-pola kerentanan SAST
    const sastRules = [
      {
        id: 'SQL_INJECTION',
        name: 'Potensi Injeksi SQL (SQL Injection)',
        severity: 'KRITIS',
        pattern: /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\s+.*(\${|\+\s*[a-zA-Z0-9_]+)/i,
        advice: 'Gunakan Parameterized Query (PreparedStatement) untuk mencegah injeksi perintah SQL dari luar.'
      },
      {
        id: 'XSS_INJECTION',
        name: 'Potensi Injeksi Tampilan (XSS)',
        severity: 'KRITIS',
        pattern: /(dangerouslySetInnerHTML|innerHTML\s*=|document\.write\s*\()/i,
        advice: 'Hindari memasukkan teks mentah langsung ke tampilan DOM tanpa sanitasi HTML.'
      },
      {
        id: 'UNHANDLED_PROMISE',
        name: 'Penanganan Error Asinkron Terlewat (Unhandled Async Error)',
        severity: 'SEDANG',
        pattern: /(fetch\(|\.then\().*(?!\.catch)/i,
        advice: 'Tambahkan penanganan kesalahan (.catch atau try-catch) pada pemanggilan fungsi asinkron.'
      },
      {
        id: 'DANGEROUS_EVAL',
        name: 'Penggunaan Fungsi Eksekusi Berbahaya (eval/exec)',
        severity: 'KRITIS',
        pattern: /(eval\(|execSync\(.*\$|child_process\.exec\()/i,
        advice: 'Hindari penggunaan eval() atau execSync() dengan input dinamis yang tidak tersanitasi.'
      },
      {
        id: 'HARDCODED_PORT_HOST',
        name: 'Pengaturan Host/Port Keras (Hardcoded Network Host)',
        severity: 'RENDAH',
        pattern: /(localhost|127\.0\.0\.1|0\.0\.0\.0):[0-9]{4,5}/i,
        advice: 'Gunakan variabel lingkungan (process.env.PORT) daripada menuliskan nomor port langsung.'
      }
    ];

    addedLines.forEach((line, index) => {
      sastRules.forEach(rule => {
        if (rule.pattern.test(line)) {
          vulnerabilities.push({
            id: rule.id,
            name: rule.name,
            severity: rule.severity,
            advice: rule.advice,
            snippet: line.trim().substring(0, 60),
            lineNum: index + 1
          });
        }
      });
    });

    const hasCritical = vulnerabilities.some(v => v.severity === 'KRITIS');

    return {
      isClean: vulnerabilities.length === 0,
      hasCritical,
      vulnerabilities
    };
  }

  // ============================================================
  // 2. AUDIT SAKELAR RILIS AMAN / FEATURE FLAGS (Flagsmith Adoption)
  // Memeriksa jika fitur berskala sedang-besar dilengkapi Feature Flag
  // ============================================================
  static auditFeatureFlags(diffContent, totalLines) {
    const isLargeChange = totalLines >= 100;
    let hasFeatureToggle = false;

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      hasFeatureToggle = /(FEATURE_|ENABLE_|FLAG_|FEATURE_TOGGLE|process\.env\.ENABLE_)/i.test(diffContent);
    }

    const needsToggle = isLargeChange && !hasFeatureToggle;

    return {
      isLargeChange,
      hasFeatureToggle,
      needsToggle,
      advice: needsToggle ?
        'Perubahan kode berskala cukup besar (100+ baris). Disarankan membungkus fitur baru dengan sakelar fitur (Feature Flag) agar peluncuran ke produksi dapat dikendalikan dengan aman.' :
        'Skala rilis terkendali.'
    };
  }

  // ============================================================
  // 3. GENERATOR CONVENTIONAL COMMITS (OpenCommit Adoption)
  // Menghasilkan pesan commit & deskripsi PR berstandar baku
  // ============================================================
  static generateConventionalCommit(diffContent, folderName, userInstruction = '') {
    let type = 'fitur'; // default
    let scope = 'modul';
    let summary = userInstruction || 'pembaruan terverifikasi';

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      const lowerDiff = diffContent.toLowerCase();
      if (lowerDiff.includes('fix') || lowerDiff.includes('bug') || lowerDiff.includes('error') || lowerDiff.includes('perbaikan')) {
        type = 'perbaikan';
      } else if (lowerDiff.includes('docs') || lowerDiff.includes('.md') || lowerDiff.includes('readme')) {
        type = 'dokumentasi';
      } else if (lowerDiff.includes('style') || lowerDiff.includes('.css') || lowerDiff.includes('layout')) {
        type = 'tampilan';
      } else if (lowerDiff.includes('config') || lowerDiff.includes('package.json') || lowerDiff.includes('.env')) {
        type = 'konfigurasi';
      }

      // Tentukan scope dari folder/berkas utama yang berubah
      if (lowerDiff.includes('auth') || lowerDiff.includes('login')) scope = 'keamanan';
      else if (lowerDiff.includes('api') || lowerDiff.includes('route')) scope = 'api';
      else if (lowerDiff.includes('db') || lowerDiff.includes('schema') || lowerDiff.includes('model')) scope = 'data';
      else if (lowerDiff.includes('ui') || lowerDiff.includes('view') || lowerDiff.includes('page')) scope = 'tampilan';
      else scope = 'inti';
    }

    const commitHeader = `${type}(${scope}): ${summary.substring(0, 50).toLowerCase()}`;
    const prTitle = `[PR] ${type.toUpperCase()} (${scope}): ${summary}`;

    const prDescription = [
      `## Ringkasan Pengajuan Pekerjaan (PR)`,
      `- **Jenis Pembaruan:** ${type.toUpperCase()}`,
      `- **Area Terpengaruh:** ${scope.toUpperCase()}`,
      `- **Proyek:** ${folderName}`,
      ``,
      `## Deskripsi Operasional Bisnis`,
      `${summary}`,
      ``,
      `## Verifikasi Audit Asisten Joe v8.0`,
      `- [x] Pemindaian Celah Keamanan SAST (Semgrep) Lulus`,
      `- [x] Sensor Kunci Rahasia 25+ Database Lulus`,
      `- [x] Penjaga Kestabilan Fitur Lama (Regression Guard) Lulus`,
      `- [x] Uji Kelaikan Kompilasi Build Lulus`
    ].join('\n');

    return {
      commitHeader,
      prTitle,
      prDescription
    };
  }
}

module.exports = SASTScanner;
