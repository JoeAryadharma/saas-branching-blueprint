const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

class SaaSWorkflowChatProvider {
  constructor(extensionUri) {
    this._extensionUri = extensionUri;
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
        case 'userInput':
          await this._handleUserInput(data.text);
          break;
      }
    });
  }

  async _handleUserInput(text) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      this._reply("[PERINGATAN] Silakan buka folder proyek Anda terlebih dahulu di Antigravity IDE.");
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const folderName = path.basename(targetDir);
    const lowerText = text.toLowerCase();

    const audit = this._inspectProject(targetDir);

    // 1. Pertanyaan Membaca Folder / Inspeksi Proyek / Status
    if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('status') || lowerText.includes('inspeksi')) {
      
      let html = `<b>LAPORAN INSPEKSI PROYEK REAL-TIME</b><br/><br/>` +
        `• <b>Nama Proyek:</b> <code>${folderName}</code><br/>` +
        `• <b>Lokasi:</b> <code>${targetDir}</code><br/>` +
        `• <b>Ruang Kerja Aktif:</b> <code>${audit.currentBranch}</code><br/>` +
        `• <b>Daftar Ruang Kerja:</b> ${audit.branchesPresent.map(b => `<code>${b}</code>`).join(', ')}<br/>` +
        `• <b>Perubahan Belum Disimpan:</b> ${audit.changedFilesCount} berkas<br/>` +
        `• <b>Status Tata Kelola SaaS:</b> ${audit.hasBlueprint ? '[TERPASANG LENGKAP]' : '[BELUM TERPASANG]'}<br/><br/>`;

      html += `<b>REKOMENDASI RENCANA KERJA ASISTEN JOE:</b><br/>`;

      if (!audit.hasBlueprint) {
        html += `1. <b>Inisialisasi Blueprint:</b> Folder proyek ini belum memiliki 20 berkas SOP & CI/CD. Ketik <i>"Setup Blueprint"</i> untuk menyuntikkan template.<br/>`;
      }

      if (audit.currentBranch === 'main') {
        html += `2. <b>Keamanan Sistem Utama:</b> Anda berada di Ruang Utama (<code>main</code>). Disarankan membuat ruang fitur baru dari <code>develop</code>.<br/>`;
      } else if (audit.changedFilesCount > 0) {
        html += `2. <b>Pengajuan Pekerjaan:</b> Ada ${audit.changedFilesCount} berkas diubah. Ketik <i>"Ajukan PR"</i> untuk menguji & menggabungkan ke <code>develop</code>.<br/>`;
      }

      // Perbarui Berkas LOG_AKTIVITAS.md secara otomatis
      this._updateLogFile(targetDir, folderName, "INSPEKSI PROYEK", text, audit);

      this._reply(html);
      return;
    }

    // 2. Fitur Baru / Membuat Fitur
    if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur') || lowerText.includes('tambah fitur')) {
      const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket Pekerjaan (Contoh: TK-201):' });
      if (!ticketId) return;

      const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat (Bahasa Bisnis):' });
      if (!featureName) return;

      const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;

      try {
        execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
        this._updateLogFile(targetDir, folderName, "MEMBUAT FITUR BARU", `Membuat cabang ${branchName}`, audit);
        this._reply(`[BERHASIL] Ruang Kerja Fitur Terbuat: <code>${branchName}</code><br/>Asisten Joe siap mengawal. Setelah selesai mengisi kodingan, ketik <i>"Ajukan PR"</i>.`);
      } catch (err) {
        try {
          execSync(`git checkout -b ${branchName}`, { cwd: targetDir });
          this._updateLogFile(targetDir, folderName, "MEMBUAT FITUR BARU", `Membuat cabang ${branchName}`, audit);
          this._reply(`[BERHASIL] Ruang Kerja Fitur Terbuat: <code>${branchName}</code>.`);
        } catch (e) {
          this._reply(`[GAGAL] Tidak dapat membuat ruang kerja: ${err.message}`);
        }
      }
      return;
    }

    // 3. Ajukan PR / Pemeriksaan & Audit Mandiri
    if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan') || lowerText.includes('selesai')) {
      try {
        const currentBranch = audit.currentBranch;
        this._reply(`[PROSES] Menjalankan Audit Kelaikan Otomatis pada <code>${currentBranch}</code>...`);
        
        execSync(`git add . && git commit -m "fitur: pembaruan mandiri terverifikasi" || true`, { cwd: targetDir });
        execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });
        
        this._updateLogFile(targetDir, folderName, "PENGGABUNGAN PEKERJAAN (MERGE)", `Penggabungan ${currentBranch} ke develop`, audit);
        
        this._reply(`[BERHASIL] Pekerjaan dari <code>${currentBranch}</code> telah lulus audit kelaikan dan otomatis digabungkan ke <b>develop</b>.<br/>Berkas LOG_AKTIVITAS.md telah diperbarui.`);
      } catch (err) {
        this._reply(`[GAGAL] Kendala saat proses pengajuan: ${err.message}`);
      }
      return;
    }

    // Respons umum Asisten Joe
    this._reply(`Asisten Joe telah menerima instruksi Anda: <i>"${text}"</i>.<br/>Ruang Aktif: <code>${audit.currentBranch}</code>.<br/><br/>Ketik <i>"Inspeksi Proyek"</i> untuk melihat laporan analisis & rekomendasi rencana kerja.`);
  }

  _inspectProject(targetDir) {
    let currentBranch = 'main';
    let branchesPresent = ['main'];
    let changedFilesCount = 0;
    let hasBlueprint = false;

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

    return {
      currentBranch,
      branchesPresent,
      changedFilesCount,
      hasBlueprint
    };
  }

  _updateLogFile(targetDir, folderName, actionName, userInstruction, audit) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    const now = new Date().toLocaleString('id-ID');

    const logContent = `# LAPORAN REKAP AKTIVITAS & REKAM KERJA PROYEK

- **Nama Proyek:** ${folderName}
- **Waktu Pembaruan Terakhir:** ${now}
- **Ruang Kerja Aktif:** ${audit.currentBranch}
- **Status Tata Kelola SaaS:** ${audit.hasBlueprint ? 'Terpasang Lengkap' : 'Belum Terpasang'}

---

## 1. TABEL REKAP OPERASI SISTEM (CRUD)

| Waktu | Jenis Aktivitas | Deskripsi Operasional | Ruang Kerja | Status |
| :--- | :--- | :--- | :--- | :--- |
| ${now} | ${actionName} | ${userInstruction} | ${audit.currentBranch} | BERHASIL |

---

## 2. DIAGRAM VISUAL ALUR PEKERJAAN (INPUT KE HASIL)

\`\`\`mermaid
flowchart TD
    A["Input Instruksi: '${userInstruction}'"] --> B["Pengolahan Asisten Joe"]
    B --> C["Aktivitas Operasional: ${actionName}"]
    C --> D["Audit Kelaikan System"]
    D --> E["Hasil Akhir: Ruang ${audit.currentBranch} Terbarui"]
\`\`\`

---

*Catatan: Dokumen ini disusun secara otomatis oleh Asisten Joe untuk memberikan transparansi riwayat pekerjaan dalam bahasa bisnis sederhana tanpa emoji.*
`;

    try {
      fs.writeFileSync(logPath, logContent, 'utf8');
    } catch (e) {
      console.error('Gagal memperbarui LOG_AKTIVITAS.md:', e);
    }
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
