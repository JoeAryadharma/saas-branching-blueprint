#!/usr/bin/env node

/**
 * SAAS WORKFLOW BLUEPRINT & GOVERNANCE CLI TOOL / IDE ENGINE
 * Alat Otomasi Penyuntikan Tata Kelola Proyek SaaS ke Folder Mana Saja
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SOURCE_BLUEPRINT = path.resolve(__dirname, '..');
const TARGET_DIR = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`\n🚀 [SaaS Workflow IDE Plugin/CLI]`);
console.log(`📌 Menyiapkan Cetakan Tata Kelola di Folder: ${TARGET_DIR}\n`);

// List berkas dan folder yang akan disuntikkan
const FILES_TO_COPY = [
  'BRAND.md',
  'README.md',
  'CONTRIBUTING.md',
  'CODEOWNERS',
  'SECURITY.md',
  'CHANGELOG.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug_report.md',
  '.github/ISSUE_TEMPLATE/feature_request.md',
  '.github/RELEASE_NOTES_TEMPLATE.md',
  '.github/HOTFIX_TEMPLATE.md',
  '.github/checklists/deployment_checklist.md',
  '.github/checklists/release_checklist.md',
  '.github/checklists/rollback_checklist.md',
  '.github/workflows/feature_check.yml',
  '.github/workflows/develop_integration.yml',
  '.github/workflows/close_packing_audit.yml',
  '.github/workflows/staging_simulation.yml',
  '.github/workflows/production_release.yml',
  '.github/workflows/hotfix_emergency.yml'
];

function copyFile(relPath) {
  const src = path.join(SOURCE_BLUEPRINT, relPath);
  const dest = path.join(TARGET_DIR, relPath);

  if (!fs.existsSync(src)) {
    console.log(`  ⚠️ Berkas sumber tidak ditemukan: ${relPath}`);
    return;
  }

  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log(`  ✅ Terpasang: ${relPath}`);
}

try {
  // 1. Menyuntikkan Seluruh Berkas SOP & Template
  console.log(`📁 1. Menyuntikkan Berkas SOP & Templates...`);
  FILES_TO_COPY.forEach(copyFile);

  // 2. Inisialisasi Git & Cabang Ruang Kerja
  console.log(`\n🌱 2. Menyiapkan Ruang Kerja Digital (Git Branches)...`);
  
  if (!fs.existsSync(path.join(TARGET_DIR, '.git'))) {
    execSync('git init', { cwd: TARGET_DIR, stdio: 'inherit' });
  }

  execSync('git add .', { cwd: TARGET_DIR, stdio: 'ignore' });
  try {
    execSync('git commit -m "inisialisasi: penyuntikan cetakan tata kelola saas [v1.0.0]"', { cwd: TARGET_DIR, stdio: 'ignore' });
  } catch (e) {
    // Commit mungkin sudah ada
  }

  execSync('git branch -M main', { cwd: TARGET_DIR, stdio: 'ignore' });

  ['develop', 'close-packing', 'staging'].forEach(b => {
    try {
      execSync(`git branch ${b}`, { cwd: TARGET_DIR, stdio: 'ignore' });
      console.log(`  ✅ Ruang Kerja Terbuat: ${b}`);
    } catch (e) {
      console.log(`  ℹ️ Ruang Kerja Sudah Ada: ${b}`);
    }
  });

  console.log(`\n🎉 SELESAI! Folder proyek Anda kini telah 100% dilengkapi dengan Tata Kelola SaaS Blueprint.`);
  console.log(`\n📌 Langkah Opsional (Untuk Push ke GitHub):`);
  console.log(`   git remote add origin https://github.com/USERNAME/NAMA-REPO.git`);
  console.log(`   git push -u origin --all\n`);

} catch (err) {
  console.error(`❌ Terjadi kendala saat menyuntikkan template:`, err.message);
}
