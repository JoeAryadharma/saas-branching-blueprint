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
        if (!workspaceFolders) return;
        const targetDir = workspaceFolders[0].uri.fsPath;

        if (data.type === 'userInput') {
          const lowerText = data.text.toLowerCase();
          
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
            currentPanel.webview.postMessage({ type: 'response', text: `Asisten Joe menerima pesan Anda: <i>"${data.text}"</i>` });
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
