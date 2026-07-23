const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// ============================================================
// CODE READER -- Modul Kesadaran Isi Kode
// Membaca dan menganalisis isi kode proyek untuk memberikan
// konteks yang bermakna kepada model AI.
// ============================================================

const MAX_CONTEXT_CHARS = 3000; // Batas karakter konteks agar tidak melampaui batas model

class CodeReader {

  // Membaca isi diff penuh (bukan hanya statistik)
  static getRecentDiff(targetDir) {
    try {
      // Coba diff terakhir commit
      let diff = execSync('git diff HEAD~1 HEAD 2>/dev/null', { cwd: targetDir, maxBuffer: 1024 * 512 }).toString();
      if (!diff.trim()) {
        // Jika tidak ada commit sebelumnya, baca diff staging/working
        diff = execSync('git diff', { cwd: targetDir, maxBuffer: 1024 * 512 }).toString();
      }
      if (!diff.trim()) {
        diff = execSync('git diff --cached', { cwd: targetDir, maxBuffer: 1024 * 512 }).toString();
      }
      // Potong jika terlalu panjang
      if (diff.length > MAX_CONTEXT_CHARS) {
        diff = diff.substring(0, MAX_CONTEXT_CHARS) + '\n\n[... dipotong karena terlalu panjang ...]';
      }
      return diff || '[Tidak ada perubahan terdeteksi]';
    } catch (e) {
      return '[Gagal membaca perubahan kode]';
    }
  }

  // Membaca statistik diff (jumlah berkas, baris tambah/hapus)
  static getDiffStats(targetDir) {
    const stats = { filesChanged: 0, insertions: 0, deletions: 0, totalLines: 0 };
    try {
      const raw = execSync('git diff --stat HEAD~1 HEAD 2>/dev/null || git diff --stat', { cwd: targetDir }).toString();
      const summaryLine = raw.split('\n').filter(l => l.includes('changed')).pop() || '';
      const fm = summaryLine.match(/(\d+)\s+file/);
      const im = summaryLine.match(/(\d+)\s+insertion/);
      const dm = summaryLine.match(/(\d+)\s+deletion/);
      stats.filesChanged = fm ? parseInt(fm[1]) : 0;
      stats.insertions = im ? parseInt(im[1]) : 0;
      stats.deletions = dm ? parseInt(dm[1]) : 0;
      stats.totalLines = stats.insertions + stats.deletions;
    } catch (e) {}
    return stats;
  }

  // Mengklasifikasikan area perubahan berdasarkan nama berkas
  static classifyChanges(targetDir) {
    const areas = {
      database: [],    // migrasi, model, schema
      api: [],         // routes, controllers, endpoints
      tampilan: [],    // views, pages, components, css, html
      konfigurasi: [], // config, env, package.json, yml
      dokumentasi: [], // md, txt, docs
      pengujian: [],   // test, spec
      lainnya: []
    };

    try {
      const output = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only', { cwd: targetDir }).toString();
      const files = output.trim().split('\n').filter(Boolean);

      files.forEach(f => {
        const lower = f.toLowerCase();
        if (lower.includes('migrat') || lower.includes('schema') || lower.includes('model') || lower.includes('prisma') || lower.includes('database') || lower.includes('.sql')) {
          areas.database.push(f);
        } else if (lower.includes('route') || lower.includes('controller') || lower.includes('api') || lower.includes('endpoint') || lower.includes('middleware')) {
          areas.api.push(f);
        } else if (lower.includes('view') || lower.includes('page') || lower.includes('component') || lower.includes('.css') || lower.includes('.html') || lower.includes('.tsx') || lower.includes('.jsx') || lower.includes('layout') || lower.includes('ui')) {
          areas.tampilan.push(f);
        } else if (lower.includes('config') || lower.includes('.env') || lower.includes('package.json') || lower.includes('.yml') || lower.includes('.yaml') || lower.includes('.toml')) {
          areas.konfigurasi.push(f);
        } else if (lower.includes('.md') || lower.includes('.txt') || lower.includes('doc') || lower.includes('readme') || lower.includes('changelog') || lower.includes('license')) {
          areas.dokumentasi.push(f);
        } else if (lower.includes('test') || lower.includes('spec') || lower.includes('__test')) {
          areas.pengujian.push(f);
        } else {
          areas.lainnya.push(f);
        }
      });
    } catch (e) {}

    return areas;
  }

