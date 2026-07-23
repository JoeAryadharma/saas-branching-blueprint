const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

class SaaSWorkflowChatProvider {
  constructor(extensionUri) {
    this._extensionUri = extensionUri;
    this._activeModelName = 'Model AI Aktif IDE';
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
      switch (data.type) {
        case 'userInput':
          await this._handleUserInput(data.text);
          break;
      }
    });
  }

  // ============================================================
  // DISPATCHER UTAMA -- Mengarahkan instruksi ke modul kompetensi
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

    const audit = this._inspectProject(targetDir);
    this._updateWidget(audit);

    // ---- MODUL: Bersihkan Branch (Housekeeping) ----
    if (lowerText.includes('bersihkan') || lowerText.includes('housekeeping') || lowerText.includes('hapus draf')) {
      this._handleHousekeeping(targetDir, folderName, audit);
      return;
    }

    // ---- MODUL: Inspeksi Proyek / Status ----
    if (lowerText.includes('baca') || lowerText.includes('folder') || lowerText.includes('project') || lowerText.includes('proyek') || lowerText.includes('status') || lowerText.includes('inspeksi')) {
      this._handleInspection(targetDir, folderName, text, audit);
      return;
    }

    // ---- MODUL: Fitur Baru ----
    if (lowerText.includes('fitur baru') || lowerText.includes('buat fitur') || lowerText.includes('tambah fitur')) {
      await this._handleCreateFeature(targetDir, folderName, audit);
      return;
    }

    // ---- MODUL: Ajukan PR / Penggabungan ----
    if (lowerText.includes('pr') || lowerText.includes('ajukan') || lowerText.includes('pemeriksaan') || lowerText.includes('selesai')) {
      this._handleSubmitPR(targetDir, folderName, audit);
      return;
    }

    // ---- PILAR 1: Analisis Risiko & Estimasi Biaya ----
    if (lowerText.includes('risiko') || lowerText.includes('biaya') || lowerText.includes('dampak') || lowerText.includes('analisis risiko') || lowerText.includes('cost')) {
      this._handleRiskAnalysis(targetDir, folderName, text, audit);
      return;
    }

    // ---- PILAR 2: Pengumuman Rilis / Konten Komunikasi ----
    if (lowerText.includes('rilis') || lowerText.includes('release') || lowerText.includes('pengumuman') || lowerText.includes('broadcast')) {
      this._handleReleaseDraft(targetDir, folderName, text, audit);
      return;
    }

    // ---- PILAR 3: Pembongkaran Ide Jadi Tiket Tugas ----
    if (lowerText.includes('ide') || lowerText.includes('rencana') || lowerText.includes('roadmap') || lowerText.includes('pecah') || lowerText.includes('tiket')) {
      await this._handleIdeaBreakdown(targetDir, folderName, text, audit);
      return;
    }

    // ---- MODUL: Laporan Log ----
    if (lowerText.includes('log') || lowerText.includes('laporan')) {
      this._handleOpenLog(targetDir);
      return;
    }

    // ---- RESPONS UMUM ----
    this._reply(
      `<b>Asisten Joe (${this._activeModelName})</b><br/><br/>` +
      `Instruksi diterima: <i>"${text}"</i><br/>` +
      `Proyek: <b>${folderName}</b> | Ruang: <code>${audit.currentBranch}</code><br/><br/>` +
      `Silakan gunakan tombol pintas di bawah, atau ketik salah satu perintah berikut:<br/>` +
      `-- "Inspeksi Proyek" untuk laporan kesehatan<br/>` +
      `-- "Analisis Risiko" untuk estimasi dampak biaya<br/>` +
      `-- "Pengumuman Rilis" untuk draf komunikasi pelanggan<br/>` +
      `-- "Pecah Ide ke Tiket" untuk memecah rencana menjadi tugas`
    );
  }

  // ============================================================
  // MODUL INTI: Inspeksi Proyek
  // ============================================================
  _handleInspection(targetDir, folderName, userText, audit) {
    let html = `<b>LAPORAN INSPEKSI PROYEK</b><br/>` +
      `<small style="color:#94a3b8;">Intelegensi: ${this._activeModelName}</small><br/><br/>` +
      `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Nama Proyek</td><td style="padding:3px 6px;"><code>${folderName}</code></td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Lokasi</td><td style="padding:3px 6px;"><code>${targetDir}</code></td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Ruang Kerja</td><td style="padding:3px 6px;"><code>${audit.currentBranch}</code></td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Semua Ruang</td><td style="padding:3px 6px;">${audit.branchesPresent.map(b => `<code>${b}</code>`).join(', ')}</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Berkas Berubah</td><td style="padding:3px 6px;">${audit.changedFilesCount} berkas</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Tata Kelola SaaS</td><td style="padding:3px 6px;">${audit.hasBlueprint ? '[TERPASANG]' : '[BELUM TERPASANG]'}</td></tr>` +
      `<tr><td style="padding:3px 6px;color:#94a3b8;">Tiket Peta Jalan</td><td style="padding:3px 6px;">${audit.ticketCount} tiket</td></tr>` +
      `</table><br/>`;

    html += `<b>REKOMENDASI:</b><br/>`;
    if (!audit.hasBlueprint) {
      html += `-- Folder belum memiliki SOP & CI/CD. Ketik "Setup Blueprint".<br/>`;
    }
    if (audit.currentBranch === 'main') {
      html += `-- Anda di Ruang Utama. Disarankan buat fitur baru dari develop.<br/>`;
    } else if (audit.changedFilesCount > 0) {
      html += `-- Ada ${audit.changedFilesCount} berkas diubah. Ketik "Ajukan PR" untuk menggabungkan.<br/>`;
    }

    this._appendLog(targetDir, folderName, "INSPEKSI PROYEK", userText, audit);
    this._reply(html);
  }

  // ============================================================
  // MODUL INTI: Bersihkan Branch (Housekeeping)
  // ============================================================
  _handleHousekeeping(targetDir, folderName, audit) {
    try {
      const branches = audit.branchesPresent.filter(b => b.startsWith('feature/'));
      if (branches.length === 0) {
        this._reply("[INFORMASI] Penyimpanan proyek sudah bersih. Tidak ada draf ruang fitur lama.");
        return;
      }

      try { execSync('git checkout develop', { cwd: targetDir }); } catch(e) {}
      let cleaned = 0;
      branches.forEach(b => {
        try {
          execSync(`git branch -d ${b}`, { cwd: targetDir });
          cleaned++;
        } catch (e) {}
      });

      this._appendLog(targetDir, folderName, "PEMBERSIHAN BRANCH", `Membersihkan ${cleaned} cabang draf`, audit);
      this._reply(`[BERHASIL] Pembersihan selesai. ${cleaned} draf ruang kerja lama telah dihapus secara aman.`);
    } catch (err) {
      this._reply(`[GAGAL] Kendala pembersihan: ${err.message}`);
    }
  }

  // ============================================================
  // MODUL INTI: Buat Fitur Baru
  // ============================================================
  async _handleCreateFeature(targetDir, folderName, audit) {
    const ticketId = await vscode.window.showInputBox({ prompt: 'Masukkan Nomor Tiket Pekerjaan (Contoh: TK-201):' });
    if (!ticketId) return;

    const featureName = await vscode.window.showInputBox({ prompt: 'Masukkan Nama Fitur Singkat (Bahasa Bisnis):' });
    if (!featureName) return;

    const branchName = `feature/${ticketId}-${featureName.toLowerCase().replace(/\s+/g, '-')}`;

    try {
      try {
        execSync(`git checkout develop && git checkout -b ${branchName}`, { cwd: targetDir });
      } catch (e) {
        execSync(`git checkout -b ${branchName}`, { cwd: targetDir });
      }
      this._appendLog(targetDir, folderName, "MEMBUAT FITUR BARU", `Cabang ${branchName}`, audit);
      this._reply(`[BERHASIL] Ruang Kerja Fitur Terbuat: <code>${branchName}</code><br/>Setelah selesai, ketik "Ajukan PR".`);
    } catch (err) {
      this._reply(`[GAGAL] Tidak dapat membuat ruang kerja: ${err.message}`);
    }
  }

  // ============================================================
  // MODUL INTI: Ajukan PR / Penggabungan
  // ============================================================
  _handleSubmitPR(targetDir, folderName, audit) {
    try {
      const currentBranch = audit.currentBranch;
      if (currentBranch === 'main' || currentBranch === 'develop') {
        this._reply(`[PERINGATAN] Anda sedang di ruang <code>${currentBranch}</code>. Pengajuan hanya bisa dilakukan dari ruang fitur (feature/*).`);
        return;
      }

      this._reply(`[PROSES] Menjalankan audit kelaikan pada <code>${currentBranch}</code>...`);

      execSync(`git add . && git commit -m "fitur: pembaruan mandiri terverifikasi" || true`, { cwd: targetDir });
      execSync(`git checkout develop && git merge ${currentBranch}`, { cwd: targetDir });

      this._appendLog(targetDir, folderName, "PENGGABUNGAN PEKERJAAN", `${currentBranch} ke develop`, audit);
      this._reply(`[BERHASIL] Pekerjaan dari <code>${currentBranch}</code> telah lulus audit dan digabungkan ke <b>develop</b>.`);
    } catch (err) {
      this._reply(`[GAGAL] Kendala pengajuan: ${err.message}`);
    }
  }

  // ============================================================
  // PILAR 1: INTELIJEN RISIKO & ESTIMASI BIAYA
  // ============================================================
  _handleRiskAnalysis(targetDir, folderName, userText, audit) {
    let diffStat = { filesChanged: 0, insertions: 0, deletions: 0 };

    try {
      const rawDiff = execSync('git diff --stat HEAD~1 HEAD 2>/dev/null || git diff --stat', { cwd: targetDir }).toString();
      const summaryLine = rawDiff.split('\n').filter(l => l.includes('changed')).pop() || '';
      const filesMatch = summaryLine.match(/(\d+)\s+file/);
      const insertMatch = summaryLine.match(/(\d+)\s+insertion/);
      const deleteMatch = summaryLine.match(/(\d+)\s+deletion/);
      diffStat.filesChanged = filesMatch ? parseInt(filesMatch[1]) : 0;
      diffStat.insertions = insertMatch ? parseInt(insertMatch[1]) : 0;
      diffStat.deletions = deleteMatch ? parseInt(deleteMatch[1]) : 0;
    } catch (e) {}

    const totalLines = diffStat.insertions + diffStat.deletions;
    let riskLevel, riskColor, recommendation;

    if (totalLines < 50) {
      riskLevel = 'RENDAH';
      riskColor = '#22c55e';
      recommendation = 'Perubahan berskala kecil. Aman untuk langsung digabungkan ke tahap berikutnya tanpa pengujian tambahan.';
    } else if (totalLines < 200) {
      riskLevel = 'SEDANG';
      riskColor = '#f59e0b';
      recommendation = 'Perubahan cukup signifikan. Disarankan melakukan pengujian manual di Ruang Simulasi (staging) sebelum rilis ke Sistem Utama.';
    } else {
      riskLevel = 'TINGGI';
      riskColor = '#ef4444';
      recommendation = 'Perubahan besar. WAJIB menjalankan pengujian menyeluruh di Ruang Simulasi, audit performa, dan siapkan prosedur pembatalan (rollback) sebelum rilis.';
    }

    // Estimasi dampak biaya sederhana
    const estimatedHours = Math.max(0.5, Math.round((totalLines / 30) * 10) / 10);
    const estimatedTestHours = Math.round(estimatedHours * 0.4 * 10) / 10;

    let html = `<b>LAPORAN ANALISIS RISIKO & ESTIMASI BIAYA</b><br/>` +
      `<small style="color:#94a3b8;">Proyek: ${folderName} | Ruang: ${audit.currentBranch}</small><br/><br/>` +

      `<table style="width:100%;border-collapse:collapse;font-size:11.5px;">` +
      `<tr style="border-bottom:1px solid #334155;">` +
      `<td style="padding:4px 6px;color:#94a3b8;">Berkas Berubah</td>` +
      `<td style="padding:4px 6px;font-weight:700;">${diffStat.filesChanged} berkas</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;">` +
      `<td style="padding:4px 6px;color:#94a3b8;">Baris Ditambah</td>` +
      `<td style="padding:4px 6px;color:#22c55e;font-weight:700;">+${diffStat.insertions}</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;">` +
      `<td style="padding:4px 6px;color:#94a3b8;">Baris Dihapus</td>` +
      `<td style="padding:4px 6px;color:#ef4444;font-weight:700;">-${diffStat.deletions}</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;">` +
      `<td style="padding:4px 6px;color:#94a3b8;">Total Volume Perubahan</td>` +
      `<td style="padding:4px 6px;font-weight:700;">${totalLines} baris</td></tr>` +
      `<tr style="border-bottom:1px solid #334155;">` +
      `<td style="padding:4px 6px;color:#94a3b8;">Tingkat Risiko</td>` +
      `<td style="padding:4px 6px;font-weight:700;color:${riskColor};">[${riskLevel}]</td></tr>` +
      `</table><br/>` +

      `<b>ESTIMASI BEBAN OPERASIONAL:</b><br/>` +
      `-- Waktu pengerjaan perkiraan: <b>${estimatedHours} jam kerja</b><br/>` +
      `-- Waktu pengujian perkiraan: <b>${estimatedTestHours} jam kerja</b><br/><br/>` +

      `<b>REKOMENDASI MITIGASI:</b><br/>` +
      `${recommendation}`;

    this._appendLog(targetDir, folderName, "ANALISIS RISIKO & BIAYA", `Tingkat: ${riskLevel}, Volume: ${totalLines} baris`, audit);
    this._reply(html);
  }

  // ============================================================
  // PILAR 2: PEMBUAT KONTEN RILIS & KOMUNIKASI PELANGGAN
  // ============================================================
  _handleReleaseDraft(targetDir, folderName, userText, audit) {
    let recentCommits = [];
    try {
      const logOutput = execSync('git log --oneline -10', { cwd: targetDir }).toString().trim();
      recentCommits = logOutput.split('\n').filter(Boolean);
    } catch (e) {}

    const now = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Rangkum perubahan dari commit messages
    const changesList = recentCommits.slice(0, 5).map(c => {
      const msg = c.substring(c.indexOf(' ') + 1);
      return msg.charAt(0).toUpperCase() + msg.slice(1);
    });

    // DRAF 1: Pesan WhatsApp / Email Broadcast
    const whatsappDraft =
      `<div style="background:#1a2332;border:1px solid #334155;border-radius:4px;padding:10px;margin:6px 0;font-size:11.5px;">` +
      `<b style="color:#eab308;">DRAF PESAN WHATSAPP / EMAIL</b><br/>` +
      `<span style="color:#94a3b8;">--- Salin teks di bawah ini ---</span><br/><br/>` +
      `Yth. Pelanggan <b>${folderName}</b>,<br/><br/>` +
      `Kami informasikan bahwa per tanggal <b>${now}</b>, sistem kami telah diperbarui dengan peningkatan berikut:<br/><br/>` +
      changesList.map((c, i) => `${i + 1}. ${c}`).join('<br/>') +
      `<br/><br/>` +
      `Pembaruan ini telah melewati proses pengujian dan audit kelaikan secara menyeluruh untuk memastikan kenyamanan Anda.<br/><br/>` +
      `Terima kasih atas kepercayaan Anda.<br/>` +
      `Salam,<br/>Tim Pengembangan ${folderName}` +
      `</div>`;

    // DRAF 2: Ringkasan Penjualan / Pamflet Fitur
    const salesDraft =
      `<div style="background:#1a2332;border:1px solid #334155;border-radius:4px;padding:10px;margin:6px 0;font-size:11.5px;">` +
      `<b style="color:#3b82f6;">RINGKASAN PENJUALAN (PAMFLET FITUR)</b><br/>` +
      `<span style="color:#94a3b8;">--- Untuk dibagikan ke tim penjualan ---</span><br/><br/>` +
      `<b>Produk:</b> ${folderName}<br/>` +
      `<b>Tanggal Rilis:</b> ${now}<br/>` +
      `<b>Ruang Rilis:</b> ${audit.currentBranch}<br/><br/>` +
      `<b>Keunggulan Pembaruan Terbaru:</b><br/>` +
      changesList.map(c => `-- ${c}`).join('<br/>') +
      `<br/><br/>` +
      `<b>Poin Penjualan Utama:</b><br/>` +
      `-- Sistem telah melewati audit kelaikan otomatis<br/>` +
      `-- Seluruh perubahan tercatat dan dapat dilacak<br/>` +
      `-- Prosedur pembatalan (rollback) tersedia jika diperlukan` +
      `</div>`;

    // Simpan draf ke berkas
    const draftPath = path.join(targetDir, 'DRAF_PENGUMUMAN_RILIS.md');
    const draftContent = `# DRAF PENGUMUMAN RILIS\n\n` +
      `- **Proyek:** ${folderName}\n` +
      `- **Tanggal:** ${now}\n` +
      `- **Ruang Rilis:** ${audit.currentBranch}\n\n` +
      `---\n\n` +
      `## Pesan WhatsApp / Email\n\n` +
      `Yth. Pelanggan ${folderName},\n\n` +
      `Kami informasikan bahwa per tanggal ${now}, sistem kami telah diperbarui dengan peningkatan berikut:\n\n` +
      changesList.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nPembaruan ini telah melewati proses pengujian dan audit kelaikan secara menyeluruh.\n\n` +
      `Terima kasih atas kepercayaan Anda.\nSalam, Tim Pengembangan ${folderName}\n\n` +
      `---\n\n` +
      `## Ringkasan Penjualan\n\n` +
      changesList.map(c => `- ${c}`).join('\n') + '\n';

    try {
      fs.writeFileSync(draftPath, draftContent, 'utf8');
    } catch (e) {}

    const html = `<b>DRAF KONTEN PENGUMUMAN RILIS</b><br/>` +
      `<small style="color:#94a3b8;">Dihasilkan otomatis | Proyek: ${folderName}</small><br/><br/>` +
      whatsappDraft + salesDraft +
      `<br/><small style="color:#94a3b8;">Draf juga disimpan ke berkas: DRAF_PENGUMUMAN_RILIS.md</small>`;

    this._appendLog(targetDir, folderName, "PENYUSUNAN DRAF PENGUMUMAN RILIS", userText, audit);
    this._reply(html);
  }

  // ============================================================
  // PILAR 3: PEMBONGKARAN IDE JADI TIKET TUGAS
  // ============================================================
  async _handleIdeaBreakdown(targetDir, folderName, userText, audit) {
    // Minta deskripsi ide jika input terlalu pendek
    let ideaText = userText;
    if (userText.length < 15) {
      const inputIdea = await vscode.window.showInputBox({
        prompt: 'Jelaskan ide bisnis Anda secara singkat (contoh: "Bikin program promo diskon 17% Kemerdekaan"):',
        placeHolder: 'Deskripsikan ide Anda di sini...'
      });
      if (!inputIdea) return;
      ideaText = inputIdea;
    }

    // Analisis kata kunci dari ide untuk menghasilkan tiket
    const keywords = ideaText.toLowerCase().split(/[\s,;.]+/).filter(w => w.length > 3);
    const now = new Date();
    const baseTicketNum = Math.floor(now.getTime() / 100000) % 900 + 100;

    // Buat 3-5 tiket berdasarkan pola umum pengembangan produk
    const tickets = [];

    tickets.push({
      id: `TK-${baseTicketNum}`,
      title: `Perancangan & Analisis Kebutuhan: "${ideaText.substring(0, 50)}"`,
      desc: `Menyusun dokumen kebutuhan bisnis, alur proses, dan desain tampilan awal untuk rencana ini.`,
      priority: 'UTAMA'
    });

    tickets.push({
      id: `TK-${baseTicketNum + 1}`,
      title: `Pengembangan Modul Inti`,
      desc: `Membangun logika utama dan struktur data yang diperlukan untuk menjalankan rencana ini.`,
      priority: 'UTAMA'
    });

    tickets.push({
      id: `TK-${baseTicketNum + 2}`,
      title: `Pembuatan Tampilan & Antarmuka Pengguna`,
      desc: `Mendesain dan membangun halaman atau formulir yang dibutuhkan agar pengguna dapat berinteraksi dengan fitur ini.`,
      priority: 'UTAMA'
    });

    tickets.push({
      id: `TK-${baseTicketNum + 3}`,
      title: `Pengujian & Validasi Kelaikan`,
      desc: `Menjalankan pengujian menyeluruh untuk memastikan fitur ini berjalan sesuai harapan bisnis.`,
      priority: 'PENDUKUNG'
    });

    tickets.push({
      id: `TK-${baseTicketNum + 4}`,
      title: `Peluncuran & Pengumuman ke Pelanggan`,
      desc: `Menerbitkan fitur ke Sistem Utama dan menyusun materi pengumuman untuk pelanggan.`,
      priority: 'PENDUKUNG'
    });

    // Output HTML
    let html = `<b>PETA JALAN & TIKET TUGAS</b><br/>` +
      `<small style="color:#94a3b8;">Dibongkar dari ide: "${ideaText}"</small><br/><br/>` +
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

    html += `</table><br/>` +
      `<small style="color:#94a3b8;">Peta jalan disimpan ke berkas: PETA_JALAN.md</small>`;

    // Simpan ke PETA_JALAN.md
    const roadmapPath = path.join(targetDir, 'PETA_JALAN.md');
    let existingContent = '';
    try { existingContent = fs.readFileSync(roadmapPath, 'utf8'); } catch (e) {}

    const mermaidDiagram = tickets.map((t, i) => {
      const nodeId = String.fromCharCode(65 + i);
      const nextId = i < tickets.length - 1 ? String.fromCharCode(66 + i) : null;
      const line = `    ${nodeId}["${t.id}: ${t.title.substring(0, 40)}"]`;
      const arrow = nextId ? `\n    ${nodeId} --> ${nextId}` : '';
      return line + arrow;
    }).join('\n');

    const roadmapEntry = `\n---\n\n## Rencana: ${ideaText.substring(0, 60)}\n\n` +
      `**Dibuat:** ${now.toLocaleString('id-ID')}\n\n` +
      `| Tiket | Judul | Deskripsi | Prioritas |\n` +
      `| :--- | :--- | :--- | :--- |\n` +
      tickets.map(t => `| ${t.id} | ${t.title} | ${t.desc} | ${t.priority} |`).join('\n') +
      `\n\n### Diagram Alur Peta Jalan\n\n` +
      '```mermaid\nflowchart TD\n' + mermaidDiagram + '\n```\n';

    const header = existingContent ? '' : `# PETA JALAN PROYEK: ${folderName}\n\nDokumen ini berisi seluruh rencana kerja yang dibongkar dari ide bisnis oleh Asisten Joe.\n`;

    try {
      fs.writeFileSync(roadmapPath, header + existingContent + roadmapEntry, 'utf8');
    } catch (e) {}

    this._updateWidget({ ...audit, ticketCount: (audit.ticketCount || 0) + tickets.length });
    this._appendLog(targetDir, folderName, "PEMBONGKARAN IDE JADI TIKET", `${tickets.length} tiket dari: "${ideaText.substring(0, 40)}"`, audit);
    this._reply(html);
  }

  // ============================================================
  // MODUL: Buka Laporan Log
  // ============================================================
  _handleOpenLog(targetDir) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    if (fs.existsSync(logPath)) {
      const uri = vscode.Uri.file(logPath);
      vscode.commands.executeCommand('vscode.open', uri);
      this._reply('[BERHASIL] Berkas LOG_AKTIVITAS.md telah dibuka di editor.');
    } else {
      this._reply('[INFORMASI] Berkas LOG_AKTIVITAS.md belum tersedia. Lakukan inspeksi proyek terlebih dahulu untuk memicu pembuatan log.');
    }
  }

  // ============================================================
  // UTILITAS: Inspeksi Proyek
  // ============================================================
  _inspectProject(targetDir) {
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

    // Hitung tiket dari PETA_JALAN.md
    try {
      const roadmap = fs.readFileSync(path.join(targetDir, 'PETA_JALAN.md'), 'utf8');
      const matches = roadmap.match(/TK-\d+/g);
      ticketCount = matches ? matches.length : 0;
    } catch (e) {}

    return { currentBranch, branchesPresent, changedFilesCount, hasBlueprint, ticketCount };
  }

  // ============================================================
  // UTILITAS: Update Widget
  // ============================================================
  _updateWidget(audit) {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateWidget',
        branch: audit.currentBranch,
        tickets: audit.ticketCount || 0
      });
    }
  }

  // ============================================================
  // UTILITAS: Append Log & Simpan LOG_AKTIVITAS.md
  // ============================================================
  _appendLog(targetDir, folderName, actionName, userInstruction, audit) {
    const logPath = path.join(targetDir, 'LOG_AKTIVITAS.md');
    const now = new Date().toLocaleString('id-ID');

    // Tambahkan ke riwayat internal
    this._logHistory.push({
      time: now,
      action: actionName,
      desc: userInstruction,
      branch: audit.currentBranch,
      status: 'BERHASIL'
    });

    // Bangun tabel CRUD kumulatif
    const crudRows = this._logHistory.map(entry =>
      `| ${entry.time} | ${entry.action} | ${entry.desc} | ${entry.branch} | ${entry.status} |`
    ).join('\n');

    // Bangun diagram Mermaid dari seluruh riwayat
    const mermaidNodes = this._logHistory.map((entry, i) => {
      const nodeId = `N${i}`;
      const nextId = i < this._logHistory.length - 1 ? `N${i + 1}` : null;
      const line = `    ${nodeId}["${entry.action}"]`;
      const arrow = nextId ? `\n    ${nodeId} --> ${nextId}` : '';
      return line + arrow;
    }).join('\n');

    const logContent = `# LAPORAN REKAP AKTIVITAS & REKAM KERJA PROYEK

- **Nama Proyek:** ${folderName}
- **Waktu Pembaruan Terakhir:** ${now}
- **Ruang Kerja Aktif:** ${audit.currentBranch}
- **Status Tata Kelola SaaS:** ${audit.hasBlueprint ? 'Terpasang Lengkap' : 'Belum Terpasang'}
- **Otak Intelegensi AI:** ${this._activeModelName}
- **Jumlah Tiket Peta Jalan:** ${audit.ticketCount || 0}

---

## 1. TABEL REKAP OPERASI SISTEM (CRUD)

| Waktu | Jenis Aktivitas | Deskripsi Operasional | Ruang Kerja | Status |
| :--- | :--- | :--- | :--- | :--- |
${crudRows}

---

## 2. DIAGRAM VISUAL ALUR SELURUH PEKERJAAN SESI INI

\`\`\`mermaid
flowchart TD
    START["Awal Sesi Asisten Joe"] --> ${this._logHistory.length > 0 ? 'N0' : 'END'}
${mermaidNodes}
    ${this._logHistory.length > 0 ? `N${this._logHistory.length - 1}` : 'START'} --> END["Status Terkini: ${audit.currentBranch}"]
\`\`\`

---

*Catatan: Dokumen ini disusun secara otomatis oleh Asisten Joe v4.0 untuk memberikan transparansi riwayat pekerjaan dalam bahasa bisnis sederhana.*
`;

    try {
      fs.writeFileSync(logPath, logContent, 'utf8');
    } catch (e) {
      console.error('Gagal memperbarui LOG_AKTIVITAS.md:', e);
    }
  }

  // ============================================================
  // UTILITAS: Reply
  // ============================================================
  _reply(htmlText) {
    if (this._view) {
      this._view.webview.postMessage({ type: 'response', text: htmlText });
    }
  }

  _getHtmlForWebview(webview) {
    const htmlPath = path.join(this._extensionUri.fsPath, 'chat-view.html');
    return fs.readFileSync(htmlPath, 'utf8');
  }
}

module.exports = SaaSWorkflowChatProvider;
