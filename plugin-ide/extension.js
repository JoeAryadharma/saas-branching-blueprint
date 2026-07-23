const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const SaaSWorkflowChatProvider = require('./chatProvider');

let currentPanel = undefined;

// ============================================================
// UTILITAS BERSAMA (Dipakai oleh Tab Chat Handler)
// ============================================================
function inspectProject(targetDir) {
  let currentBranch = 'main';
  let branchesPresent = ['main'];
  let changedFilesCount = 0;
  let hasBlueprint = false;
  let ticketCount = 0;

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
    const roadmap = fs.readFileSync(path.join(targetDir, 'PETA_JALAN.md'), 'utf8');
    const matches = roadmap.match(/TK-\d+/g);
    ticketCount = matches ? matches.length : 0;
  } catch (e) {}

  return { currentBranch, branchesPresent, changedFilesCount, hasBlueprint, ticketCount };
}

function updateLogFile(targetDir, folderName, actionName, userInstruction, audit) {
  const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
  const now = new Date().toLocaleString('id-ID');

  const logContent = `# LAPORAN REKAP AKTIVITAS & REKAM KERJA PROYEK

- **Nama Proyek:** ${folderName}
- **Waktu Pembaruan Terakhir:** ${now}
- **Ruang Kerja Aktif:** ${audit.currentBranch}
- **Status Tata Kelola SaaS:** ${audit.hasBlueprint ? 'Terpasang Lengkap' : 'Belum Terpasang'}
- **Otak Intelegensi AI:** Model AI Aktif IDE

---

## 1. TABEL REKAP OPERASI SISTEM (CRUD)

| Waktu | Jenis Aktivitas | Deskripsi Operasional | Ruang Kerja | Status |
| :--- | :--- | :--- | :--- | :--- |
| ${now} | ${actionName} | ${userInstruction} | ${audit.currentBranch} | BERHASIL |

---

## 2. DIAGRAM VISUAL ALUR PEKERJAAN (INPUT KE HASIL)

\`\`\`mermaid
flowchart TD
    A["Input Instruksi: '${userInstruction}'"] --> B["Pemrosesan Intelegensi Asisten Joe"]
    B --> C["Aktivitas Operasional: ${actionName}"]
    C --> D["Audit Kelaikan System"]
    D --> E["Hasil Akhir: Ruang ${audit.currentBranch} Terbarui"]
\`\`\`

---

*Catatan: Dokumen ini disusun secara otomatis oleh Asisten Joe v4.0.*
`;

  try {
    fs.writeFileSync(logPath, logContent, 'utf8');
  } catch (e) {
    console.error('Gagal memperbarui LOG_AKTIVITAS.md:', e);
  }
}

