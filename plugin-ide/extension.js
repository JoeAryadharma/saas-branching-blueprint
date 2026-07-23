const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const SaaSWorkflowChatProvider = require('./chatProvider');

let currentPanel = undefined;

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

          // Pertanyaan membaca folder / project
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

              currentPanel.webview.postMessage({ type: 'response', text: replyMsg });
              return;
            } catch (err) {
              currentPanel.webview.postMessage({ type: 'response', text: `📂 <b>Folder Proyek Terdeteksi:</b> <code>${folderName}</code> (${targetDir}).` });
              return;
            }
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
            currentPanel.webview.postMessage({ type: 'response', text: `Asisten Joe membaca folder <b>${folderName}</b>. Anda mengetik: <i>"${data.text}"</i>.<br/>💡 Coba tanyakan: <i>"Bagaimana status folder proyek saya?"</i>` });
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
