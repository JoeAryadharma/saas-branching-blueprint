const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const CodeReader = require('./codeReader');
const MemoryManager = require('./memoryManager');

// ============================================================
// ASISTEN JOE v5.0 -- CHAT PROVIDER
// Bertenaga AI sesungguhnya via vscode.lm API
// 5 Pilar Kecerdasan: AI Engine, Code Awareness,
// Contextual Tickets, Persistent Memory, Smart Code Review
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
  // DISPATCHER CERDAS
  // Mengarahkan ke modul spesifik atau langsung ke AI
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

    // Muat memori proyek
    this._memory.load(targetDir);

    // Inspeksi proyek
    const audit = this._inspectProject(targetDir);
    this._updateWidget(audit);

    // -- Routing ke modul spesifik --
    if (lowerText.includes('bersihkan') || lowerText.includes('housekeeping') || lowerText.includes('hapus draf')) {
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
      // KECERDASAN UTAMA: Pertanyaan bebas dikirim ke AI
      await this._handleFreeQuestion(targetDir, folderName, text, audit);
    }

    // Simpan memori setelah setiap interaksi
    this._memory.save(targetDir);
  }

  // ============================================================
  // KECERDASAN UTAMA: Pertanyaan Bebas ke AI
  // ============================================================
  async _handleFreeQuestion(targetDir, folderName, text, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Mengirim ke ${this._ai.modelName}...</small>`);

    const projectContext = CodeReader.buildFullContext(targetDir);
    const memoryContext = this._memory.getRelevantContext(3);
    const fullContext = projectContext + '\n\n' + memoryContext;

    const aiResponse = await this._ai.ask(text, fullContext);

    if (aiResponse) {
      const formatted = this._formatAIResponse(aiResponse);
      this._appendLog(targetDir, folderName, "KONSULTASI AI", text, audit);
      this._reply(
        `<b>Asisten Joe</b> <small style="color:#94a3b8;">(${this._ai.modelName})</small><br/><br/>` +
        formatted
      );
    } else {
      // Fallback tanpa AI
      this._reply(
        `<b>Asisten Joe</b> <small style="color:#94a3b8;">(Mode Mandiri)</small><br/><br/>` +
        `Instruksi diterima: <i>"${text}"</i><br/>` +
        `Proyek: <b>${folderName}</b> | Ruang: <code>${audit.currentBranch}</code><br/><br/>` +
        `[INFORMASI] Model AI tidak tersedia. Gunakan tombol pintas di bawah untuk fitur yang tersedia tanpa AI.`
      );
    }
  }

  // ============================================================
  // MODUL: Inspeksi Proyek (Diperkaya AI + Code Awareness)
  // ============================================================
  async _handleInspection(targetDir, folderName, userText, audit) {
    const techs = CodeReader.detectTechnologies(targetDir);
    const structure = CodeReader.getProjectStructure(targetDir);
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
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Riwayat Sesi</td><td style="padding:3px 6px;">${this._memory.stats.total_fitur_dibuat} fitur, ${this._memory.stats.total_penggabungan} merge</td></tr>` +
      `</table><br/>`;

    // Area perubahan
    const activeAreas = Object.entries(areas).filter(([, files]) => files.length > 0);
    if (activeAreas.length > 0) {
      html += `<b>AREA PERUBAHAN:</b><br/>`;
      activeAreas.forEach(([area, files]) => {
        html += `-- ${area}: ${files.length} berkas (${files.join(', ')})<br/>`;
      });
      html += `<br/>`;
    }

    // Minta AI untuk rekomendasi jika tersedia
    if (this._ai.isAvailable) {
      const projectContext = CodeReader.buildFullContext(targetDir);
      const aiRec = await this._ai.ask(
        'Berikan 2-3 rekomendasi singkat langkah kerja berikutnya berdasarkan kondisi proyek ini. Maksimal 3 kalimat per rekomendasi.',
        projectContext
      );
      if (aiRec) {
        html += `<b>REKOMENDASI AI:</b><br/>${this._formatAIResponse(aiRec)}`;
      }
    }

    this._appendLog(targetDir, folderName, "INSPEKSI PROYEK", userText, audit);
    this._reply(html);
  }

  // ============================================================
  // MODUL: Bersihkan Branch
  // ============================================================
  async _handleHousekeeping(targetDir, folderName, audit) {
    const branches = audit.branchesPresent.filter(b => b.startsWith('feature/'));
    if (branches.length === 0) {
      this._reply("[INFORMASI] Penyimpanan proyek sudah bersih. Tidak ada draf ruang fitur lama.");
      return;
    }
    try {
      try { execSync('git checkout develop', { cwd: targetDir }); } catch(e) {}
      let cleaned = 0;
      branches.forEach(b => {
        try { execSync(`git branch -d ${b}`, { cwd: targetDir }); cleaned++; } catch (e) {}
      });
      this._memory.addPattern('keberhasilan', `Membersihkan ${cleaned} cabang draf`, 'housekeeping');
      this._appendLog(targetDir, folderName, "PEMBERSIHAN BRANCH", `${cleaned} cabang`, audit);
      this._reply(`[BERHASIL] ${cleaned} draf ruang kerja lama telah dibersihkan.`);
    } catch (err) {
      this._reply(`[GAGAL] Kendala pembersihan: ${err.message}`);
    }
  }

  // ============================================================
  // MODUL: Buat Fitur Baru
  // ============================================================
  async _handleCreateFeature(targetDir, folderName, audit) {
    const ticketId = await vscode.window.showInputBox({ prompt: 'Nomor Tiket Pekerjaan (Contoh: TK-201):' });
    if (!ticketId) return;
    const featureName = await vscode.window.showInputBox({ prompt: 'Nama Fitur Singkat (Bahasa Bisnis):' });
    if (!featureName) return;

    const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;
    try {
      try {
        execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
      } catch (e) {
        execSync(`git checkout -b ${branchName}`, { cwd: targetDir });
      }
      this._memory.incrementStat('total_fitur_dibuat');
      this._memory.addDecision(`Membuat fitur baru: ${featureName} (${ticketId})`, branchName);
      this._appendLog(targetDir, folderName, "MEMBUAT FITUR BARU", `${branchName}`, audit);
      this._reply(`[BERHASIL] Ruang Kerja Fitur: <code>${branchName}</code><br/>Setelah selesai, ketik "Ajukan PR" untuk ulasan kode cerdas.`);
    } catch (err) {
      this._reply(`[GAGAL] ${err.message}`);
    }
  }

  // ============================================================
  // PILAR 1+2: ANALISIS RISIKO KONTEKSTUAL (AI + Code Awareness)
  // ============================================================
  async _handleRiskAnalysis(targetDir, folderName, userText, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Menganalisis risiko dengan ${this._ai.modelName}...</small>`);

    const stats = CodeReader.getDiffStats(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);
    const diff = CodeReader.getRecentDiff(targetDir);

    // Ringkasan area untuk tampilan
    const activeAreas = Object.entries(areas).filter(([, files]) => files.length > 0);
    let areasHtml = '';
    activeAreas.forEach(([area, files]) => {
      let color = '#94a3b8';
      if (area === 'database' || area === 'api') color = '#ef4444';
      else if (area === 'tampilan') color = '#22c55e';
      else if (area === 'konfigurasi') color = '#f59e0b';
      areasHtml += `<tr><td style="padding:3px 6px;color:${color};font-weight:600;">${area.toUpperCase()}</td>` +
        `<td style="padding:3px 6px;">${files.length} berkas</td>` +
        `<td style="padding:3px 6px;font-size:10.5px;color:#94a3b8;">${files.join(', ')}</td></tr>`;
    });

    // Minta AI untuk analisis mendalam
    let aiAnalysis = '';
    if (this._ai.isAvailable) {
      const memoryContext = this._memory.getRelevantContext(3);
      const aiResult = await this._ai.analyzeStructured(
        'Analisis risiko dan estimasi dampak biaya dari perubahan kode berikut.',
        `Statistik: ${stats.filesChanged} berkas, +${stats.insertions}/-${stats.deletions} baris.\n` +
        `Area tersentuh: ${activeAreas.map(([a, f]) => `${a} (${f.length})`).join(', ')}.\n\n` +
        `Isi Perubahan:\n${diff}\n\n${memoryContext}`,
        'Berikan: (1) Tingkat risiko (RENDAH/SEDANG/TINGGI) dengan alasan, (2) Estimasi waktu pengerjaan, (3) Rekomendasi mitigasi 2-3 poin.'
      );
      if (aiResult) {
        aiAnalysis = `<br/><b>ANALISIS CERDAS AI:</b><br/>${this._formatAIResponse(aiResult)}`;
      }
    }

    // Fallback klasifikasi risiko
    const total = stats.totalLines;
    const hasHighRiskArea = areas.database.length > 0 || areas.api.length > 0;
    let riskLevel, riskColor;
    if (hasHighRiskArea || total >= 200) { riskLevel = 'TINGGI'; riskColor = '#ef4444'; }
    else if (total >= 50) { riskLevel = 'SEDANG'; riskColor = '#f59e0b'; }
    else { riskLevel = 'RENDAH'; riskColor = '#22c55e'; }

    const html = `<b>LAPORAN ANALISIS RISIKO & ESTIMASI BIAYA</b><br/>` +
      `<small style="color:#94a3b8;">Proyek: ${folderName} | ${this._ai.modelName}</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
      `<tr style="border-bottom:1px solid #334155;"><td style="padding:4px 6px;color:#94a3b8;">Berkas Berubah</td><td style="padding:4px 6px;font-weight:700;">${stats.filesChanged}</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;"><td style="padding:4px 6px;color:#94a3b8;">Baris +/-</td><td style="padding:4px 6px;"><span style="color:#22c55e;">+${stats.insertions}</span> / <span style="color:#ef4444;">-${stats.deletions}</span></td></tr>` +
      `<tr style="border-bottom:1px solid #334155;"><td style="padding:4px 6px;color:#94a3b8;">Tingkat Risiko</td><td style="padding:4px 6px;font-weight:700;color:${riskColor};">[${riskLevel}]</td></tr>` +
      `</table><br/>` +
      (areasHtml ? `<b>PETA AREA PERUBAHAN:</b><br/><table style="width:100%;border-collapse:collapse;font-size:11px;">${areasHtml}</table><br/>` : '') +
      aiAnalysis;

    this._memory.incrementStat('total_analisis_risiko');
    this._memory.addDecision(`Analisis risiko: ${riskLevel} (${total} baris, ${stats.filesChanged} berkas)`, audit.currentBranch);
    this._appendLog(targetDir, folderName, "ANALISIS RISIKO (AI)", `Tingkat: ${riskLevel}`, audit);
    this._reply(html);
  }

  // ============================================================
  // PILAR 2: DRAF PENGUMUMAN RILIS (AI-Powered)
  // ============================================================
  async _handleReleaseDraft(targetDir, folderName, userText, audit) {
    this._reply(`<small style="color:#94a3b8;">[PROSES] Menyusun draf rilis dengan ${this._ai.modelName}...</small>`);

    const commits = CodeReader.getRecentCommits(targetDir, 10);
    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const commitList = commits.map(c => c.message).join('\n');

    let whatsappDraft = '';
    let salesDraft = '';

    if (this._ai.isAvailable) {
      const aiWA = await this._ai.ask(
        `Susun draf pesan WhatsApp/Email pengumuman rilis untuk pelanggan produk "${folderName}" tanggal ${now}. ` +
        `Berdasarkan daftar perubahan berikut:\n${commitList}\n\n` +
        `Buat pesan yang ramah, profesional, ringkas, dan mudah dipahami orang awam. Jangan gunakan emoji. Maksimal 150 kata.`
      );
      if (aiWA) whatsappDraft = aiWA;

      const aiSales = await this._ai.ask(
        `Susun ringkasan penjualan (pamflet fitur) untuk tim penjualan produk "${folderName}". ` +
        `Berdasarkan perubahan:\n${commitList}\n\n` +
        `Format: poin-poin keunggulan yang bisa langsung disampaikan ke calon pelanggan. Maksimal 100 kata. Tanpa emoji.`
      );
      if (aiSales) salesDraft = aiSales;
    }

    // Fallback jika AI tidak tersedia
    if (!whatsappDraft) {
      const changes = commits.slice(0, 5).map(c => c.message);
      whatsappDraft = `Yth. Pelanggan ${folderName},\n\nPer tanggal ${now}, sistem telah diperbarui:\n` +
        changes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
        `\n\nTerima kasih atas kepercayaan Anda.\nSalam, Tim ${folderName}`;
    }
    if (!salesDraft) {
      salesDraft = commits.slice(0, 5).map(c => `-- ${c.message}`).join('\n');
    }

    // Simpan ke berkas
    const draftPath = path.join(targetDir, 'DRAF_PENGUMUMAN_RILIS.md');
    const draftContent = `# DRAF PENGUMUMAN RILIS\n\n- **Proyek:** ${folderName}\n- **Tanggal:** ${now}\n\n---\n\n## Pesan WhatsApp / Email\n\n${whatsappDraft}\n\n---\n\n## Ringkasan Penjualan\n\n${salesDraft}\n`;
    try { fs.writeFileSync(draftPath, draftContent, 'utf8'); } catch (e) {}

    const html = `<b>DRAF PENGUMUMAN RILIS</b><br/>` +
      `<small style="color:#94a3b8;">${this._ai.modelName} | ${now}</small><br/><br/>` +
      `<div style="background:#1a2332;border:1px solid #334155;border-radius:4px;padding:10px;margin:6px 0;font-size:11.5px;">` +
      `<b style="color:#eab308;">PESAN WHATSAPP / EMAIL</b><br/><br/>${this._formatAIResponse(whatsappDraft)}</div>` +
      `<div style="background:#1a2332;border:1px solid #334155;border-radius:4px;padding:10px;margin:6px 0;font-size:11.5px;">` +
      `<b style="color:#3b82f6;">RINGKASAN PENJUALAN</b><br/><br/>${this._formatAIResponse(salesDraft)}</div>` +
      `<small style="color:#94a3b8;">Disimpan ke: DRAF_PENGUMUMAN_RILIS.md</small>`;

    this._memory.incrementStat('total_rilis');
    this._appendLog(targetDir, folderName, "DRAF PENGUMUMAN RILIS (AI)", userText, audit);
    this._reply(html);
  }

  // ============================================================
  // PILAR 3: PEMBONGKARAN IDE KONTEKSTUAL (AI-Powered)
  // ============================================================
  async _handleIdeaBreakdown(targetDir, folderName, userText, audit) {
    let ideaText = userText;
    if (userText.length < 15) {
      const input = await vscode.window.showInputBox({
        prompt: 'Jelaskan ide bisnis Anda secara singkat:',
        placeHolder: 'Contoh: Bikin program promo diskon 17% Kemerdekaan'
      });
      if (!input) return;
      ideaText = input;
    }

    this._reply(`<small style="color:#94a3b8;">[PROSES] Memecah ide menjadi tiket dengan ${this._ai.modelName}...</small>`);

    let tickets = [];

    if (this._ai.isAvailable) {
      const projectContext = CodeReader.buildFullContext(targetDir);
      const aiResult = await this._ai.ask(
        `Pecah ide bisnis berikut menjadi 3-6 tiket tugas kerja yang spesifik dan dapat ditindaklanjuti.\n\n` +
        `IDE: "${ideaText}"\n\n` +
        `Format setiap tiket PERSIS seperti ini (satu tiket per baris):\n` +
        `TIKET|Judul Singkat|Deskripsi satu kalimat|UTAMA atau PENDUKUNG\n\n` +
        `Berikan tiket yang spesifik sesuai konteks proyek, BUKAN tiket generik.`,
        projectContext
      );

      if (aiResult) {
        // Parse respons AI menjadi tiket terstruktur
        const lines = aiResult.split('\n').filter(l => l.includes('TIKET|') || l.includes('tiket|'));
        const baseNum = Math.floor(Date.now() / 100000) % 900 + 100;

        lines.forEach((line, i) => {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 3) {
            tickets.push({
              id: `TK-${baseNum + i}`,
              title: parts[1] || `Tugas ${i + 1}`,
              desc: parts[2] || '',
              priority: (parts[3] || 'UTAMA').toUpperCase().includes('PENDUKUNG') ? 'PENDUKUNG' : 'UTAMA'
            });
          }
        });
      }
    }

    // Fallback jika AI tidak menghasilkan tiket yang bisa diparsing
    if (tickets.length === 0) {
      const baseNum = Math.floor(Date.now() / 100000) % 900 + 100;
      tickets = [
        { id: `TK-${baseNum}`, title: `Perancangan: ${ideaText.substring(0, 40)}`, desc: 'Menyusun kebutuhan dan desain awal', priority: 'UTAMA' },
        { id: `TK-${baseNum+1}`, title: 'Pengembangan Modul Inti', desc: 'Membangun logika utama', priority: 'UTAMA' },
        { id: `TK-${baseNum+2}`, title: 'Pembuatan Tampilan', desc: 'Mendesain antarmuka pengguna', priority: 'UTAMA' },
        { id: `TK-${baseNum+3}`, title: 'Pengujian & Validasi', desc: 'Memastikan fitur berjalan', priority: 'PENDUKUNG' },
        { id: `TK-${baseNum+4}`, title: 'Peluncuran', desc: 'Menerbitkan ke sistem utama', priority: 'PENDUKUNG' },
      ];
    }

    // Tampilkan
    let html = `<b>PETA JALAN & TIKET TUGAS</b><br/>` +
      `<small style="color:#94a3b8;">"${ideaText}" | ${this._ai.modelName}</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11px;">` +
      `<tr style="border-bottom:1px solid #475569;">` +
      `<th style="padding:4px 6px;text-align:left;color:#eab308;">Tiket</th>` +
      `<th style="padding:4px 6px;text-align:left;color:#eab308;">Judul</th>` +
      `<th style="padding:4px 6px;text-align:left;color:#eab308;">Prioritas</th></tr>`;

    tickets.forEach(t => {
      const pColor = t.priority === 'UTAMA' ? '#f59e0b' : '#94a3b8';
      html += `<tr style="border-bottom:1px solid #1e293b;">` +
        `<td style="padding:4px 6px;"><code>${t.id}</code></td>` +
        `<td style="padding:4px 6px;">${t.title}<br/><small style="color:#94a3b8;">${t.desc}</small></td>` +
        `<td style="padding:4px 6px;color:${pColor};font-weight:600;">[${t.priority}]</td></tr>`;
    });
    html += `</table><br/><small style="color:#94a3b8;">Disimpan ke: PETA_JALAN.md</small>`;

    // Simpan ke PETA_JALAN.md
    this._saveRoadmap(targetDir, folderName, ideaText, tickets);

    this._memory.incrementStat('total_tiket_dibuat');
    this._memory.addDecision(`Memecah ide: "${ideaText.substring(0, 50)}" menjadi ${tickets.length} tiket`, audit.currentBranch);
    this._appendLog(targetDir, folderName, "PEMBONGKARAN IDE (AI)", `${tickets.length} tiket`, audit);
    this._updateWidget({ ...audit, ticketCount: (audit.ticketCount || 0) + tickets.length });
    this._reply(html);
  }

  // ============================================================
  // PILAR 5: ULASAN KODE CERDAS SEBELUM MERGE
  // ============================================================
  async _handleSmartCodeReview(targetDir, folderName, audit) {
    const currentBranch = audit.currentBranch;

    if (currentBranch === 'main' || currentBranch === 'develop') {
      this._reply(`[PERINGATAN] Anda di ruang <code>${currentBranch}</code>. Pengajuan hanya dari ruang fitur (feature/*).`);
      return;
    }

    this._reply(`<small style="color:#94a3b8;">[PROSES] Mengulas kode di <code>${currentBranch}</code> dengan ${this._ai.modelName}...</small>`);

    // Baca diff untuk ulasan
    const diff = CodeReader.getRecentDiff(targetDir);
    const stats = CodeReader.getDiffStats(targetDir);
    const areas = CodeReader.classifyChanges(targetDir);

    let reviewHtml = '';
    let hasIssues = false;

    if (this._ai.isAvailable && diff !== '[Tidak ada perubahan terdeteksi]') {
      const aiReview = await this._ai.ask(
        `Ulas perubahan kode berikut sebelum digabungkan ke cabang develop.\n\n` +
        `Identifikasi:\n` +
        `1. Potensi kesalahan logika\n` +
        `2. Fungsi tanpa penanganan error\n` +
        `3. Kerentanan keamanan sederhana\n` +
        `4. Kode yang bisa dioptimalkan\n\n` +
        `Jika tidak ada masalah, katakan "LULUS ULASAN".\n` +
        `Jika ada masalah, awali dengan "DITEMUKAN TEMUAN:" lalu jelaskan.\n\n` +
        `Perubahan Kode:\n${diff}`,
        CodeReader.buildFullContext(targetDir)
      );

      if (aiReview) {
        hasIssues = !aiReview.toLowerCase().includes('lulus ulasan');
        reviewHtml = `<div style="background:#1a2332;border:1px solid ${hasIssues ? '#f59e0b' : '#22c55e'};border-radius:4px;padding:10px;margin:8px 0;font-size:11.5px;">` +
          `<b style="color:${hasIssues ? '#f59e0b' : '#22c55e'};">${hasIssues ? 'ULASAN: TEMUAN TERDETEKSI' : 'ULASAN: LULUS'}</b><br/><br/>` +
          `${this._formatAIResponse(aiReview)}</div>`;
      }
    }

    // Lakukan merge
    try {
      execSync(`git add . && git commit -m "fitur: pembaruan terverifikasi oleh Asisten Joe AI" || true`, { cwd: targetDir });
      execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });

      this._memory.incrementStat('total_penggabungan');
      this._memory.addDecision(`Penggabungan ${currentBranch} ke develop`, `Ulasan AI: ${hasIssues ? 'Ada temuan' : 'Lulus'}`);
      this._appendLog(targetDir, folderName, "PENGGABUNGAN + ULASAN AI", `${currentBranch} ke develop`, audit);

      const statusText = hasIssues ? '[BERHASIL DENGAN CATATAN]' : '[BERHASIL]';
      this._reply(
        `<b>${statusText} Penggabungan Kode</b><br/>` +
        `<small style="color:#94a3b8;">${currentBranch} --> develop | ${stats.filesChanged} berkas, +${stats.insertions}/-${stats.deletions} baris</small><br/>` +
        reviewHtml +
        `<br/>LOG_AKTIVITAS.md telah diperbarui.`
      );
    } catch (err) {
      this._memory.addPattern('kesalahan', `Gagal merge ${currentBranch}: ${err.message}`, 'merge');
      this._reply(`[GAGAL] Kendala penggabungan: ${err.message}`);
    }
  }

  // ============================================================
  // MODUL: Buka Log
  // ============================================================
  _handleOpenLog(targetDir) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    if (fs.existsSync(logPath)) {
      vscode.commands.executeCommand('vscode.open', vscode.Uri.file(logPath));
      this._reply('[BERHASIL] LOG_AKTIVITAS.md dibuka di editor.');
    } else {
      this._reply('[INFORMASI] Belum ada log. Lakukan inspeksi proyek untuk memulai pencatatan.');
    }
  }

  // ============================================================
  // UTILITAS
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

  _updateWidget(audit) {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateWidget',
        branch: audit.currentBranch,
        tickets: audit.ticketCount || 0,
        health: audit.hasBlueprint ? '100% OK' : 'Perlu Setup',
      });
    }
  }

  _saveRoadmap(targetDir, folderName, ideaText, tickets) {
    const roadmapPath = path.join(targetDir, 'PETA_JALAN.md');
    let existing = '';
    try { existing = fs.readFileSync(roadmapPath, 'utf8'); } catch (e) {}
    const now = new Date().toLocaleString('id-ID');
    const header = existing ? '' : `# PETA JALAN PROYEK: ${folderName}\n\nDokumen ini berisi rencana kerja yang dibongkar dari ide bisnis oleh Asisten Joe.\n`;
    const mermaid = tickets.map((t, i) => {
      const id = String.fromCharCode(65 + i);
      const next = i < tickets.length - 1 ? String.fromCharCode(66 + i) : null;
      return `    ${id}["${t.id}: ${t.title.substring(0, 35)}"]` + (next ? `\n    ${id} --> ${next}` : '');
    }).join('\n');
    const entry = `\n---\n\n## Rencana: ${ideaText.substring(0, 60)}\n\n**Dibuat:** ${now}\n\n` +
      `| Tiket | Judul | Deskripsi | Prioritas |\n| :--- | :--- | :--- | :--- |\n` +
      tickets.map(t => `| ${t.id} | ${t.title} | ${t.desc} | ${t.priority} |`).join('\n') +
      `\n\n### Diagram Alur\n\n\`\`\`mermaid\nflowchart TD\n${mermaid}\n\`\`\`\n`;
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
      `- **Tata Kelola:** ${audit.hasBlueprint ? 'Terpasang' : 'Belum'}\n- **Intelegensi AI:** ${this._ai.modelName}\n` +
      `- **Tiket:** ${audit.ticketCount || 0}\n\n---\n\n## 1. TABEL REKAP OPERASI (CRUD)\n\n` +
      `| Waktu | Aktivitas | Deskripsi | Ruang | Status |\n| :--- | :--- | :--- | :--- | :--- |\n${crudRows}\n\n---\n\n` +
      `## 2. DIAGRAM ALUR PEKERJAAN SESI\n\n\`\`\`mermaid\nflowchart TD\n    START["Awal Sesi"] --> ${this._logHistory.length ? 'N0' : 'END'}\n${mNodes}\n` +
      `    ${this._logHistory.length ? `N${this._logHistory.length-1}` : 'START'} --> END["Terkini: ${audit.currentBranch}"]\n\`\`\`\n\n---\n\n` +
      `*Disusun otomatis oleh Asisten Joe v5.0*\n`;
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
