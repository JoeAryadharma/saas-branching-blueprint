const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const CodeReader = require('./codeReader');
const MemoryManager = require('./memoryManager');
const VibeGuard = require('./vibeGuard');

// ============================================================
// ASISTEN JOE v6.0 -- CHAT PROVIDER
// Pengawal & Auditor Kualitas Vibe Coding (vibeGuard.js)
// 5 Pilar AI Engine + 4 Modul Pengawal Vibe Coding
// ============================================================

class SaaSWorkflowChatProvider {
  constructor(extensionUri, aiEngine) {
    this._extensionUri = extensionUri;
    this._ai = aiEngine;
    this._memory = new MemoryManager();
    this._logHistory = [];
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage(async (data) => {
      if (data.type === 'userInput') {
        await this._handleUserInput(data.text);
      }
    });
  }

  // ============================================================
  // DISPATCHER UTAMA
  // ============================================================
  async _handleUserInput(text) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      this._reply("[PERINGATAN] Silakan buka folder proyek Anda terlebih dahulu di Antigravity IDE.");
      return;
    }

    const targetDir = workspaceFolders[0].uri.fsPath;
    const folderName = path.basename(targetDir);
    const lowerText = text.toLowerCase();

    this._memory.load(targetDir);
    const audit = this._inspectProject(targetDir);
    this._updateWidget(audit, targetDir);

    // -- MODUL BARU: Audit Vibe Coding --
    if (lowerText.includes('vibe') || lowerText.includes('audit vibe') || lowerText.includes('pengawal') || lowerText.includes('kunci bocor') || lowerText.includes('regresi')) {
      await this._handleVibeCodingAudit(targetDir, folderName, text, audit);
    }
    else if (lowerText.includes('bersihkan') || lowerText.includes('housekeeping') || lowerText.includes('hapus draf')) {
      await this._handleHousekeeping(targetDir, folderName, audit);
    }
    else if (lowerText.includes('inspeksi') || lowerText.includes('status') || lowerText.includes('proyek') || lowerText.includes('project')) {
      await this._handleInspection(targetDir, folderName, text, audit);
    }
    else if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur') || lowerText.includes('tambah fitur')) {
      await this._handleCreateFeature(targetDir, folderName, audit);
    }
    else if (lowerText.includes('risiko') || lowerText.includes('biaya') || lowerText.includes('dampak') || lowerText.includes('cost')) {
      await this._handleRiskAnalysis(targetDir, folderName, text, audit);
    }
    else if (lowerText.includes('rilis') || lowerText.includes('release') || lowerText.includes('pengumuman') || lowerText.includes('broadcast')) {
      await this._handleReleaseDraft(targetDir, folderName, text, audit);
    }
    else if (lowerText.includes('ide') || lowerText.includes('rencana') || lowerText.includes('roadmap') || lowerText.includes('pecah') || lowerText.includes('tiket')) {
      await this._handleIdeaBreakdown(targetDir, folderName, text, audit);
    }
    else if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan') || lowerText.includes('gabung') || lowerText.includes('merge')) {
      await this._handleSmartCodeReview(targetDir, folderName, audit);
    }
    else if (lowerText.includes('log') || lowerText.includes('laporan')) {
      this._handleOpenLog(targetDir);
    }
    else {
      await this._handleFreeQuestion(targetDir, folderName, text, audit);
    }

    this._memory.save(targetDir);
  }

  // ============================================================
  // MODUL BARU: AUDIT KUALITAS & KEAMANAN VIBE CODING (4 IN 1)
  // ============================================================
  async _handleVibeCodingAudit(targetDir, folderName, userText, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Menjalankan Audit Kualitas & Keamanan Vibe Coding...</small>`);

    const diff = CodeReader.getRecentDiff(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    const vibeResult = VibeGuard.auditAll(targetDir, diff, areas);

    let html = `<b>LAPORAN AUDIT PENGAWAL VIBE CODING</b><br/>` +
      `<small style="color:#94a3b8;">Proyek: ${folderName} | ${this._ai.modelName}</small><br/><br/>`;

    // 1. Audit Rahasia
    const secretColor = vibeResult.secretAudit.isSafe ? '#22c55e' : '#ef4444';
    const secretBadge = vibeResult.secretAudit.isSafe ? '[AMAN - 0 KUNCI BOCOR]' : `[BAHAYA - ${vibeResult.secretAudit.findings.length} KUNCI TERDETEKSI]`;

    html += `<div style="background:#1a2332;border:1px solid ${secretColor};border-radius:4px;padding:8px 10px;margin-bottom:6px;font-size:11.5px;">` +
      `<b style="color:${secretColor};">1. KEAMANAN KUNCI RAHASIA: ${secretBadge}</b><br/>`;

    if (!vibeResult.secretAudit.isSafe) {
      html += `<small style="color:#ef4444;">Ditemukan kunci rahasia/password yang tertulis langsung di berkas kode:</small><br/>`;
      vibeResult.secretAudit.findings.forEach(f => {
        html += `-- <b>${f.type}:</b> <code>${f.snippet}</code><br/>`;
      });
      html += `<small style="color:#f59e0b;">Tindakan WAJIB: Pindahkan nilai rahasia di atas ke berkas .env sebelum di-commit!</small><br/>`;
    } else {
      html += `<small style="color:#94a3b8;">Tidak ada API Key, Token, atau Password yang tertulis langsung di berkas kode baru.</small><br/>`;
    }
    html += `</div>`;

    // 2. Audit Regresi Fitur Lama
    const regColor = !vibeResult.regressionAudit.hasRisk ? '#22c55e' : '#f59e0b';
    const regBadge = !vibeResult.regressionAudit.hasRisk ? '[AMAN - 0 RISIKO REGRESI]' : `[PERHATIAN - ${vibeResult.regressionAudit.riskCount} MODUL INTI TERSENTUH]`;

    html += `<div style="background:#1a2332;border:1px solid ${regColor};border-radius:4px;padding:8px 10px;margin-bottom:6px;font-size:11.5px;">` +
      `<b style="color:${regColor};">2. KESTABILAN FITUR LAMA: ${regBadge}</b><br/>`;

    if (vibeResult.regressionAudit.hasRisk) {
      vibeResult.regressionAudit.risks.forEach(r => {
        html += `-- <code>${r.file}</code> (${r.area}): <small style="color:#94a3b8;">${r.impact}</small><br/>`;
      });
    } else {
      html += `<small style="color:#94a3b8;">Perubahan kode baru tidak menyentuh berkas inti bersama (auth, db, config).</small><br/>`;
    }
    html += `</div>`;

    // 3. Audit Kode Duplikat & Sampah
    const dupColor = !vibeResult.duplicateAudit.hasDuplicates ? '#22c55e' : '#f59e0b';
    const dupBadge = !vibeResult.duplicateAudit.hasDuplicates ? '[AMAN - KERAPIAN TERJAGA]' : `[TEMUAN - ${vibeResult.duplicateAudit.warnings.length} BERKAS/FUNGSI DRAF]`;

    html += `<div style="background:#1a2332;border:1px solid ${dupColor};border-radius:4px;padding:8px 10px;margin-bottom:6px;font-size:11.5px;">` +
      `<b style="color:${dupColor};">3. KERAPIAN & KODE DUPLIKAT: ${dupBadge}</b><br/>`;

    if (vibeResult.duplicateAudit.hasDuplicates) {
      vibeResult.duplicateAudit.warnings.forEach(w => {
        html += `-- <b>${w.type}:</b> <code>${w.item}</code><br/><small style="color:#94a3b8;">${w.advice}</small><br/>`;
      });
    } else {
      html += `<small style="color:#94a3b8;">Tidak ada berkas draf sementara atau nama fungsi duplikat yang tertinggal.</small><br/>`;
    }
    html += `</div>`;

    // 4. Analisis AI Tambahan jika tersedia
    if (this._ai.isAvailable) {
      const aiAdvice = await this._ai.ask(
        `Berikan ulasan pengawal kualasi Vibe Coding singkat untuk hasil prompt ini:\n\n${diff}`,
        CodeReader.buildFullContext(targetDir)
      );
      if (aiAdvice) {
        html += `<b>SARAN PERAPIAN AI:</b><br/>${this._formatAIResponse(aiAdvice)}<br/><br/>`;
      }
    }

    this._updateWidget(audit, targetDir, vibeResult);
    this._appendLog(targetDir, folderName, "AUDIT VIBE CODING", `Hasil: ${vibeResult.isFullyPassed ? 'LULUS AMAN' : 'DENGAN TEMUAN'}`, audit);
    this._reply(html);
  }

  // ============================================================
  // MODUL: ULASAN KODE CERDAS + INTEGRASI VIBE GUARD SEBELUM MERGE
  // ============================================================
  async _handleSmartCodeReview(targetDir, folderName, audit) {
    const currentBranch = audit.currentBranch;

    if (currentBranch === 'main' || currentBranch === 'develop') {
      this._reply(`[PERINGATAN] Anda di ruang <code>${currentBranch}</code>. Pengajuan hanya dari ruang fitur (feature/*).`);
      return;
    }

    this._reply(`<small style="color:#94a3b8;">[PROSES] Menjalankan Pengawal Vibe Coding & Ulasan AI pada <code>${currentBranch}</code>...</small>`);

    const diff = CodeReader.getRecentDiff(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);

    // 1. Jalankan Vibe Guard Audit terlebih dahulu
    const vibeResult = VibeGuard.auditAll(targetDir, diff, areas);

    // BLOKIR KERAS JIKA ADA KUNCI RAHASIA BOCOR!
    if (!vibeResult.secretAudit.isSafe) {
      let blockHtml = `<div style="background:rgba(239,68,68,0.15);border:1px solid #ef4444;border-radius:4px;padding:10px;margin:8px 0;font-size:11.5px;">` +
        `<b style="color:#ef4444;">[PENGGABUNGAN DIBLOKIR] KUNCI RAHASIA TERDETEKSI BOCOR</b><br/><br/>` +
        `Asisten Joe menghentikan penggabungan kode karena ditemukan kunci rahasia/API Key yang tertulis langsung di dalam berkas kode:<br/>`;

      vibeResult.secretAudit.findings.forEach(f => {
        blockHtml += `-- <b>${f.type}:</b> <code>${f.snippet}</code><br/>`;
      });

      blockHtml += `<br/><b>SOLUSI WAJIB:</b> Pindahkan kunci rahasia di atas ke berkas <code>.env</code> lalu coba jalankan <i>"Ajukan PR"</i> kembali.</div>`;

      this._reply(blockHtml);
      return;
    }

    // 2. Ulasan AI jika aman dari kunci bocor
    let reviewHtml = '';
    let hasIssues = false;

    if (this._ai.isAvailable && diff !== '[Tidak ada perubahan terdeteksi]') {
      const aiReview = await this._ai.ask(
        `Ulas perubahan kode berikut sebelum digabungkan ke cabang develop.\n\n` +
        `Identifikasi:\n1. Potensi kesalahan logika\n2. Fungsi tanpa penanganan error\n3. Kode duplikat/sampah\n\n` +
        `Jika tidak ada masalah, katakan "LULUS ULASAN".\n` +
        `Perubahan Kode:\n${diff}`,
        CodeReader.buildFullContext(targetDir)
      );

      if (aiReview) {
        hasIssues = !aiReview.toLowerCase().includes('lulus ulasan');
        reviewHtml = `<div style="background:#1a2332;border:1px solid ${hasIssues ? '#f59e0b' : '#22c55e'};border-radius:4px;padding:10px;margin:8px 0;font-size:11.5px;">` +
          `<b style="color:${hasIssues ? '#f59e0b' : '#22c55e'};">${hasIssues ? 'ULASAN: TEMUAN TERDETEKSI' : 'ULASAN: LULUS AUDIT'}</b><br/><br/>` +
          `${this._formatAIResponse(aiReview)}</div>`;
      }
    }

    // 3. Lakukan Merge aman
    try {
      execSync(`git add . && git commit -m "fitur: pembaruan terverifikasi Vibe Guard Asisten Joe" || true`, { cwd: targetDir });
      execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });

      this._memory.incrementStat('total_penggabungan');
      this._memory.addDecision(`Penggabungan ${currentBranch} ke develop`, `Vibe Guard: LULUS AMAN`);
      this._appendLog(targetDir, folderName, "PENGGABUNGAN + AUDIT VIBE GUARD", `${currentBranch} ke develop`, audit);

      const statusText = hasIssues ? '[BERHASIL DENGAN TEMUAN]' : '[BERHASIL]';
      this._reply(
        `<b>${statusText} Penggabungan Kode</b><br/>` +
        `<small style="color:#94a3b8;">${currentBranch} --> develop | Audit Vibe Guard: AMAN (0 Kunci Bocor)</small><br/>` +
        reviewHtml +
        `<br/>LOG_AKTIVITAS.md telah diperbarui.`
      );
    } catch (err) {
      this._memory.addPattern('kesalahan', `Gagal merge ${currentBranch}: ${err.message}`, 'merge');
      this._reply(`[GAGAL] Kendala penggabungan: ${err.message}`);
    }
  }

  // ============================================================
  // MODUL LAINNYA (Pertanyaan Bebas, Inspeksi, Fitur, Risiko, Rilis, Ide)
  // ============================================================
  async _handleFreeQuestion(targetDir, folderName, text, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Mengirim ke ${this._ai.modelName}...</small>`);
    const projectContext = CodeReader.buildFullContext(targetDir);
    const memoryContext = this._memory.getRelevantContext(3);
    const aiResponse = await this._ai.ask(text, projectContext + '\n\n' + memoryContext);

    if (aiResponse) {
      this._appendLog(targetDir, folderName, "KONSULTASI AI", text, audit);
      this._reply(`<b>Asisten Joe</b> <small style="color:#94a3b8;">(${this._ai.modelName})</small><br/><br/>${this._formatAIResponse(aiResponse)}`);
    } else {
      this._reply(`<b>Asisten Joe</b> <small style="color:#94a3b8;">(Mode Mandiri)</small><br/><br/>Instruksi: <i>"${text}"</i>.<br/>Gunakan tombol pintas di bawah.`);
    }
  }

  async _handleInspection(targetDir, folderName, userText, audit) {
    const techs = CodeReader.detectTechnologies(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    let html = `<b>LAPORAN INSPEKSI PROYEK</b><br/>` +
      `<small style="color:#94a3b8;">Intelegensi: ${this._ai.modelName}</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Nama Proyek</td><td style="padding:3px 6px;"><code>${folderName}</code></td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Ruang Kerja</td><td style="padding:3px 6px;"><code>${audit.currentBranch}</code></td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Teknologi</td><td style="padding:3px 6px;">${techs.join(', ')}</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Berkas Berubah</td><td style="padding:3px 6px;">${audit.changedFilesCount} berkas</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Tata Kelola</td><td style="padding:3px 6px;">${audit.hasBlueprint ? '[TERPASANG]' : '[BELUM]'}</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Tiket Aktif</td><td style="padding:3px 6px;">${audit.ticketCount}</td></tr>` +
      `</table><br/>`;

    if (this._ai.isAvailable) {
      const aiRec = await this._ai.ask('Berikan 2 rekomendasi singkat langkah kerja berikutnya.', CodeReader.buildFullContext(targetDir));
      if (aiRec) html += `<b>REKOMENDASI AI:</b><br/>${this._formatAIResponse(aiRec)}`;
    }
    this._appendLog(targetDir, folderName, "INSPEKSI PROYEK", userText, audit);
    this._reply(html);
  }

  async _handleHousekeeping(targetDir, folderName, audit) {
    const branches = audit.branchesPresent.filter(b => b.startsWith('feature/'));
    if (branches.length === 0) {
      this._reply("[INFORMASI] Penyimpanan proyek sudah bersih. Tidak ada draf ruang fitur lama.");
      return;
    }
    try {
      try { execSync('git checkout develop', { cwd: targetDir }); } catch(e) {}
      let cleaned = 0;
      branches.forEach(b => { try { execSync(`git branch -d ${b}`, { cwd: targetDir }); cleaned++; } catch (e) {} });
      this._memory.addPattern('keberhasilan', `Membersihkan ${cleaned} cabang draf`, 'housekeeping');
      this._appendLog(targetDir, folderName, "PEMBERSIHAN BRANCH", `${cleaned} cabang`, audit);
      this._reply(`[BERHASIL] ${cleaned} draf ruang kerja lama telah dibersihkan.`);
    } catch (err) {
      this._reply(`[GAGAL] Kendala pembersihan: ${err.message}`);
    }
  }

  async _handleCreateFeature(targetDir, folderName, audit) {
    const ticketId = await vscode.window.showInputBox({ prompt: 'Nomor Tiket Pekerjaan (Contoh: TK-201):' });
    if (!ticketId) return;
    const featureName = await vscode.window.showInputBox({ prompt: 'Nama Fitur Singkat (Bahasa Bisnis):' });
    if (!featureName) return;

    const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
    try {
      try { execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir }); }
      catch (e) { execSync(`git checkout -b ${branchName}`, { cwd: targetDir }); }
      this._memory.incrementStat('total_fitur_dibuat');
      this._memory.addDecision(`Membuat fitur baru: ${featureName} (${ticketId})`, branchName);
      this._appendLog(targetDir, folderName, "MEMBUAT FITUR BARU", `${branchName}`, audit);
      this._reply(`[BERHASIL] Ruang Kerja Fitur: <code>${branchName}</code><br/>Setelah selesai, ketik "Ajukan PR" untuk ulasan Vibe Guard.`);
    } catch (err) {
      this._reply(`[GAGAL] ${err.message}`);
    }
  }

  async _handleRiskAnalysis(targetDir, folderName, userText, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Menganalisis risiko dengan ${this._ai.modelName}...</small>`);
    const stats = CodeReader.getDiffStats(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    const diff = CodeReader.getRecentDiff(targetDir);

    const hasHighRisk = areas.database.length > 0 || areas.api.length > 0;
    const total = stats.totalLines;
    let riskLevel = hasHighRisk || total >= 200 ? 'TINGGI' : total >= 50 ? 'SEDANG' : 'RENDAH';
    let riskColor = riskLevel === 'TINGGI' ? '#ef4444' : riskLevel === 'SEDANG' ? '#f59e0b' : '#22c55e';

    let html = `<b>LAPORAN ANALISIS RISIKO & ESTIMASI BIAYA</b><br/>` +
      `<small style="color:#94a3b8;">Proyek: ${folderName} | ${this._ai.modelName}</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
      `<tr style="border-bottom:1px solid #334155;"><td style="padding:4px 6px;color:#94a3b8;">Berkas Berubah</td><td style="padding:4px 6px;font-weight:700;">${stats.filesChanged}</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;"><td style="padding:4px 6px;color:#94a3b8;">Tingkat Risiko</td><td style="padding:4px 6px;font-weight:700;color:${riskColor};">[${riskLevel}]</td></tr>` +
      `</table><br/>`;

    if (this._ai.isAvailable) {
      const aiResult = await this._ai.ask(`Analisis risiko dan estimasi biaya dari perubahan berikut:\n${diff}`, CodeReader.buildFullContext(targetDir));
      if (aiResult) html += `<b>ANALISIS AI:</b><br/>${this._formatAIResponse(aiResult)}`;
    }

    this._appendLog(targetDir, folderName, "ANALISIS RISIKO", `Tingkat: ${riskLevel}`, audit);
    this._reply(html);
  }

  async _handleReleaseDraft(targetDir, folderName, userText, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Menyusun draf rilis dengan ${this._ai.modelName}...</small>`);
    const commits = CodeReader.getRecentCommits(targetDir, 10);
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const commitList = commits.map(c => c.message).join('\n');

    let whatsappDraft = `Yth. Pelanggan ${folderName},\n\nPer tanggal ${now}, sistem telah diperbarui.\nSalam, Tim ${folderName}`;
    if (this._ai.isAvailable) {
      const aiWA = await this._ai.ask(`Susun draf pengumuman rilis WhatsApp singkat untuk pelanggan "${folderName}" (${now}) berdasarkan:\n${commitList}\nTanpa emoji.`);
      if (aiWA) whatsappDraft = aiWA;
    }

    const draftPath = path.join(targetDir, 'DRAF_PENGUMUMAN_RILIS.md');
    try { fs.writeFileSync(draftPath, `# DRAF RILIS (${now})\n\n${whatsappDraft}\n`, 'utf8'); } catch (e) {}

    const html = `<b>DRAF PENGUMUMAN RILIS</b><br/><small style="color:#94a3b8;">${now}</small><br/><br/>` +
      `<div style="background:#1a2332;border:1px solid #334155;border-radius:4px;padding:10px;font-size:11.5px;">` +
      `${this._formatAIResponse(whatsappDraft)}</div>`;

    this._appendLog(targetDir, folderName, "DRAF PENGUMUMAN RILIS", userText, audit);
    this._reply(html);
  }

  async _handleIdeaBreakdown(targetDir, folderName, userText, audit) {
    let ideaText = userText;
    if (userText.length < 15) {
      const input = await vscode.window.showInputBox({ prompt: 'Jelaskan ide bisnis Anda:' });
      if (!input) return;
      ideaText = input;
    }

    this._reply(`<small style="color:#94a3b8;">[PROSES] Memecah ide menjadi tiket dengan ${this._ai.modelName}...</small>`);
    const baseNum = Math.floor(Date.now() / 100000) % 900 + 100;
    let tickets = [
      { id: `TK-${baseNum}`, title: `Perancangan: ${ideaText.substring(0, 40)}`, desc: 'Menyusun kebutuhan awal', priority: 'UTAMA' },
      { id: `TK-${baseNum+1}`, title: 'Pengembangan Modul Inti', desc: 'Membangun logika utama', priority: 'UTAMA' },
      { id: `TK-${baseNum+2}`, title: 'Pembuatan Tampilan', desc: 'Mendesain antarmuka', priority: 'UTAMA' },
      { id: `TK-${baseNum+3}`, title: 'Pengujian & Validasi', desc: 'Memastikan fitur berjalan', priority: 'PENDUKUNG' }
    ];

    if (this._ai.isAvailable) {
      const aiResult = await this._ai.ask(
        `Pecah ide ini jadi 3-5 tiket spesifik: "${ideaText}". Format: TIKET|Judul|Deskripsi|UTAMA/PENDUKUNG`,
        CodeReader.buildFullContext(targetDir)
      );
      if (aiResult) {
        const parsed = [];
        aiResult.split('\n').filter(l => l.includes('TIKET|')).forEach((line, i) => {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 3) {
            parsed.push({ id: `TK-${baseNum + i}`, title: parts[1], desc: parts[2], priority: (parts[3] || 'UTAMA').toUpperCase() });
          }
        });
        if (parsed.length) tickets = parsed;
      }
    }

    let html = `<b>PETA JALAN & TIKET TUGAS</b><br/><small style="color:#94a3b8;">"${ideaText}"</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11px;">`;
    tickets.forEach(t => {
      html += `<tr style="border-bottom:1px solid #1e293b;"><td style="padding:4px 6px;"><code>${t.id}</code></td><td style="padding:4px 6px;">${t.title}</td></tr>`;
    });
    html += `</table>`;

    this._saveRoadmap(targetDir, folderName, ideaText, tickets);
    this._appendLog(targetDir, folderName, "PEMBONGKARAN IDE", `${tickets.length} tiket`, audit);
    this._reply(html);
  }

  _handleOpenLog(targetDir) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    if (fs.existsSync(logPath)) {
      vscode.commands.executeCommand('vscode.open', vscode.Uri.file(logPath));
      this._reply('[BERHASIL] LOG_AKTIVITAS.md dibuka di editor.');
    } else {
      this._reply('[INFORMASI] Belum ada log.');
    }
  }

  // ============================================================
  // UTILITAS & WIDGET UPDATER
  // ============================================================
  _inspectProject(targetDir) {
    let currentBranch = 'main', branchesPresent = ['main'], changedFilesCount = 0, hasBlueprint = false, ticketCount = 0;
    try {
      currentBranch = execSync('git branch --show-current', { cwd: targetDir }).toString().trim() || 'main';
      branchesPresent = execSync('git branch -a', { cwd: targetDir }).toString().split('\n').map(b => b.replace('*', '').trim()).filter(Boolean);
    } catch (e) {}
    try {
      const s = execSync('git status -s', { cwd: targetDir }).toString().trim();
      changedFilesCount = s ? s.split('\n').length : 0;
    } catch (e) {}
    hasBlueprint = fs.existsSync(path.join(targetDir, 'BRAND.md')) || fs.existsSync(path.join(targetDir, '.github/workflows'));
    try {
      const roadmap = fs.readFileSync(path.join(targetDir, 'PETA_JALAN.md'), 'utf8');
      const m = roadmap.match(/TK-\d+/g);
      ticketCount = m ? m.length : 0;
    } catch (e) {}
    return { currentBranch, branchesPresent, changedFilesCount, hasBlueprint, ticketCount };
  }

  _updateWidget(audit, targetDir, vibeResultOverride = null) {
    if (this._view) {
      let secretsStatus = 'AMAN';
      let regressionCount = 0;
      let duplicateCount = 0;

      if (vibeResultOverride) {
        secretsStatus = vibeResultOverride.secretAudit.isSafe ? 'AMAN' : 'BAHAYA';
        regressionCount = vibeResultOverride.regressionAudit.riskCount;
        duplicateCount = vibeResultOverride.duplicateAudit.warnings.length;
      } else if (targetDir) {
        try {
          const diff = CodeReader.getRecentDiff(targetDir);
          const areas = CodeReader.classifyChanges(targetDir);
          const vRes = VibeGuard.auditAll(targetDir, diff, areas);
          secretsStatus = vRes.secretAudit.isSafe ? 'AMAN' : 'BAHAYA';
          regressionCount = vRes.regressionAudit.riskCount;
          duplicateCount = vRes.duplicateAudit.warnings.length;
        } catch (e) {}
      }

      this._view.webview.postMessage({
        type: 'updateWidget',
        branch: audit.currentBranch,
        secrets: secretsStatus,
        regression: regressionCount,
        duplicates: duplicateCount
      });
    }
  }

  _saveRoadmap(targetDir, folderName, ideaText, tickets) {
    const roadmapPath = path.join(targetDir, 'PETA_JALAN.md');
    let existing = '';
    try { existing = fs.readFileSync(roadmapPath, 'utf8'); } catch (e) {}
    const now = new Date().toLocaleString('id-ID');
    const header = existing ? '' : `# PETA JALAN PROYEK: ${folderName}\n\nDokumen ini berisi rencana kerja Vibe Coding oleh Asisten Joe.\n`;
    const entry = `\n---\n\n## Rencana: ${ideaText.substring(0, 60)}\n\n**Dibuat:** ${now}\n\n` +
      `| Tiket | Judul | Deskripsi | Prioritas |\n| :--- | :--- | :--- | :--- |\n` +
      tickets.map(t => `| ${t.id} | ${t.title} | ${t.desc} | ${t.priority} |`).join('\n') + '\n';
    try { fs.writeFileSync(roadmapPath, header + existing + entry, 'utf8'); } catch (e) {}
  }

  _formatAIResponse(text) {
    if (!text) return '';
    return text
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  _appendLog(targetDir, folderName, actionName, userInstruction, audit) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    const now = new Date().toLocaleString('id-ID');
    this._logHistory.push({ time: now, action: actionName, desc: userInstruction, branch: audit.currentBranch, status: 'BERHASIL' });
    const crudRows = this._logHistory.map(e => `| ${e.time} | ${e.action} | ${e.desc} | ${e.branch} | ${e.status} |`).join('\n');
    const mNodes = this._logHistory.map((e, i) => {
      const id = `N${i}`, nxt = i < this._logHistory.length - 1 ? `N${i+1}` : null;
      return `    ${id}["${e.action}"]` + (nxt ? `\n    ${id} --> ${nxt}` : '');
    }).join('\n');
    const content = `# LAPORAN REKAP AKTIVITAS & REKAM KERJA PROYEK\n\n` +
      `- **Nama Proyek:** ${folderName}\n- **Pembaruan Terakhir:** ${now}\n- **Ruang Kerja:** ${audit.currentBranch}\n` +
      `- **Tata Kelola:** ${audit.hasBlueprint ? 'Terpasang' : 'Belum'}\n- **Intelegensi AI:** ${this._ai.modelName}\n\n---\n\n` +
      `## 1. TABEL REKAP OPERASI (CRUD)\n\n| Waktu | Aktivitas | Deskripsi | Ruang | Status |\n| :--- | :--- | :--- | :--- | :--- |\n${crudRows}\n\n---\n\n` +
      `## 2. DIAGRAM ALUR PEKERJAAN SESI\n\n\`\`\`mermaid\nflowchart TD\n    START["Awal Sesi"] --> ${this._logHistory.length ? 'N0' : 'END'}\n${mNodes}\n` +
      `    ${this._logHistory.length ? `N${this._logHistory.length-1}` : 'START'} --> END["Terkini: ${audit.currentBranch}"]\n\`\`\`\n\n---\n\n` +
      `*Disusun otomatis oleh Asisten Joe v6.0 Vibe Guard*\n`;
    try { fs.writeFileSync(logPath, content, 'utf8'); } catch (e) {}
  }

  _reply(htmlText) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'response', text: htmlText });
    }
  }

  _getHtmlForWebview(webview) {
    return fs.readFileSync(path.join(this._extensionUri.fsPath, 'chat-view.html'), 'utf8');
  }
}

module.exports = SaaSWorkflowChatProvider;
