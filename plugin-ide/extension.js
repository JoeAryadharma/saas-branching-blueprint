const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AIEngine = require('./aiEngine');
const SaaSWorkflowChatProvider = require('./chatProvider');
const CodeReader = require('./codeReader');
const VibeGuard = require('./vibeGuard');

let currentPanel = undefined;

// ============================================================
// AKTIVASI EKSTENSI -- Asisten Joe v6.0 Vibe Guard
// ============================================================
async function activate(context) {
  console.log('Asisten Joe v6.0 -- Pengawal Vibe Coding -- Aktif.');

  // 1. Inisialisasi AI Engine
  const aiEngine = new AIEngine();
  await aiEngine.initialize();

  // 2. Sidebar Webview Chat Provider
  const chatProvider = new SaaSWorkflowChatProvider(context.extensionUri, aiEngine);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('saasWorkflow.chatView', chatProvider)
  );

  // 3. Tab Chat Utama (Ikon Header Bar)
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
        { enableScripts: true, localResourceRoots: [context.extensionUri] }
      );

      currentPanel.webview.html = fs.readFileSync(
        path.join(context.extensionUri.fsPath, 'chat-view.html'), 'utf8'
      );

      currentPanel.webview.onDidReceiveMessage(async (data) => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          currentPanel.webview.postMessage({ type: 'response', text: "[PERINGATAN] Buka folder proyek terlebih dahulu." });
          return;
        }

        const targetDir = workspaceFolders[0].uri.fsPath;
        const folderName = path.basename(targetDir);

        if (data.type === 'userInput') {
          const lowerText = data.text.toLowerCase();

          let currentBranch = 'main';
          try { currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main'; } catch(e) {}

          const diff = CodeReader.getRecentDiff(targetDir);
          const areas = CodeReader.classifyChanges(targetDir);
          const vibeRes = VibeGuard.auditAll(targetDir, diff, areas);

          currentPanel.webview.postMessage({
            type: 'updateWidget',
            branch: currentBranch,
            secrets: vibeRes.secretAudit.isSafe ? 'AMAN' : 'BAHAYA',
            regression: vibeRes.regressionAudit.riskCount,
            duplicates: vibeRes.duplicateAudit.warnings.length
          });

          // Audit Vibe Coding
          if (lowerText.includes('vibe') || lowerText.includes('audit')) {
            let html = `<b>AUDIT PENGAWAL VIBE CODING</b><br/><small style="color:#94a3b8;">${aiEngine.modelName}</small><br/><br/>` +
              `• <b>Kunci Rahasia API:</b> ${vibeRes.secretAudit.isSafe ? '<span style="color:#22c55e;">[AMAN]</span>' : '<span style="color:#ef4444;">[BAHAYA - KUNCI TERDETEKSI]</span>'}<br/>` +
              `• <b>Risiko Regresi Fitur:</b> ${!vibeRes.regressionAudit.hasRisk ? '<span style="color:#22c55e;">[AMAN]</span>' : `<span style="color:#f59e0b;">[${vibeRes.regressionAudit.riskCount} MODUL INTI TERSENTUH]</span>`}<br/>` +
              `• <b>Kode Duplikat & Sampah:</b> ${!vibeRes.duplicateAudit.hasDuplicates ? '<span style="color:#22c55e;">[AMAN]</span>' : `<span style="color:#f59e0b;">[${vibeRes.duplicateAudit.warnings.length} DRAF]</span>`}`;

            if (!vibeRes.secretAudit.isSafe) {
              html += `<br/><br/><small style="color:#ef4444;">Peringatan: Pindahkan API key dari berkas kode ke berkas .env!</small>`;
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
          } else {
            currentPanel.webview.postMessage({
              type: 'response',
              text: `Asisten Joe v6.0 (Vibe Guard) membaca proyek <b>${folderName}</b>.<br/>Instruksi: <i>"${data.text}"</i>.<br/>Gunakan tombol pintas di bawah.`
            });
          }
        }
      });

      currentPanel.onDidDispose(() => { currentPanel = undefined; }, null, context.subscriptions);
    }
  });

  // 4. Command Palette: Inisialisasi Blueprint
  let disposableInit = vscode.commands.registerCommand('saasWorkflow.initProject', function () {
    const wf = vscode.workspace.workspaceFolders;
    if (!wf) { vscode.window.showErrorMessage('Buka folder proyek terlebih dahulu!'); return; }
    try {
      execSync(`node "${path.join(__dirname, 'cli.js')}" "${wf[0].uri.fsPath}"`);
      vscode.window.showInformationMessage('Berhasil! Cetakan Tata Kelola SaaS disuntikkan.');
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal: ${err.message}`);
    }
  });

  // 5. Command Palette: Buat Fitur
  let disposableFeature = vscode.commands.registerCommand('saasWorkflow.createFeatureBranch', async function () {
    const wf = vscode.workspace.workspaceFolders;
    if (!wf) return;
    const ticketId = await vscode.window.showInputBox({ prompt: 'Nomor Tiket (Contoh: TK-102):' });
    if (!ticketId) return;
    const fName = await vscode.window.showInputBox({ prompt: 'Nama Fitur Singkat:' });
    if (!fName) return;
    const bn = `feature/${ticketId}-${fName.toLowerCase().replace(/\s+/g, '-')}`;
    try {
      execSync(`git checkout develop && git checkout -b ${bn}`, { cwd: wf[0].uri.fsPath });
      vscode.window.showInformationMessage(`Berhasil: ${bn}`);
    } catch (err) {
      vscode.window.showErrorMessage(`Gagal: ${err.message}`);
    }
  });

  // 6. Command Palette: Audit Vibe Coding Instan
  let disposableVibeAudit = vscode.commands.registerCommand('saasWorkflow.auditVibeCoding', function () {
    const wf = vscode.workspace.workspaceFolders;
    if (!wf) return;
    const targetDir = wf[0].uri.fsPath;
    const diff = CodeReader.getRecentDiff(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    const vRes = VibeGuard.auditAll(targetDir, diff, areas);

    const msg = `Asisten Joe Vibe Guard: Rahasia API [${vRes.secretAudit.isSafe ? 'AMAN' : 'BAHAYA'}], ` +
      `Regresi [${vRes.regressionAudit.riskCount} risiko], Duplikat [${vRes.duplicateAudit.warnings.length} draf]`;

    if (!vRes.secretAudit.isSafe) {
      vscode.window.showErrorMessage(msg);
    } else {
      vscode.window.showInformationMessage(msg);
    }
  });

  context.subscriptions.push(disposableOpenTab, disposableInit, disposableFeature, disposableVibeAudit);
}

function deactivate() {}

module.exports = { activate, deactivate };
