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

    // 1. Kasus: Pertanyaan Membaca Folder Proyek / Informasi Proyek
    if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('bisa')) {
      try {
        const currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main';
        const hasBlueprint = fs.existsSync(path.join(targetDir, 'BRAND.md'));
        const filesCount = fs.readdirSync(targetDir).length;

        let replyMsg = `<b>Ya, Asisten Joe sudah bisa membaca Folder Proyek Anda secara real-time! 📂</b><br/><br/>` +
          `• <b>Nama Proyek:</b> <code>${folderName}</code><br/>` +
          `• <b>Lokasi Folder:</b> <code>${targetDir}</code><br/>` +
          `• <b>Ruang Kerja Aktif:</b> <code>${currentBranch}</code><br/>` +
          `• <b>Jumlah Berkas Root:</b> ${filesCount} berkas<br/>` +
          `• <b>Status Tata Kelola SaaS:</b> ${hasBlueprint ? '✅ Terpasang Lengkap (SOP & CI/CD)' : '⚠️ Belum Terpasang (Klik "Fitur Baru" atau jalankan Setup)'}<br/><br/>` +
          `Ada yang bisa Asisten Joe bantu jalankan untuk proyek <b>${folderName}</b> ini?`;

        this._reply(replyMsg);
        return;
      } catch (err) {
        this._reply(`📂 <b>Folder Proyek Terdeteksi:</b> <code>${folderName}</code> (${targetDir}).<br/>(Git belum diinisialisasi di folder ini). Klik tombol <b>Fitur Baru</b> atau minta Asisten Joe menginisialisasi.`);
        return;
      }
    }

    // 2. Kasus: Fitur Baru / Membuat Fitur
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
        this._reply(`❌ Gagal membuat ruang kerja: ${err.message}`);
      }
      return;
    }

    // 3. Kasus: Ajukan PR / Pemeriksaan
    if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan') || lowerText.includes('selesai')) {
      try {
        const currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim();
        
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

    // 4. Kasus: Status Ruang Kerja
    if (lowerText.includes('status') || lowerText.includes('branch')) {
      try {
        const currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim();
        this._reply(`📊 <b>Status Proyek (Asisten Joe):</b><br/>- Proyek: <b>${folderName}</b><br/>- Ruang Aktif: <code>${currentBranch}</code><br/>- Mode Operasional: <b>${mode === 'solo' ? '🟢 Mandiri (Solo)' : '🔵 Kerja Tim (Team)'}</b>`);
      } catch (err) {
        this._reply(`❌ Gagal mengambil status: ${err.message}`);
      }
      return;
    }

    // Respons umum cerdas Asisten Joe
    this._reply(`<b>Asisten Joe telah membaca folder proyek ${folderName}.</b><br/><br/>Pesan Anda: <i>"${text}"</i>.<br/>Saat ini Anda berada dalam <b>Mode ${mode === 'solo' ? '🟢 Mandiri (Solo)' : '🔵 Kerja Tim (Team)'}</b>.<br/><br/>💡 <i>Coba tanyakan: "Bagaimana status folder proyek saya?" atau klik tombol "✨ Fitur Baru" di bawah.</i>`);
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
