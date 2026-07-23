const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const SASTScanner = require('./sastScanner');
const VibeOptimizer = require('./vibeOptimizer');

// ============================================================
// VIBE GUARD v9.0 -- ULTIMATE VIBE CODER SUITE
// Integrasi VibeGuard + SASTScanner + VibeOptimizer
// ============================================================

class VibeGuard {

  static scanHardcodedSecrets(diffContent) {
    const findings = [];
    if (!diffContent || diffContent === '[Tidak ada perubahan terdeteksi]') return { isSafe: true, findings };

    const addedLines = diffContent.split('\n')
      .filter(line => line.startsWith('+') && !line.startsWith('+++'))
      .map(line => line.substring(1));

    const secretPatterns = [
      { name: 'Stripe Secret Key', pattern: /sk_(live|test)_[0-9a-zA-Z]{24,}/ },
      { name: 'AWS Access Key ID', pattern: /(AKIA|ASIA)[0-9A-Z]{16}/ },
      { name: 'AWS Secret Key', pattern: /(aws_secret_access_key|aws_secret_key)\s*[:=]\s*["'][0-9a-zA-Z\/+]{40}["']/i },
      { name: 'GitHub Personal Access Token', pattern: /gh[pousr]_[0-9a-zA-Z]{36}/ },
      { name: 'GitHub OAuth Token', pattern: /gho_[0-9a-zA-Z]{36}/ },
      { name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{32,}/ },
      { name: 'Anthropic Claude Key', pattern: /sk-ant-api03-[a-zA-Z0-9_-]{32,}/ },
      { name: 'Google Gemini / Cloud API Key', pattern: /AIzaSy[0-9a-zA-Z_-]{33}/ },
      { name: 'Supabase Service Role Key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/ },
      { name: 'Firebase Admin Private Key', pattern: /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/ },
      { name: 'Google Cloud Service Account JSON', pattern: /"type"\s*:\s*"service_account"/ },
      { name: 'Midtrans Payment Server Key', pattern: /SB-Mid-server-[0-9a-zA-Z_-]{24}/ },
      { name: 'Midtrans Production Server Key', pattern: /Mid-server-[0-9a-zA-Z_-]{24}/ },
      { name: 'Xendit Secret API Key', pattern: /xnd_(development|production)_[0-9a-zA-Z]{24,}/ },
      { name: 'Twilio Account SID / Auth Token', pattern: /AC[a-f0-9]{32}|[a-f0-9]{32}/ },
      { name: 'SendGrid API Key', pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/ },
      { name: 'Mailgun API Key', pattern: /key-[0-9a-zA-Z]{32}/ },
      { name: 'Slack Bot Token', pattern: /xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/ },
      { name: 'Private Key (RSA/EC/SSH)', pattern: /-----BEGIN (RSA|EC|OPENSSH|PRIVATE) KEY-----/ },
      { name: 'Koneksi PostgreSQL Database', pattern: /postgres(ql)?:\/\/[^:]+:[^@]+@/i },
      { name: 'Koneksi MySQL Database', pattern: /mysql:\/\/[^:]+:[^@]+@/i },
      { name: 'Koneksi MongoDB Database', pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/i },
      { name: 'Koneksi Redis Cache', pattern: /redis:\/\/:[^@]+@/i },
      { name: 'JWT Secret Key Tertulis Langsung', pattern: /(jwt_secret|jwt_key|token_secret)\s*[:=]\s*["'][^"']{8,}["']/i },
      { name: 'Kata Sandi Database Tertulis Langsung', pattern: /(db_password|db_pass|database_password)\s*[:=]\s*["'][^"']{6,}["']/i },
    ];

    addedLines.forEach((line, index) => {
      secretPatterns.forEach(p => {
        if (p.pattern.test(line)) {
          findings.push({ type: p.name, snippet: line.trim().substring(0, 55), lineNum: index + 1 });
        }
      });
    });

    return { isSafe: findings.length === 0, findings };
  }

  static traceFileEvolution(targetDir, filePath) {
    try {
      const relativePath = path.relative(targetDir, filePath);
      const output = execSync(`git log -n 5 --pretty=format:"%h|%an|%ad|%s" --date=short -- "${relativePath}"`, { cwd: targetDir }).toString().trim();
      if (!output) return { hasHistory: false, history: [] };

      const history = output.split('\n').map(line => {
        const [hash, author, date, message] = line.split('|');
        return { hash, author, date, message };
      });
      return { hasHistory: true, history };
    } catch (e) {
      return { hasHistory: false, history: [] };
    }
  }

  static runSanityCheck(targetDir) {
    const results = { isPassed: true, errors: [] };
    try {
      const packageJsonPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (pkg.scripts && pkg.scripts.build) {
          try {
            execSync('npm run build --if-present', { cwd: targetDir, stdio: 'pipe' });
          } catch (e) {
            results.isPassed = false;
            results.errors.push(`Gagal uji kompilasi build (npm run build): ${e.message.substring(0, 100)}`);
          }
        }
      }
    } catch (e) {}
    return results;
  }

  static detectRegressionRisk(targetDir, diffContent, areas) {
    const risks = [];
    const coreKeywords = ['auth', 'user', 'session', 'db', 'database', 'config', 'middleware', 'payment', 'kasir', 'inti'];
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

    return { hasRisk: risks.length > 0, riskCount: risks.length, risks };
  }

  static scanDuplicateLogic(targetDir, diffContent) {
    const warnings = [];
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

    if (diffContent && diffContent !== '[Tidak ada perubahan terdeteksi]') {
      const addedLines = diffContent.split('\n')
        .filter(l => l.startsWith('+') && !l.startsWith('+++'))
        .map(l => l.substring(1));

      const fnMatches = [];
      addedLines.forEach(line => {
        const fnMatch = line.match(/(function|const|let|var)\s+([a-zA-Z0-9_]+V2|[a-zA-Z0-9_]+New|[a-zA-Z0-9_]+Copy|[a-zA-Z0-9_]+Temp)/);
        if (fnMatch) fnMatches.push(fnMatch[2]);
      });

      fnMatches.forEach(fnName => {
        warnings.push({
          type: 'INDIKASI FUNGSI DUPLIKAT',
          item: fnName,
          advice: `Fungsi '${fnName}' terdeteksi memiliki penamaan akhiran draf (V2/New/Copy). Disarankan menyatukan logika dengan fungsi utama.`
        });
      });
    }

    return { hasDuplicates: warnings.length > 0, warnings };
  }

  static generateArchitectureMap(diffContent, areas) {
    const changedComponents = [];
    if (areas.database && areas.database.length > 0) changedComponents.push({ id: 'DB', label: 'Modul Data (Database)', files: areas.database });
    if (areas.api && areas.api.length > 0) changedComponents.push({ id: 'API', label: 'Modul Logika & API', files: areas.api });
    if (areas.tampilan && areas.tampilan.length > 0) changedComponents.push({ id: 'UI', label: 'Modul Tampilan (UI)', files: areas.tampilan });
    if (areas.konfigurasi && areas.konfigurasi.length > 0) changedComponents.push({ id: 'CONF', label: 'Modul Konfigurasi', files: areas.konfigurasi });

    if (changedComponents.length === 0) return '    A["Perubahan Kode Ringan"] --> B["Audit Kelaikan"]';

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

  static auditAll(targetDir, diffContent, areas) {
    const secretAudit = VibeGuard.scanHardcodedSecrets(diffContent);
    const regressionAudit = VibeGuard.detectRegressionRisk(targetDir, diffContent, areas);
    const duplicateAudit = VibeGuard.scanDuplicateLogic(targetDir, diffContent);
    const sanityCheck = VibeGuard.runSanityCheck(targetDir);

    const sastAudit = SASTScanner.scanVulnerabilities(diffContent);
    const totalLines = diffContent.split('\n').length;
    const flagAudit = SASTScanner.auditFeatureFlags(diffContent, totalLines);

    // Integrasi VibeOptimizer (dotenv-safe sync & test spec drafting)
    const envSync = VibeOptimizer.syncDotenvExample(targetDir, diffContent);
    const testDraft = VibeOptimizer.draftTestSpec(targetDir, diffContent, areas);

    const archDiagram = VibeGuard.generateArchitectureMap(diffContent, areas);

    const isFullyPassed = secretAudit.isSafe &&
      !regressionAudit.hasRisk &&
      !duplicateAudit.hasDuplicates &&
      sanityCheck.isPassed &&
      sastAudit.isClean;

    return {
      isFullyPassed,
      secretAudit,
      regressionAudit,
      duplicateAudit,
      sanityCheck,
      sastAudit,
      flagAudit,
      envSync,
      testDraft,
      archDiagram
    };
  }
}

module.exports = VibeGuard;
