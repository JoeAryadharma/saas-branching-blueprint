const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ============================================================
// CODE READER v9.5.3 -- Performance & Git TTL Cache Edition
// Adopsi Pola simple-git (Cache git diff 500ms)
// ============================================================

class CodeReader {

  // Memory Cache untuk Git Diff (TTL 500ms)
  static _diffCache = {
    targetDir: '',
    timestamp: 0,
    content: ''
  };

  static getRecentDiff(targetDir) {
    const now = Date.now();
    
    // Gunakan cache jika pemanggilan terjadi dalam kurun waktu < 500ms pada direktori yang sama
    if (this._diffCache.targetDir === targetDir && (now - this._diffCache.timestamp) < 500) {
      return this._diffCache.content;
    }

    try {
      let diff = '';
      try {
        diff = execSync('git diff HEAD', { cwd: targetDir, encoding: 'utf8', timeout: 3000 });
      } catch (e) {
        diff = execSync('git diff', { cwd: targetDir, encoding: 'utf8', timeout: 3000 });
      }

      if (!diff || diff.trim().length === 0) {
        try {
          diff = execSync('git diff HEAD~1..HEAD', { cwd: targetDir, encoding: 'utf8', timeout: 3000 });
        } catch (e) {
          diff = '';
        }
      }

      const result = diff.trim() ? diff.trim() : '[Tidak ada perubahan terdeteksi]';
      
      // Simpan ke Cache
      this._diffCache = {
        targetDir: targetDir,
        timestamp: now,
        content: result
      };

      return result;
    } catch (err) {
      return '[Gagal membaca perubahan git]';
    }
  }

  static getDiffStats(targetDir) {
    try {
      const diff = this.getRecentDiff(targetDir);
      if (diff === '[Tidak ada perubahan terdeteksi]' || diff.startsWith('[Gagal')) {
        return { filesChanged: 0, additions: 0, deletions: 0, totalLines: 0 };
      }

      const lines = diff.split('\n');
      let filesChanged = 0;
      let additions = 0;
      let deletions = 0;

      lines.forEach(line => {
        if (line.startsWith('diff --git')) filesChanged++;
        else if (line.startsWith('+') && !line.startsWith('+++')) additions++;
        else if (line.startsWith('-') && !line.startsWith('---')) deletions++;
      });

      return { filesChanged, additions, deletions, totalLines: additions + deletions };
    } catch (e) {
      return { filesChanged: 0, additions: 0, deletions: 0, totalLines: 0 };
    }
  }

  static classifyChanges(targetDir) {
    const diff = this.getRecentDiff(targetDir);
    const result = { database: [], api: [], tampilan: [], konfigurasi: [], lainnya: [] };

    if (diff === '[Tidak ada perubahan terdeteksi]' || diff.startsWith('[Gagal')) {
      return result;
    }

    const fileMatches = diff.match(/diff --git a\/(.*?) b\//g);
    if (!fileMatches) return result;

    fileMatches.forEach(m => {
      const filePath = m.replace('diff --git a/', '').replace(/ b\/.*/, '').trim();
      const lower = filePath.toLowerCase();

      if (lower.includes('schema') || lower.includes('model') || lower.includes('db') || lower.includes('prisma') || lower.includes('migration')) {
        result.database.push(filePath);
      } else if (lower.includes('api') || lower.includes('route') || lower.includes('controller') || lower.includes('server')) {
        result.api.push(filePath);
      } else if (lower.includes('ui') || lower.includes('view') || lower.includes('component') || lower.includes('html') || lower.includes('css')) {
        result.tampilan.push(filePath);
      } else if (lower.includes('config') || lower.includes('json') || lower.includes('env') || lower.includes('.js')) {
        result.konfigurasi.push(filePath);
      } else {
        result.lainnya.push(filePath);
      }
    });

    return result;
  }

  static detectTechnologies(targetDir) {
    const techs = [];
    try {
      const files = fs.readdirSync(targetDir);
      if (files.includes('package.json')) techs.push('Node.js');
      if (files.includes('requirements.txt') || files.includes('Pipfile')) techs.push('Python');
      if (files.includes('go.mod')) techs.push('Go');
      if (files.includes('Cargo.toml')) techs.push('Rust');
      if (files.includes('docker-compose.yml') || files.includes('Dockerfile')) techs.push('Docker');
    } catch (e) {}

    return techs.length > 0 ? techs : ['Proyek SaaS Umum'];
  }

  static buildFullContext(targetDir) {
    const techs = this.detectTechnologies(targetDir);
    const stats = this.getDiffStats(targetDir);
    const diff = this.getRecentDiff(targetDir);
    const folderName = path.basename(targetDir);

    return `PROYEK: ${folderName}\nTEKNOLOGI: ${techs.join(', ')}\nBERKAS BERUBAH: ${stats.filesChanged} (${stats.additions} tambah, ${stats.deletions} hapus)\n\nPERUBAHAN KODE TERKINI:\n${diff.substring(0, 1500)}`;
  }

  static getRecentCommits(targetDir, count = 5) {
    try {
      const logs = execSync(`git log -n ${count} --pretty=format:"%h - %s (%cr)"`, { cwd: targetDir, encoding: 'utf8' });
      return logs.split('\n').map(line => {
        const parts = line.split(' - ');
        return { hash: parts[0], message: parts.slice(1).join(' - ') };
      });
    } catch (e) {
      return [{ hash: '0000000', message: 'Belum ada riwayat commit git' }];
    }
  }
}

module.exports = CodeReader;