// ============================================================
// AKTIVASI EKSTENSI
// ============================================================
function activate(context) {
  console.log('Asisten Joe v4.0 Ultimate Personal Companion -- Aktif.');

  // 1. Sidebar Webview Chat Provider
  const chatProvider = new SaaSWorkflowChatProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('saasWorkflow.chatView', chatProvider)
  );

  // 2. Tab Chat Utama (Ikon Header Bar)
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
      currentPanel.webview.html = fs.readFileSync(htmlPath, 'utf8');

      // Riwayat log untuk Tab Chat
      const tabLogHistory = [];

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

          // Update widget
          currentPanel.webview.postMessage({
            type: 'updateWidget',
            branch: audit.currentBranch,
            tickets: audit.ticketCount || 0
          });

          // ---- Inspeksi Proyek ----
          if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('status') || lowerText.includes('inspeksi')) {
            let html = `<b>LAPORAN INSPEKSI PROYEK</b><br/>` +
              `<small style="color:#94a3b8;">Intelegensi: Model AI Aktif IDE</small><br/><br/>` +
              `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
              `<tr><td style="padding:3px 6px;color:#94a3b8;">Nama Proyek</td><td style="padding:3px 6px;"><code>${folderName}</code></td></tr>` +
              `<tr><td style="padding:3px 6px;color:#94a3b8;">Ruang Kerja</td><td style="padding:3px 6px;"><code>${audit.currentBranch}</code></td></tr>` +
              `<tr><td style="padding:3px 6px;color:#94a3b8;">Berkas Berubah</td><td style="padding:3px 6px;">${audit.changedFilesCount} berkas</td></tr>` +
              `<tr><td style="padding:3px 6px;color:#94a3b8;">Tata Kelola</td><td style="padding:3px 6px;">${audit.hasBlueprint ? '[TERPASANG]' : '[BELUM]'}</td></tr>` +
              `<tr><td style="padding:3px 6px;color:#94a3b8;">Tiket</td><td style="padding:3px 6px;">${audit.ticketCount}</td></tr>` +
              `</table>`;
            updateLogFile(targetDir, folderName, "INSPEKSI PROYEK", data.text, audit);
            currentPanel.webview.postMessage({ type: 'response', text: html });
            return;
          }

          // ---- Fitur Baru ----
          if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur')) {
            const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket (Contoh: TK-201):' });
            if (!ticketId) return;
            const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat:' });
            if (!featureName) return;

            const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
            try {
              try {
                execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
              } catch (e) {
                execSync(`git checkout -b ${branchName}`, { cwd: targetDir });
              }
              updateLogFile(targetDir, folderName, "MEMBUAT FITUR BARU", `Cabang ${branchName}`, audit);
              currentPanel.webview.postMessage({ type: 'response', text: `[BERHASIL] Ruang Kerja Fitur: <code>${branchName}</code>` });
            } catch (err) {
              currentPanel.webview.postMessage({ type: 'response', text: `[GAGAL] ${err.message}` });
            }
            return;
          }

          // ---- Analisis Risiko ----
          if (lowerText.includes('risiko') || lowerText.includes('biaya') || lowerText.includes('dampak')) {
            let diffInfo = { files: 0, ins: 0, del: 0 };
            try {
              const raw = execSync('git diff --stat HEAD~1 HEAD 2>/dev/null || git diff --stat', { cwd: targetDir }).toString();
              const sum = raw.split('\n').filter(l => l.includes('changed')).pop() || '';
              const fm = sum.match(/(\d+)\s+file/); const im = sum.match(/(\d+)\s+insertion/); const dm = sum.match(/(\d+)\s+deletion/);
              diffInfo.files = fm ? parseInt(fm[1]) : 0; diffInfo.ins = im ? parseInt(im[1]) : 0; diffInfo.del = dm ? parseInt(dm[1]) : 0;
            } catch (e) {}

            const total = diffInfo.ins + diffInfo.del;
            let level, color;
            if (total < 50) { level = 'RENDAH'; color = '#22c55e'; }
            else if (total < 200) { level = 'SEDANG'; color = '#f59e0b'; }
            else { level = 'TINGGI'; color = '#ef4444'; }

            const html = `<b>ANALISIS RISIKO & BIAYA</b><br/><br/>` +
              `Berkas berubah: <b>${diffInfo.files}</b> | Baris +${diffInfo.ins} / -${diffInfo.del}<br/>` +
              `Volume total: <b>${total} baris</b><br/>` +
              `Tingkat risiko: <b style="color:${color};">[${level}]</b>`;
            updateLogFile(targetDir, folderName, "ANALISIS RISIKO", `Tingkat: ${level}`, audit);
            currentPanel.webview.postMessage({ type: 'response', text: html });
            return;
          }

          // ---- Pengumuman Rilis ----
          if (lowerText.includes('rilis') || lowerText.includes('release') || lowerText.includes('pengumuman')) {
            let commits = [];
            try {
              commits = execSync('git log --oneline -5', { cwd: targetDir }).toString().trim().split('\n').filter(Boolean);
            } catch (e) {}
            const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const changes = commits.map(c => c.substring(c.indexOf(' ') + 1));
            const html = `<b>DRAF PENGUMUMAN RILIS</b><br/><br/>` +
              `<b>Tanggal:</b> ${now}<br/><b>Proyek:</b> ${folderName}<br/><br/>` +
              `<b>Pembaruan:</b><br/>` +
              changes.map((c, i) => `${i + 1}. ${c}`).join('<br/>');
            updateLogFile(targetDir, folderName, "DRAF PENGUMUMAN RILIS", data.text, audit);
            currentPanel.webview.postMessage({ type: 'response', text: html });
            return;
          }

          // ---- Pecah Ide ke Tiket ----
          if (lowerText.includes('ide') || lowerText.includes('pecah') || lowerText.includes('tiket') || lowerText.includes('roadmap')) {
            let ideaText = data.text;
            if (ideaText.length < 15) {
              const input = await vscode.window.showInputBox({ prompt: 'Jelaskan ide bisnis Anda:' });
              if (!input) return;
              ideaText = input;
            }
            const base = Math.floor(Date.now() / 100000) % 900 + 100;
            const tickets = [
              { id: `TK-${base}`, t: 'Perancangan & Analisis Kebutuhan' },
              { id: `TK-${base+1}`, t: 'Pengembangan Modul Inti' },
              { id: `TK-${base+2}`, t: 'Pembuatan Tampilan Pengguna' },
              { id: `TK-${base+3}`, t: 'Pengujian & Validasi' },
              { id: `TK-${base+4}`, t: 'Peluncuran & Pengumuman' },
            ];
            const html = `<b>TIKET TUGAS DARI IDE</b><br/>` +
              `<small style="color:#94a3b8;">"${ideaText}"</small><br/><br/>` +
              tickets.map(tk => `<code>${tk.id}</code> ${tk.t}`).join('<br/>');
            updateLogFile(targetDir, folderName, "PEMBONGKARAN IDE", `${tickets.length} tiket`, audit);
            currentPanel.webview.postMessage({ type: 'response', text: html });
            return;
          }

          // ---- Respons Umum ----
          currentPanel.webview.postMessage({
            type: 'response',
            text: `Asisten Joe v4.0 membaca proyek <b>${folderName}</b>.<br/>` +
              `Instruksi: <i>"${data.text}"</i>.<br/>` +
              `Gunakan tombol pintas di bawah atau ketik perintah spesifik.`
          });
        }
      });

      currentPanel.onDidDispose(
        () => { currentPanel = undefined; },
        null,
        context.subscriptions
      );
    }
  });

  // 3. Inisialisasi Blueprint
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

  // 4. Buat Ruang Kerja Fitur Baru
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

  // 5. Analisis Risiko (Command Palette)
  let disposableRisk = vscode.commands.registerCommand('saasWorkflow.analyzeRisk', function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;
    const targetDir = workspaceFolders[0].uri.fsPath;
    const folderName = path.basename(targetDir);
    const audit = inspectProject(targetDir);

    let total = 0;
    try {
      const raw = execSync('git diff --stat HEAD~1 HEAD 2>/dev/null || git diff --stat', { cwd: targetDir }).toString();
      const sum = raw.split('\n').filter(l => l.includes('changed')).pop() || '';
      const im = sum.match(/(\d+)\s+insertion/); const dm = sum.match(/(\d+)\s+deletion/);
      total = (im ? parseInt(im[1]) : 0) + (dm ? parseInt(dm[1]) : 0);
    } catch (e) {}

    let level = total < 50 ? 'RENDAH' : total < 200 ? 'SEDANG' : 'TINGGI';
    vscode.window.showInformationMessage(`Asisten Joe -- Analisis Risiko: [${level}] (${total} baris berubah)`);
    updateLogFile(targetDir, folderName, "ANALISIS RISIKO (MANUAL)", `Tingkat: ${level}`, audit);
  });

  // 6. Pembongkaran Ide (Command Palette)
  let disposableIdea = vscode.commands.registerCommand('saasWorkflow.breakdownIdea', async function () {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return;
    const targetDir = workspaceFolders[0].uri.fsPath;

    const idea = await vscode.window.showInputBox({ prompt: 'Jelaskan ide bisnis Anda secara singkat:' });
    if (!idea) return;

    const base = Math.floor(Date.now() / 100000) % 900 + 100;
    const tickets = [
      `TK-${base}: Perancangan & Analisis`,
      `TK-${base+1}: Pengembangan Modul Inti`,
      `TK-${base+2}: Tampilan Pengguna`,
      `TK-${base+3}: Pengujian & Validasi`,
      `TK-${base+4}: Peluncuran`,
    ];

    vscode.window.showInformationMessage(`Asisten Joe -- ${tickets.length} tiket tugas dibuat dari ide Anda.`);
  });

  context.subscriptions.push(disposableOpenTab, disposableInit, disposableFeature, disposableRisk, disposableIdea);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
