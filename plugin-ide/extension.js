const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AIEngine = require('./aiEngine');
const SaaSWorkflowChatProvider = require('./chatProvider');
const CodeReader = require('./codeReader');
const VibeGuard = require('./vibeGuard');
const VibeOptimizer = require('./vibeOptimizer');

let currentPanel = undefined;

// ============================================================
// AKTIVASI EKSTENSI -- Asisten Joe v9.6.3 (Inline CodeLens & Hover Guard)
// ============================================================
async function activate(context) {
  console.log('Asisten Joe v9.6.3 -- Inline CodeLens & Hover Diagnostic Guard -- Aktif.');

  // 1. Inisialisasi AI Engine
  const aiEngine = new AIEngine();
  await aiEngine.initialize();

  // 2. Sidebar Webview Chat Provider
  const chatProvider = new SaaSWorkflowChatProvider(context.extensionUri, aiEngine);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('saasWorkflow.chatView', chatProvider)
  );

  // ============================================================
  // TAHAP 4 OPTIMASI (v9.6.3): INLINE CODELENS PROVIDER
  // Menampilkan tombol prompt melayang langsung di atas fungsi/kelas editor
  // ============================================================
  const codeLensProvider = {
    provideCodeLenses(document, token) {
      const codeLenses = [];
      const text = document.getText();
      const lines = text.split('\n');

      lines.forEach((line, index) => {
        if (/^\s*(async\s+)?function\s+[a-zA-Z0-9_]+|^\s*class\s+[a-zA-Z0-9_]+|^\s*const\s+[a-zA-Z0-9_]+\s*=\s*(async\s*)?\(/i.test(line)) {
          const range = new vscode.Range(index, 0, index, line.length);
          const cmd = {
            title: "🛡️ Asisten Joe: Susun Prompt Modul Ini",
            command: "saasWorkflow.generatePromptForBlock",
            arguments: [document.uri, range, line.trim()]
          };
          codeLenses.push(new vscode.CodeLens(range, cmd));
        }
      });

      return codeLenses;
    }
  };

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [{ scheme: 'file', language: 'javascript' }, { scheme: 'file', language: 'typescript' }, { scheme: 'file', language: 'html' }, { scheme: 'file', language: 'python' }],
      codeLensProvider
    )
  );

  // ============================================================
  // TAHAP 4 OPTIMASI (v9.6.3): HOVER DIAGNOSTIC GUARD
  // Menampilkan peringatan kebocoran rahasia saat kursor diarahkan ke kode
  // ============================================================
  const hoverProvider = {
    provideHover(document, position, token) {
      const lineText = document.lineAt(position.line).text;
      
      const secretPatterns = [
        /sk_live_[0-9a-zA-Z]{24,}/,
        /AIzaSy[0-9a-zA-Z-_]{35}/,
        /ghp_[0-9a-zA-Z]{36}/,
        /postgres:\/\/[^:]+:[^@]+@/
      ];

      const isSecretFound = secretPatterns.some(p => p.test(lineText));

      if (isSecretFound) {
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`### ⚠️ PENGAWAL KEAMANAN VIBE v9.6.3\n\n`);
        markdown.appendMarkdown(`**Peringatan Kebocoran Rahasia:** Kunci API / kredensial terdeteksi ditulis langsung di baris ini.\n\n`);
        markdown.appendMarkdown(`**Rekomendasi:** Pindahkan nilai ini ke berkas \`.env\` dan gunakan \`process.env.NAMA_KUNCI\`.\n`);
        return new vscode.Hover(markdown);
      }

      return null;
    }
  };

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      [{ scheme: 'file', language: 'javascript' }, { scheme: 'file', language: 'typescript' }, { scheme: 'file', language: 'python' }],
      hoverProvider
    )
  );

  // Command: Generate Prompt For Block Code (CodeLens Callback)
  let disposableBlockPrompt = vscode.commands.registerCommand('saasWorkflow.generatePromptForBlock', async function (uri, range, lineText) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const blockCode = editor.document.getText(new vscode.Range(
      Math.max(0, range.start.line - 1),
      0,
      Math.min(editor.document.lineCount - 1, range.end.line + 25),
      0
    ));

    const generatedPrompt = VibeOptimizer.compileDSPyPrompt(`Susunkan draf perbaikan/pengembangan untuk modul berikut: ${lineText}`, blockCode);
    
    vscode.env.clipboard.writeText(generatedPrompt);
    vscode.window.showInformationMessage(`[BERHASIL] Draf Prompt untuk '${lineText}' disalin ke Clipboard! Salin ke AI Anda.`);
  });

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
              text: `Asisten Joe v9.6.3 (Vibe Guard) membaca proyek <b>${folderName}</b>.<br/>Instruksi: <i>"${data.text}"</i>.<br/>Gunakan tombol pintas di bawah.`
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

  context.subscriptions.push(disposableOpenTab, disposableInit, disposableFeature, disposableVibeAudit, disposableBlockPrompt);
}

function deactivate() {}

module.exports = { activate, deactivate };
