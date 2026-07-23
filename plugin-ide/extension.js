const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const SaaSWorkflowChatProvider = require('./chatProvider');

let currentPanel = undefined;

function inspectProject(targetDir) {
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

function updateLogFile(targetDir, folderName, actionName, userInstruction, audit) {
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

/**
 * VS Code & Antigravity IDE Extension Activation Handler
 */
function activate(context) {
  console.log('Plugin IDE Asisten Joe Tata Kelola Ruang Kerja telah aktif.');

  // 1. Daftarkan Webview Ruang Chat Copilot di Sidebar
  const chatProvider = new SaaSWorkflowChatProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('saasWorkflow.chatView', chatProvider)
  );

  // 2. Daftarkan Perintah Buka Tab Chat Utama (Ikon Header Bar / Editor Title Action)
  let disposableOpenTab = vscode.commands.registerCommand('saasWorkflow.openChatTab', function () {
    const columnToShowIn = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : vscode.ViewColumn.One;

    if (currentPanel) {
      currentPanel.reveal(columnToShowIn);
    } else {
      currentPanel = vscode.window.createWebviewPanel(
        'saasWorkflowChatTab',
        'Asisten Joe',
        columnToShowIn,
        {
          enableScripts: true,
          localResourceRoots: [context.extensionUri]
        }
      );

      const htmlPath = path.join(context.extensionUri.fsPath, 'chat-view.html');
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');

      currentPanel.webview.html = htmlContent;

      currentPanel.webview.onDidReceiveMessage(async (data) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          currentPanel.webview.postMessage({ type: 'response', text: "[PERINGATAN] Buka folder proyek Anda di Antigravity IDE terlebih dahulu." });
          return;
        }

        const targetDir = workspaceFolders[0].uri.fsPath;
        const folderName = path.basename(targetDir);

        if (data.type === 'userInput') {
          const lowerText = data.text.toLowerCase();
          const audit = inspectProject(targetDir);

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
              html += `1. <b>Inisialisasi Blueprint:</b> Folder proyek ini belum memiliki 20 berkas SOP & CI/CD. Ketik <i>"Setup Blueprint"</i>.<br/>`;
            }

            if (audit.currentBranch === 'main') {
              html += `2. <b>Keamanan Sistem Utama:</b> Anda sedang di Ruang Utama (<code>main</code>). Disarankan beralih ke Ruang Fitur baru dari <code>develop</code>.<br/>`;
            } else if (audit.changedFilesCount > 0) {
              html += `2. <b>Pengajuan Pekerjaan:</b> Ada ${audit.changedFilesCount} berkas diubah. Ketik <i>"Ajukan PR"</i>.<br/>`;
            }

            updateLogFile(targetDir, folderName, "INSPEKSI PROYEK", data.text, audit);
            currentPanel.webview.postMessage({ type: 'response', text: html });
            return;
          }
          
          if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur')) {
            const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket (Contoh: TK-201):' });
            if (!ticketId) return;
            const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat:' });
            if (!featureName) return;

            const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
            try {
              execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
              updateLogFile(targetDir, folderName, "MEMBUAT FITUR BARU", `Membuat cabang ${branchName}`, audit);
              currentPanel.webview.postMessage({ type: 'response', text: `[BERHASIL] Ruang Kerja Fitur Terbuat: <code>${branchName}</code>` });
            } catch (err) {
              currentPanel.webview.postMessage({ type: 'response', text: `[GAGAL] ${err.message}` });
            }
          } else {
            currentPanel.webview.postMessage({ type: 'response', text: `Asisten Joe membaca proyek <b>${folderName}</b> (Ruang: <code>${audit.currentBranch}</code>).<br/>Instruksi: <i>"${data.text}"</i>.<br/>Ketik <i>"Inspeksi Proyek"</i> untuk laporan lengkap & rekap log.` });
          }
        }
      });

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );
    }
  });

  // 3. Perintah Manual: Inisialisasi Cetakan Proyek Lengkap (Setup Blueprint)
  let disposableInit = vscode.commands.registerCommand('saasWorkflow.initProject', function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('Silakan buka folder proyek Anda terlebih dahulu di Antigravity IDE!');
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const cliScript = path.join(__dirname, 'cli.js');

    try {
      execSync(`node "${cliScript}" "${targetDir}"`);
      vscode.window.showInformationMessage('Berhasil! Cetakan Tata Kelola SaaS disuntikkan oleh Asisten Joe.');
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal menyuntikkan template: ${err.message}`);
    }
  });

  // 4. Perintah Manual: Buat Ruang Kerja Fitur Baru
  let disposableFeature = vscode.commands.registerCommand('saasWorkflow.createFeatureBranch', async function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;
    const targetDir = workspaceFolders[0].uri.fsPath;

    const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket Pekerjaan (Contoh: TK-102):' });
    if (!ticketId) return;

    const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat (Bahasa Bisnis):' });
    if (!featureName) return;

    const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
    try {
      execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
      vscode.window.showInformationMessage(`Berhasil: Ruang Kerja Fitur Terbuat ${branchName}`);
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal membuat ruang kerja: ${err.message}`);
    }
  });

  context.subscriptions.push(disposableOpenTab, disposableInit, disposableFeature);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
