const path = require('path');
const fs = require('fs');

// ============================================================
// MEMORY MANAGER -- Memori Lintas Sesi
// Menyimpan dan memuat riwayat keputusan, pola, dan preferensi
// agar Asisten Joe "mengingat" dari sesi sebelumnya.
// ============================================================

const MEMORY_FILE = 'MEMORI_PROYEK.json';
const MAX_ENTRIES = 50; // Batas entri per kategori agar berkas tidak membengkak

class MemoryManager {
  constructor() {
    this._data = this._createEmpty();
    this._loaded = false;
  }

  _createEmpty() {
    return {
      versi: '1.0',
      keputusan: [],
      pola: [],
      preferensi: {},
      statistik: {
        total_fitur_dibuat: 0,
        total_penggabungan: 0,
        total_analisis_risiko: 0,
        total_tiket_dibuat: 0,
        total_rilis: 0,
        sesi_pertama: null,
        sesi_terakhir: null
      }
    };
  }

  // Muat memori dari berkas proyek
  load(targetDir) {
    const filePath = path.join(targetDir, MEMORY_FILE);
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        this._data = JSON.parse(raw);
        this._loaded = true;
      }
    } catch (e) {
      console.error('MemoryManager: Gagal memuat memori:', e.message);
      this._data = this._createEmpty();
    }

    // Catat waktu sesi
    const now = new Date().toLocaleString('id-ID');
    if (!this._data.statistik.sesi_pertama) {
      this._data.statistik.sesi_pertama = now;
    }
    this._data.statistik.sesi_terakhir = now;
  }

  // Simpan memori ke berkas proyek
  save(targetDir) {
    const filePath = path.join(targetDir, MEMORY_FILE);
    try {
      fs.writeFileSync(filePath, JSON.stringify(this._data, null, 2), 'utf8');
    } catch (e) {
      console.error('MemoryManager: Gagal menyimpan memori:', e.message);
    }
  }

  // Catat keputusan arsitektur/bisnis
  addDecision(isi, konteks = '') {
    this._data.keputusan.push({
      tanggal: new Date().toLocaleString('id-ID'),
      isi: isi,
      konteks: konteks
    });
    // Batasi jumlah entri
    if (this._data.keputusan.length > MAX_ENTRIES) {
      this._data.keputusan = this._data.keputusan.slice(-MAX_ENTRIES);
    }
  }

  // Catat pola (kesalahan atau keberhasilan)
  addPattern(jenis, isi, konteks = '') {
    this._data.pola.push({
      tanggal: new Date().toLocaleString('id-ID'),
      jenis: jenis, // 'kesalahan' atau 'keberhasilan'
      isi: isi,
      konteks: konteks
    });
    if (this._data.pola.length > MAX_ENTRIES) {
      this._data.pola = this._data.pola.slice(-MAX_ENTRIES);
    }
  }

  // Perbarui statistik
  incrementStat(key) {
    if (this._data.statistik[key] !== undefined) {
      this._data.statistik[key]++;
    }
  }

  // Simpan preferensi pengguna
  setPreference(key, value) {
    this._data.preferensi[key] = value;
  }

  // Ambil memori relevan sebagai teks konteks untuk AI
  // Mengambil N entri terakhir dari keputusan dan pola
  getRelevantContext(maxEntries = 5) {
    const parts = [];

    const recentDecisions = this._data.keputusan.slice(-maxEntries);
    if (recentDecisions.length > 0) {
      parts.push('KEPUTUSAN SEBELUMNYA:');
      recentDecisions.forEach(d => {
        parts.push(`- [${d.tanggal}] ${d.isi}${d.konteks ? ` (konteks: ${d.konteks})` : ''}`);
      });
    }

    const recentPatterns = this._data.pola.slice(-maxEntries);
    if (recentPatterns.length > 0) {
      parts.push('\nPOLA YANG PERNAH TERJADI:');
      recentPatterns.forEach(p => {
        parts.push(`- [${p.jenis.toUpperCase()}] ${p.isi}${p.konteks ? ` (konteks: ${p.konteks})` : ''}`);
      });
    }

    const stats = this._data.statistik;
    parts.push('\nSTATISTIK PROYEK:');
    parts.push(`- Total fitur dibuat: ${stats.total_fitur_dibuat}`);
    parts.push(`- Total penggabungan: ${stats.total_penggabungan}`);
    parts.push(`- Total tiket dibuat: ${stats.total_tiket_dibuat}`);
    parts.push(`- Sesi pertama: ${stats.sesi_pertama || 'Baru'}`);
    parts.push(`- Sesi terakhir: ${stats.sesi_terakhir || 'Sekarang'}`);

    if (Object.keys(this._data.preferensi).length > 0) {
      parts.push('\nPREFERENSI PENGGUNA:');
      Object.entries(this._data.preferensi).forEach(([k, v]) => {
        parts.push(`- ${k}: ${v}`);
      });
    }

    return parts.join('\n');
  }

  // Getter: seluruh data memori
  get data() {
    return this._data;
  }

  // Getter: statistik
  get stats() {
    return this._data.statistik;
  }
}

module.exports = MemoryManager;
