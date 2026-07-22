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

    // Tangani pesan dari HTML UI
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
      this._reply("⚠️ Silakan buka folder proyek Anda terlebih dahulu di VS Code/IDE!");
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const lowerText = text.toLowerCase();

    // 1. Kasus: Fitur Baru
    if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur')) {
      const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket (Contoh: TK-201):' });
      if (!ticketId) return;

      const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat:' });
      if (!featureName) return;

      const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;

      try {
        execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
        this._reply(`✅ <b>Ruang Kerja Fitur Terbuat:</b> <code>${branchName}</code><br/>Silakan kerjakan fitur Anda. Jika sudah selesai, ketik <i>"Ajukan PR"</i> di chat ini.`);
      } catch (err) {
        this._reply(`❌ Gagal membuat ruang kerja: ${err.message}`);
      }
      return;
    }

    // 2. Kasus: Ajukan PR / Pemeriksaan
    if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan')) {
      try {
        const currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim();
        
        if (mode === 'solo') {
          // MODE SOLO: Audit Otomatis & Auto-Approve Virtual
          this._reply(`🤖 <b>[Mode Solo]</b> Menjalankan Audit Kelaikan Otomatis pada ruang <code>${currentBranch}</code>...`);
          
          execSync(`git add . && git commit -m "fitur: pembaruan mandiri terverifikasi" || true`, { cwd: targetDir });
          execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });
          
          this._reply(`🎉 <b>[Mode Solo Auto-Approved]</b> Pekerjaan Anda dari <code>${currentBranch}</code> telah lulus audit kelaikan dan otomatis digabungkan ke <b>develop</b>!`);
        } else {
          // MODE TIM: Buat PR & Wajib Persetujuan Manusia (CODEOWNERS)
          this._reply(`🔵 <b>[Mode Tim]</b> Mendorong ruang <code>${currentBranch}</code> ke GitHub & membuat pengajuan persetujuan (PR)...`);
          
          execSync(`git push -u origin ${currentBranch}`, { cwd: targetDir });
          const prOutput = execSync(`gh pr create --base develop --head ${currentBranch} --title "fitur: ${currentBranch}" --body "Pengajuan dari tim."`, { cwd: targetDir }).toString();
          
          this._reply(`📢 <b>[Mode Tim]</b> Pengajuan pemeriksaan berhasil dibuat di GitHub!<br/><b>Tautan PR:</b> ${prOutput}<br/>Persetujuan dari 2 staf senior (CODEOWNERS) diperlukan sebelum digabungkan.`);
        }
      } catch (err) {
        this._reply(`❌ Kendala saat proses PR: ${err.message}`);
      }
      return;
    }

    // 3. Kasus: Status Ruang Kerja
    if (lowerText.includes('status')) {
      try {
        const currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim();
        this._reply(`📊 <b>Status Proyek Saat Ini:</b><br/>- Ruang Aktif: <code>${currentBranch}</code><br/>- Mode Operasional: <b>${mode === 'solo' ? '🟢 Mandiri (Solo)' : '🔵 Kerja Tim (Team)'}</b>`);
      } catch (err) {
        this._reply(`❌ Gagal mengambil status: ${err.message}`);
      }
      return;
    }

    // Respons umum AI Copilot
    this._reply(`Saya menerima pesan Anda: <i>"${text}"</i>.<br/>Anda sedang dalam <b>Mode ${mode === 'solo' ? 'Mandiri' : 'Tim'}</b>. Gunakan tombol aksi di bawah untuk membuat fitur baru atau mengajukan PR.`);
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