  // Memetakan struktur folder proyek (kedalaman 2 level)
  static getProjectStructure(targetDir) {
    const structure = [];
    try {
      const items = fs.readdirSync(targetDir, { withFileTypes: true });
      items.forEach(item => {
        if (item.name.startsWith('.') && item.name !== '.github') return;
        if (item.name === 'node_modules') return;

        if (item.isDirectory()) {
          const subPath = path.join(targetDir, item.name);
          let subItems = [];
          try {
            subItems = fs.readdirSync(subPath).filter(s => !s.startsWith('.') && s !== 'node_modules').slice(0, 8);
          } catch (e) {}
          structure.push(`${item.name}/ (${subItems.length} item: ${subItems.join(', ')})`);
        } else {
          structure.push(item.name);
        }
      });
    } catch (e) {}
    return structure;
  }

  // Deteksi teknologi yang digunakan dalam proyek
  static detectTechnologies(targetDir) {
    const techs = [];
    try {
      if (fs.existsSync(path.join(targetDir, 'package.json'))) {
        const pkg = JSON.parse(fs.readFileSync(path.join(targetDir, 'package.json'), 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps['next']) techs.push('Next.js');
        if (deps['react']) techs.push('React');
        if (deps['vue']) techs.push('Vue');
        if (deps['angular'] || deps['@angular/core']) techs.push('Angular');
        if (deps['express']) techs.push('Express');
        if (deps['prisma'] || deps['@prisma/client']) techs.push('Prisma');
        if (deps['supabase'] || deps['@supabase/supabase-js']) techs.push('Supabase');
        if (deps['firebase'] || deps['firebase-admin']) techs.push('Firebase');
        if (deps['tailwindcss']) techs.push('Tailwind CSS');
        if (deps['typescript']) techs.push('TypeScript');
        if (!techs.length) techs.push('Node.js');
      }
      if (fs.existsSync(path.join(targetDir, 'requirements.txt')) || fs.existsSync(path.join(targetDir, 'pyproject.toml'))) {
        techs.push('Python');
      }
    } catch (e) {}
    return techs.length ? techs : ['Tidak terdeteksi'];
  }

  // Membaca isi berkas tertentu (dengan batas ukuran)
  static getFileContent(filePath, maxChars = 2000) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length > maxChars) {
        return content.substring(0, maxChars) + '\n[... dipotong ...]';
      }
      return content;
    } catch (e) {
      return '[Gagal membaca berkas]';
    }
  }

  // Membaca commit terakhir (untuk draf rilis)
  static getRecentCommits(targetDir, count = 10) {
    try {
      const output = execSync(`git log --oneline -${count}`, { cwd: targetDir }).toString().trim();
      return output.split('\n').filter(Boolean).map(c => {
        const spaceIdx = c.indexOf(' ');
        return { hash: c.substring(0, spaceIdx), message: c.substring(spaceIdx + 1) };
      });
    } catch (e) {
      return [];
    }
  }

  // Menyusun ringkasan konteks lengkap untuk dikirim ke AI
  static buildFullContext(targetDir) {
    const folderName = path.basename(targetDir);
    const structure = CodeReader.getProjectStructure(targetDir);
    const techs = CodeReader.detectTechnologies(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    const stats = CodeReader.getDiffStats(targetDir);

    let branchInfo = 'main';
    try {
      branchInfo = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main';
    } catch (e) {}

    const areasSummary = Object.entries(areas)
      .filter(([, files]) => files.length > 0)
      .map(([area, files]) => `  ${area}: ${files.length} berkas (${files.join(', ')})`)
      .join('\n');

    return [
      `Nama Proyek: ${folderName}`,
      `Ruang Kerja Aktif: ${branchInfo}`,
      `Teknologi: ${techs.join(', ')}`,
      `Struktur Folder: ${structure.slice(0, 10).join(', ')}`,
      `Perubahan Terkini: ${stats.filesChanged} berkas, +${stats.insertions}/-${stats.deletions} baris`,
      areasSummary ? `Area Perubahan:\n${areasSummary}` : '',
    ].filter(Boolean).join('\n');
  }
}

module.exports = CodeReader;
