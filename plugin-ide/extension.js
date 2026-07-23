const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const AIEngine = require('./aiEngine');
const SaaSWorkflowChatProvider = require('./chatProvider');
const CodeReader = require('./codeReader');

let currentPanel = undefined;

// ============================================================
// AKTIVASI EKSTENSI -- Asisten Joe v5.0
// ============================================================
async function activate(context) {
  console.log('Asisten Joe v5.0 -- AI-Powered Personal Companion -- Aktif.');

  // 1. Inisialisasi AI Engine
  const aiEngine = new AIEngine();
  await aiEngine.initialize();
  console.log(`AIEngine: ${aiEngine.modelName} (Tersedia: ${aiEngine.isAvailable})`);

  // 2. Sidebar Webview Chat Provider (dengan AI Engine)
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

      // Handler Tab Chat -- memanfaatkan AI Engine
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

          // Inspeksi cepat
          let currentBranch = 'main', ticketCount = 0;
          try { currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main'; } catch(e) {}
          try {
            const rm = fs.readFileSync(path.join(targetDir, 'PETA_JALAN.md'), 'utf8');
            const m = rm.match(/TK-\d+/g); ticketCount = m ? m.length : 0;
          } catch(e) {}

          currentPanel.webview.postMessage({ type: 'updateWidget', branch: currentBranch, tickets: ticketCount });

          // Routing kata kunci utama
          if (lowerText.includes('inspeksi') || lowerText.includes('status') || lowerText.includes('proyek')) {
            const techs = CodeReader.detectTechnologies(targetDir);
            const stats = CodeReader.getDiffStats(targetDir);
            let html = `<b>INSPEKSI PROYEK</b><br/><small style="color:#94a3b8;">${aiEngine.modelName}</small><br/><br/>` +
              `Proyek: <code>${folderName}</code> | Ruang: <code>${currentBranch}</code><br/>` +
              `Teknologi: ${techs.join(', ')}<br/>` +
              `Perubahan: ${stats.filesChanged} berkas (+${stats.insertions}/-${stats.deletions})<br/>` +
              `Tiket aktif: ${ticketCount}`;

            if (aiEngine.isAvailable) {
              const ctx = CodeReader.buildFullContext(targetDir);
              const rec = await aiEngine.ask('Berikan 2 rekomendasi langkah kerja berikutnya. Singkat.', ctx);
              if (rec) html += `<br/><br/><b>REKOMENDASI AI:</b><br/>${rec.replace(/\n/g, '<br/>')}`;
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
          }
          else if (lowerText.includes('risiko') || lowerText.includes('biaya') || lowerText.includes('dampak')) {
            const stats = CodeReader.getDiffStats(targetDir);
            const areas = CodeReader.classifyChanges(targetDir);
            const diff = CodeReader.getRecentDiff(targetDir);
            const hasHighRisk = areas.database.length > 0 || areas.api.length > 0;
            const total = stats.totalLines;
            let level = hasHighRisk || total >= 200 ? 'TINGGI' : total >= 50 ? 'SEDANG' : 'RENDAH';

            let html = `<b>ANALISIS RISIKO</b><br/>` +
              `Berkas: ${stats.filesChanged} | +${stats.insertions}/-${stats.deletions} | Risiko: <b>${level}</b>`;

            if (aiEngine.isAvailable) {
              const aiR = await aiEngine.ask(`Analisis risiko perubahan kode ini. Singkat.\n\n${diff}`);
              if (aiR) html += `<br/><br/>${aiR.replace(/\n/g, '<br/>')}`;
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
          }
          else if (lowerText.includes('rilis') || lowerText.includes('pengumuman') || lowerText.includes('release')) {
            let commits = [];
            try { commits = execSync('git log --oneline -5', { cwd: targetDir }).toString().trim().split('\n'); } catch(e) {}
            const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            let html = `<b>DRAF PENGUMUMAN RILIS</b><br/><small style="color:#94a3b8;">${now}</small><br/><br/>`;
            if (aiEngine.isAvailable) {
              const aiDraft = await aiEngine.ask(
                `Susun draf pengumuman rilis singkat untuk pelanggan "${folderName}" tanggal ${now}. Perubahan:\n${commits.join('\n')}\nTanpa emoji. Maksimal 100 kata.`
              );
              html += aiDraft ? aiDraft.replace(/\n/g, '<br/>') : commits.map((c,i) => `${i+1}. ${c}`).join('<br/>');
            } else {
              html += commits.map((c,i) => `${i+1}. ${c}`).join('<br/>');
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
          }
          else if (lowerText.includes('ide') || lowerText.includes('pecah') || lowerText.includes('tiket')) {
            let ideaText = data.text;
            if (ideaText.length < 15) {
              const inp = await vscode.window.showInputBox({ prompt: 'Jelaskan ide bisnis Anda:' });
              if (!inp) return;
              ideaText = inp;
            }

            let html = `<b>TIKET TUGAS</b><br/><small style="color:#94a3b8;">"${ideaText}"</small><br/><br/>`;
            if (aiEngine.isAvailable) {
              const aiTk = await aiEngine.ask(
                `Pecah ide ini jadi 3-5 tiket kerja spesifik: "${ideaText}". Format: nomor. judul - deskripsi. Tanpa emoji.`,
                CodeReader.buildFullContext(targetDir)
              );
              html += aiTk ? aiTk.replace(/\n/g, '<br/>') : '[Tidak tersedia]';
            } else {
              const b = Math.floor(Date.now() / 100000) % 900 + 100;
              html += [`TK-${b}: Perancangan`, `TK-${b+1}: Modul Inti`, `TK-${b+2}: Tampilan`, `TK-${b+3}: Pengujian`, `TK-${b+4}: Peluncuran`].map(t => `<code>${t}</code>`).join('<br/>');
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
          }
          else if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur')) {
            const ticketId = await vscode.window.showInputBox({ prompt: 'Nomor Tiket (Contoh: TK-201):' });
            if (!ticketId) return;
            const fName = await vscode.window.showInputBox({ prompt: 'Nama Fitur Singkat:' });
            if (!fName) return;
            const bn = `feature/${ticketId}-${fName.toLowerCase().replace(/\s+/g, '-')}`;
            try {
              try { execSync(`git checkout develop && git checkout -b ${bn}`, { cwd: targetDir }); }
              catch(e) { execSync(`git checkout -b ${bn}`, { cwd: targetDir }); }
              currentPanel.webview.postMessage({ type: 'response', text: `[BERHASIL] Fitur: <code>${bn}</code>` });
            } catch(err) {
              currentPanel.webview.postMessage({ type: 'response', text: `[GAGAL] ${err.message}` });
            }
          }
          else {
            // Pertanyaan bebas ke AI
            let html = '';
            if (aiEngine.isAvailable) {
              currentPanel.webview.postMessage({ type: 'response', text: `<small style="color:#94a3b8;">[PROSES] Berpikir dengan ${aiEngine.modelName}...</small>` });
              const ctx = CodeReader.buildFullContext(targetDir);
              const aiResp = await aiEngine.ask(data.text, ctx);
              html = aiResp ? `<b>Asisten Joe</b> <small style="color:#94a3b8;">(${aiEngine.modelName})</small><br/><br/>${aiResp.replace(/\n/g, '<br/>')}` :
                `Proyek: <b>${folderName}</b>. Gunakan tombol pintas di bawah.`;
            } else {
              html = `Proyek: <b>${folderName}</b> | Ruang: <code>${currentBranch}</code>.<br/>Model AI tidak tersedia. Gunakan tombol pintas.`;
            }
            currentPanel.webview.postMessage({ type: 'response', text: html });
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

  // 6. Command Palette: Analisis Risiko
  let disposableRisk = vscode.commands.registerCommand('saasWorkflow.analyzeRisk', async function () {
    const wf = vscode.workspace.workspaceFolders;
    if (!wf) return;
    const stats = CodeReader.getDiffStats(wf[0].uri.fsPath);
    const areas = CodeReader.classifyChanges(wf[0].uri.fsPath);
    const hasHigh = areas.database.length > 0 || areas.api.length > 0;
    const level = hasHigh || stats.totalLines >= 200 ? 'TINGGI' : stats.totalLines >= 50 ? 'SEDANG' : 'RENDAH';
    vscode.window.showInformationMessage(`Asisten Joe -- Risiko: [${level}] (${stats.totalLines} baris, area: ${Object.entries(areas).filter(([,f])=>f.length>0).map(([a,f])=>`${a}:${f.length}`).join(', ')})`);
  });

  // 7. Command Palette: Pecah Ide
  let disposableIdea = vscode.commands.registerCommand('saasWorkflow.breakdownIdea', async function () {
    const wf = vscode.workspace.workspaceFolders;
    if (!wf) return;
    const idea = await vscode.window.showInputBox({ prompt: 'Jelaskan ide bisnis Anda:' });
    if (!idea) return;

    if (aiEngine.isAvailable) {
      const ctx = CodeReader.buildFullContext(wf[0].uri.fsPath);
      const result = await aiEngine.ask(`Pecah ide ini jadi 3-5 tiket kerja: "${idea}". Format ringkas.`, ctx);
      vscode.window.showInformationMessage(result ? `Asisten Joe: ${result.substring(0, 200)}` : 'Gagal memproses ide.');
    } else {
      vscode.window.showInformationMessage('Asisten Joe: Model AI tidak tersedia. Gunakan chat untuk fitur ini.');
    }
  });

  context.subscriptions.push(disposableOpenTab, disposableInit, disposableFeature, disposableRisk, disposableIdea);
}

function deactivate() {}

module.exports = { activate, deactivate };
