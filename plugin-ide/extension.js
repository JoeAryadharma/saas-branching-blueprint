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

/**
 * VS Code & Antigravity IDE Extension Activation Handler
 */
function activate(context) {
  console.log('Plugin IDE Asisten Joe Tata Kelola Ruang Kerja telah aktif!');

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
        '🛡️ Asisten Joe',
        columnToShowIn,
        {
          enableScripts: true,
          localResourceRoots: [context.extensionUri]
        }
      );

      const htmlPath = path.join(context.extensionUri.fsPath, 'chat-view.html');
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');

      currentPanel.webview.html = htmlContent;

      // Handle chat messages in Tab Mode
      currentPanel.webview.onDidReceiveMessage(async (data) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          currentPanel.webview.postMessage({ type: 'response', text: "⚠️ Buka folder proyek Anda di Antigravity IDE terlebih dahulu!" });
          return;
        }

        const targetDir = workspaceFolders[0].uri.fsPath;
        const folderName = path.basename(targetDir);

        if (data.type === 'userInput') {
          const lowerText = data.text.toLowerCase();
          const audit = inspectProject(targetDir);

          // Pertanyaan membaca folder / project / status / pull
          if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('status') || lowerText.includes('isi') || lowerText.includes('pull')) {
            let html = `<b>🔍 LAPORAN INSPEKSI PROYEK REAL-TIME (ASISTEN JOE)</b><br/><br/>` +
              `📁 <b>Folder Proyek:</b> <code>${folderName}</code><br/>` +
              `📍 <b>Lokasi:</b> <code>${targetDir}</code><br/>` +
              `🌿 <b>Ruang Kerja Aktif:</b> <code>${audit.currentBranch}</code><br/>` +
              `📊 <b>Ruang Kerja Terdeteksi:</b> ${audit.branchesPresent.map(b => `<code>${b}</code>`).join(', ')}<br/>` +
              `📝 <b>Perubahan Belum Disimpan:</b> ${audit.changedFilesCount} berkas<br/>` +
              `🛡️ <b>Tata Kelola & SOP SaaS:</b> ${audit.hasBlueprint ? '✅ Terpasang Lengkap' : '❌ Belum Terpasang'}<br/><br/>`;

            if (audit.rootStructure.length > 0) {
              html += `📂 <b>Struktur Berkas Utama:</b><br/><code>` + audit.rootStructure.slice(0, 8).join(', ') + `</code><br/><br/>`;
            }

            html += `🎯 <b>REKOMENDASI RENCANA KERJA ASISTEN JOE:</b><br/>`;

            if (!audit.hasBlueprint) {
              html += `1. <b>Suntikkan Tata Kelola SaaS:</b> Folder proyek ini belum memiliki 20 berkas SOP & CI/CD. Ketik <i>"Setup Blueprint"</i> atau klik tombol <b>Inisialisasi Blueprint</b>.<br/>`;
            }

            if (!audit.branchesPresent.includes('develop')) {
              html += `2. <b>Siapkan Ruang Kerja Integrasi:</b> Proyek ini belum memiliki cabang <code>develop</code>.<br/>`;
            }

            if (audit.currentBranch === 'main') {
              html += `💡 <b>Peringatan Keamanan:</b> Anda sedang berada di Ruang Utama (<code>main</code>). Untuk mulai bekerja, Asisten Joe menyarankan Anda beralih ke Ruang Fitur baru dari <code>develop</code>.<br/>`;
            } else if (audit.changedFilesCount > 0) {
              html += `💡 <b>Rekomendasi Pekerjaan:</b> Ada ${audit.changedFilesCount} berkas diubah. Ketik <i>"Ajukan PR"</i> untuk menguji & menggabungkan ke <code>develop</code>.<br/>`;
            }

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
              currentPanel.webview.postMessage({ type: 'response', text: `✅ <b>Ruang Kerja Fitur Terbuat:</b> <code>${branchName}</code><br/>Asisten Joe siap mengawal.` });
            } catch (err) {
              currentPanel.webview.postMessage({ type: 'response', text: `❌ Gagal: ${err.message}` });
            }
          } else {
            currentPanel.webview.postMessage({ type: 'response', text: `Asisten Joe membaca proyek <b>${folderName}</b> (Ruang: <code>${audit.currentBranch}</code>).<br/>Anda mengetik: <i>"${data.text}"</i>.<br/>💡 Ketik <i>"baca folder"</i> untuk melihat laporan inspeksi proyek secara lengkap.` });
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
      vscode.window.showInformationMessage('🎉 Berhasil! Cetakan Tata Kelola SaaS & 4 Ruang Kerja disuntikkan oleh Asisten Joe.');
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
      vscode.window.showInformationMessage(`✅ Ruang Kerja Fitur Terbuat: ${branchName}`);
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
