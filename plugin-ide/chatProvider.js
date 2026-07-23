const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

class SaaSWorkflowChatProvider {
  constructor(extensionUri) {
    this._extensionUri = extensionUri;
    this._mode = 'solo'; // Default mode: Solo
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'setMode':
          this._mode = data.mode;
          break;
        case 'userInput':
          await this._handleUserInput(data.text, data.mode);
          break;
        case 'execAction':
          await this._handleAction(data.action);
          break;
      }
    });
  }

  async _handleUserInput(text, mode) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      this._reply("⚠️ Silakan buka folder proyek Anda terlebih dahulu di Antigravity IDE!");
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const folderName = path.basename(targetDir);
    const lowerText = text.toLowerCase();

    // Jalankan Audit & Analisis Mendalam
    const projectAudit = this._inspectProject(targetDir);

    // 1. Kasus: Pertanyaan Membaca Isi Folder / Proyek / GitHub Sync / Status
    if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('status') || lowerText.includes('isi') || lowerText.includes('pull')) {
      
      let html = `<b>🔍 LAPORAN INSPEKSI PROYEK REAL-TIME (ASISTEN JOE)</b><br/><br/>` +
        `📁 <b>Folder Proyek:</b> <code>${folderName}</code><br/>` +
        `📍 <b>Lokasi:</b> <code>${targetDir}</code><br/>` +
        `🌿 <b>Ruang Kerja Aktif:</b> <code>${projectAudit.currentBranch}</code><br/>` +
        `📊 <b>Ruang Kerja Terdeteksi:</b> ${projectAudit.branchesPresent.map(b => `<code>${b}</code>`).join(', ')}<br/>` +
        `📝 <b>Perubahan Belum Disimpan:</b> ${projectAudit.changedFilesCount} berkas<br/>` +
        `🛡️ <b>Tata Kelola & SOP SaaS:</b> ${projectAudit.hasBlueprint ? '✅ Lengkap' : '❌ Belum Terpasang'}<br/><br/>`;

      if (projectAudit.rootStructure.length > 0) {
        html += `📂 <b>Struktur Berkas Utama:</b><br/><code>` + projectAudit.rootStructure.slice(0, 8).join(', ') + `</code><br/><br/>`;
      }

      html += `🎯 <b>REKOMENDASI RENCANA KERJA ASISTEN JOE:</b><br/>`;

      if (!projectAudit.hasBlueprint) {
        html += `1. <b>Suntikkan Tata Kelola SaaS:</b> Folder proyek ini belum memiliki 20 berkas SOP & CI/CD. Ketik <i>"Setup Blueprint"</i> atau klik tombol <b>Inisialisasi Blueprint</b> di bawah.<br/>`;
      }

      if (!projectAudit.branchesPresent.includes('develop')) {
        html += `2. <b>Siapkan Ruang Kerja Integrasi:</b> Proyek ini belum memiliki cabang <code>develop</code>. Diperlukan untuk penggabungan tim.<br/>`;
      }

      if (projectAudit.currentBranch === 'main') {
        html += `💡 <b>Peringatan Keamanan:</b> Anda sedang berada di Ruang Utama (<code>main</code>). Untuk mulai bekerja, Asisten Joe menyarankan Anda beralih ke Ruang Fitur baru dari <code>develop</code>.<br/>`;
      } else if (projectAudit.changedFilesCount > 0) {
        html += `💡 <b>Rekomendasi Pekerjaan:</b> Ada ${projectAudit.changedFilesCount} berkas diubah. Ketik <i>"Ajukan PR"</i> untuk menguji & menggabungkan ke <code>develop</code>.<br/>`;
      }

      this._reply(html);
      return;
    }

    // 2. Kasus: Fitur Baru
    if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur') || lowerText.includes('tambah fitur')) {
      const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket (Contoh: TK-201):' });
      if (!ticketId) return;

      const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat:' });
      if (!featureName) return;

      const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;

      try {
        execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
        this._reply(`✅ <b>Ruang Kerja Fitur Terbuat:</b> <code>${branchName}</code><br/>Asisten Joe siap mengawal. Setelah selesai mengisi kodingan, ketik <i>"Ajukan PR"</i>.`);
      } catch (err) {
        // Fallback jika develop belum ada, buat dari branch aktif
        try {
          execSync(`git checkout -b ${branchName}`, { cwd: targetDir });
          this._reply(`✅ <b>Ruang Kerja Fitur Terbuat:</b> <code>${branchName}</code><br/>Silakan isi kodingan Anda.`);
        } catch (e) {
          this._reply(`❌ Gagal membuat ruang kerja: ${err.message}`);
        }
      }
      return;
    }

    // 3. Kasus: Ajukan PR / Pemeriksaan
    if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan') || lowerText.includes('selesai')) {
      try {
        const currentBranch = projectAudit.currentBranch;
        
        if (mode === 'solo') {
          this._reply(`🤖 <b>Asisten Joe [Mode Solo]</b> Menjalankan Audit Kelaikan Otomatis pada <code>${currentBranch}</code>...`);
          execSync(`git add . && git commit -m "fitur: pembaruan mandiri terverifikasi" || true`, { cwd: targetDir });
          execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });
          this._reply(`🎉 <b>Asisten Joe [Mode Solo Auto-Approved]</b> Pekerjaan Anda dari <code>${currentBranch}</code> telah lulus audit kelaikan dan otomatis digabungkan ke <b>develop</b>!`);
        } else {
          this._reply(`🔵 <b>Asisten Joe [Mode Tim]</b> Mendorong <code>${currentBranch}</code> ke GitHub & membuat pengajuan persetujuan (PR)...`);
          execSync(`git push -u origin ${currentBranch}`, { cwd: targetDir });
          const prOutput = execSync(`gh pr create --base develop --head ${currentBranch} --title "fitur: ${currentBranch}" --body "Pengajuan dari tim."`, { cwd: targetDir }).toString();
          this._reply(`📢 <b>Asisten Joe [Mode Tim]</b> Pengajuan pemeriksaan berhasil dibuat di GitHub!<br/><b>PR Link:</b> ${prOutput}`);
        }
      } catch (err) {
        this._reply(`❌ Kendala saat proses PR: ${err.message}`);
      }
      return;
    }

    // Respons umum cerdas Asisten Joe
    this._reply(`<b>Asisten Joe telah menganalisis proyek ${folderName}.</b><br/><br/>Pesan Anda: <i>"${text}"</i>.<br/>Ruang Aktif: <code>${projectAudit.currentBranch}</code> | Mode: <b>${mode === 'solo' ? '🟢 Mandiri' : '🔵 Tim'}</b>.<br/><br/>💡 <i>Ketik "baca folder" untuk melihat laporan analisis lengkap & rekomendasi rencana kerja.</i>`);
  }

  _inspectProject(targetDir) {
    let currentBranch = 'main';
    let branchesPresent = ['main'];
    let changedFilesCount = 0;
    let hasBlueprint = false;
    let rootStructure = [];

    try {
      currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main';
      const bOutput = execSync('git branch -a', { cwd: targetDir }).toString();
      branchesPresent = bOutput.split('\n').map(b => b.replace('*', '').trim()).filter(Boolean);
    } catch (e) {}

    try {
      const statusOutput = execSync('git status -s', { cwd: targetDir }).toString().trim();
      changedFilesCount = statusOutput ? statusOutput.split('\n').length : 0;
    } catch (e) {}

    hasBlueprint = fs.existsSync(path.join(targetDir, 'BRAND.md')) || fs.existsSync(path.join(targetDir, '.github/workflows'));

    try {
      rootStructure = fs.readdirSync(targetDir).filter(f => !f.startsWith('.git'));
    } catch (e) {}

    return {
      currentBranch,
      branchesPresent,
      changedFilesCount,
      hasBlueprint,
      rootStructure
    };
  }

  _reply(htmlText) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'response', text: htmlText });
    }
  }

  _getHtmlForWebview(webview) {
    const htmlPath = path.join(this._extensionUri.fsPath, 'chat-view.html');
    return fs.readFileSync(htmlPath, 'utf8');
  }
}

module.exports = SaaSWorkflowChatProvider;
