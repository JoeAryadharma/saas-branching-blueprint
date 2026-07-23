const path = require('path');
const fs = require('fs');

// ============================================================
// VIBE GUARD -- Modul Pengawal & Auditor Kualitas Vibe Coding
// Menangani 4 masalah utama hasil Vibe Coding (prompt AI):
// 1. Secret & Credential Scanner (Pencegah kebocoran kunci API)
// 2. Regression Risk Guard (Pencegah kerusakan fitur lama)
// 3. Duplicate Logic & Orphan File Detector (Pencegah kode berantakan)
// 4. Auto Architecture Mapper (Pemeta alur data Mermaid)
// ============================================================

class VibeGuard {

  // ============================================================
  // 1. SENSOR KEAMANAN RAHASIA (SECRET SCANNER)
  // Memeriksa apakah ada kunci rahasia/password tertulis di kode
  // ============================================================
  static scanHardcodedSecrets(diffContent) {
    const findings = [];

    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') {
      return { isSafe: true, findings };
    }

    // Ambil hanya baris yang ditambahkan (diawali '+')
    const addedLines = diffContent.split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.substring(1));

    // Pola-pola kunci rahasia yang umum
    const secretPatterns = [
      { name: 'Stripe Secret Key', pattern: /sk_(live|test)_[0-9a-zA-Z]{24,}/ },
      { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/ },
      { name: 'GitHub Personal Token', pattern: /gh[pousr]_[0-9a-zA-Z]{36}/ },
      { name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{32,}/ },
      { name: 'Private Key Pembuat', pattern: /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/ },
      { name: 'Koneksi Database (PostgreSQL/MySQL)', pattern: /(postgres|postgresql|mysql):\/\/[^:]+:[^@]+@/i },
      { name: 'Koneksi Database (MongoDB)', pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/i },
      { name: 'Kata Sandi Tertulis Langsung', pattern: /(password|passwd|secret_key|api_key|jwt_secret)\s*[:=]\s*["'][^"']{6,}["']/i },
    ];

    addedLines.forEach((line, index) => {
      secretPatterns.forEach(p => {
        if (p.pattern.test(line)) {
          // Sensor nilai rahasia agar tidak tampil penuh di log
          const linePreview = line.trim().substring(0, 60);
          findings.push({
            type: p.name,
            snippet: linePreview,
            lineNum: index + 1
          });
        }
      });
    });

    return {
      isSafe: findings.length === 0,
      findings
    };
  }

  // ============================================================
  // 2. PENJAGA KESTABILAN FITUR LAMA (REGRESSION GUARD)
  // Memeriksa jika perubahan menyentuh berkas inti bersama
  // ============================================================
  static detectRegressionRisk(targetDir, diffContent, areas) {
    const risks = [];
    const coreKeywords = ['auth', 'user', 'session', 'db', 'database', 'config', 'middleware', 'payment', 'kasir', 'inti'];

    // Periksa berkas yang diubah di area database atau api
    const highRiskFiles = [...(areas.database || []), ...(areas.api || []), ...(areas.konfigurasi || [])];

    highRiskFiles.forEach(file => {
      const lower = file.toLowerCase();
      const matchedKeyword = coreKeywords.find(kw => lower.includes(kw));

      if (matchedKeyword) {
        risks.push({
          file,
          area: matchedKeyword.toUpperCase(),
          impact: `Perubahan di berkas inti '${file}' berpotensi mempengaruhi fitur yang bergantung pada modul ${matchedKeyword.toUpperCase()}.`
        });
      }
    });

    return {
      hasRisk: risks.length > 0,
      riskCount: risks.length,
      risks
    };
  }

  // ============================================================
  // 3. DETEKTOR KODE DUPLIKAT & BERKAS SAMPAH
  // Memeriksa berkas draf sementara atau nama fungsi yang mirip
  // ============================================================
  static scanDuplicateLogic(targetDir, diffContent) {
    const warnings = [];

    // 1. Cari berkas draf sementara (orphan/temp files)
    try {
      const allFiles = fs.readdirSync(targetDir);
      const orphanPatterns = ['temp', 'draft', 'copy', 'old', 'test-old', 'backup', 'v2', 'v3', 'test1', 'test2'];

      allFiles.forEach(file => {
        const lower = file.toLowerCase();
        const isOrphan = orphanPatterns.some(p => lower.includes(p) && !lower.startsWith('.'));
        if (isOrphan && !file.startsWith('node_modules')) {
          warnings.push({
            type: 'BERKAS DRAF SEMENTARA',
            item: file,
            advice: `Berkas '${file}' terdeteksi sebagai berkas draf/cadangan sementara. Disarankan dihapus jika tidak digunakan.`
          });
        }
      });
    } catch (e) {}

    // 2. Cari indikasi fungsi duplikat dari diff
    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      const addedLines = diffContent.split('\n')
        .filter(l => l.startsWith('+') && !l.startsWith('+++'))
        .map(l => l.substring(1));

      const fnMatches = [];
      addedLines.forEach(line => {
        const fnMatch = line.match(/(function|const|let|var)\s+([a-zA-Z0-9_]+V2|[a-zA-Z0-9_]+New|[a-zA-Z0-9_]+Copy|[a-zA-Z0-9_]+Temp)/);
        if (fnMatch) {
          fnMatches.push(fnMatch[2]);
        }
      });

      fnMatches.forEach(fnName => {
        warnings.push({
          type: 'INDIKASI FUNGSI DUPLIKAT',
          item: fnName,
          advice: `Fungsi '${fnName}' terdeteksi memiliki penamaan akhiran draf (V2/New/Copy). Disarankan menyatukan logika dengan fungsi utama.`
        });
      });
    }

    return {
      hasDuplicates: warnings.length > 0,
      warnings
    };
  }

  // ============================================================
  // 4. PEMETA ALUR ARSITEKTUR OTOMATIS (MERMAID MAPPER)
  // Menghasilkan diagram alur Mermaid dari berkas yang diubah
  // ============================================================
  static generateArchitectureMap(diffContent, areas) {
    const changedComponents = [];

    if (areas.database && areas.database.length > 0) {
      changedComponents.push({ id: 'DB', label: 'Modul Data (Database)', files: areas.database });
    }
    if (areas.api && areas.api.length > 0) {
      changedComponents.push({ id: 'API', label: 'Modul Logika & API', files: areas.api });
    }
    if (areas.tampilan && areas.tampilan.length > 0) {
      changedComponents.push({ id: 'UI', label: 'Modul Tampilan (UI)', files: areas.tampilan });
    }
    if (areas.konfigurasi && areas.konfigurasi.length > 0) {
      changedComponents.push({ id: 'CONF', label: 'Modul Konfigurasi', files: areas.konfigurasi });
    }

    if (changedComponents.length === 0) {
      return '    A["Perubahan Kode Ringan"] --> B["Audit Kelaikan"]';
    }

    const mermaidLines = [];
    changedComponents.forEach((comp, idx) => {
      const fileList = comp.files.slice(0, 2).map(f => path.basename(f)).join(', ');
      mermaidLines.push(`    ${comp.id}["${comp.label}<br/><small>${fileList}</small>"]`);

      if (idx < changedComponents.length - 1) {
        const nextComp = changedComponents[idx + 1];
        mermaidLines.push(`    ${comp.id} --> ${nextComp.id}`);
      }
    });

    return mermaidLines.join('\n');
  }

  // ============================================================
  // AUDIT LENGKAP VIBE CODING (4 IN 1)
  // ============================================================
  static auditAll(targetDir, diffContent, areas) {
    const secretAudit = VibeGuard.scanHardcodedSecrets(diffContent);
    const regressionAudit = VibeGuard.detectRegressionRisk(targetDir, diffContent, areas);
    const duplicateAudit = VibeGuard.scanDuplicateLogic(targetDir, diffContent);
    const archDiagram = VibeGuard.generateArchitectureMap(diffContent, areas);

    const isFullyPassed = secretAudit.isSafe && !regressionAudit.hasRisk && !duplicateAudit.hasDuplicates;

    return {
      isFullyPassed,
      secretAudit,
      regressionAudit,
      duplicateAudit,
      archDiagram
    };
  }
}

module.exports = VibeGuard;
