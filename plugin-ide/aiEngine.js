const vscode = require('vscode');

// ============================================================
// AI ENGINE -- Jembatan ke Model AI Aktif di IDE
// Modul ini menghubungkan Asisten Joe dengan otak AI sesungguhnya
// melalui vscode.lm API (Language Model API).
// ============================================================

const SYSTEM_PERSONA = [
  'Kamu adalah Asisten Joe, seorang konsultan bisnis senior dan auditor virtual.',
  'Jawab selalu dalam Bahasa Indonesia menggunakan istilah operasional bisnis sederhana.',
  'Jangan gunakan jargon teknis IT tanpa menerjemahkannya ke bahasa bisnis.',
  'Jangan gunakan emoji dalam respons apapun.',
  'Berikan analisis yang tajam, ringkas, dan dapat ditindaklanjuti.',
  'Gunakan format poin-poin bernomor untuk rekomendasi.',
  'Jika diminta menganalisis kode, fokus pada dampak bisnis dan risiko operasional.',
].join(' ');

class AIEngine {
  constructor() {
    this._model = null;
    this._modelName = 'Belum Tersambung';
    this._isAvailable = false;
  }

  // Cari dan sambungkan ke model AI yang tersedia di IDE
  async initialize() {
    try {
      const models = await vscode.lm.selectChatModels();
      if (models && models.length > 0) {
        this._model = models[0];
        this._modelName = `${this._model.vendor || 'AI'} ${this._model.family || 'Model'}`;
        this._isAvailable = true;
        console.log(`AIEngine: Tersambung ke ${this._modelName}`);
        return true;
      }
    } catch (e) {
      console.log('AIEngine: Tidak ada model AI tersedia, menggunakan fallback.', e.message);
    }
    this._isAvailable = false;
    this._modelName = 'Fallback (Tanpa AI)';
    return false;
  }

  // Kirim pertanyaan ke model AI dan terima respons
  // systemContext: konteks tambahan (kode, memori, dll)
  // userPrompt: instruksi/pertanyaan pengguna
  // Returns: string respons lengkap
  async ask(userPrompt, systemContext = '') {
    // Jika tidak ada model AI, kembalikan null agar caller gunakan fallback
    if (!this._isAvailable || !this._model) {
      return null;
    }

    try {
      const messages = [];

      // Persona sistem + konteks
      let fullSystem = SYSTEM_PERSONA;
      if (systemContext) {
        fullSystem += '\n\nKONTEKS PROYEK:\n' + systemContext;
      }
      messages.push(vscode.LanguageModelChatMessage.User(fullSystem));

      // Pertanyaan pengguna
      messages.push(vscode.LanguageModelChatMessage.User(userPrompt));

      const tokenSource = new vscode.CancellationTokenSource();
      // Timeout 30 detik
      const timeout = setTimeout(() => tokenSource.cancel(), 30000);

      const response = await this._model.sendRequest(messages, {}, tokenSource.token);

      let result = '';
      for await (const fragment of response.text) {
        result += fragment;
      }

      clearTimeout(timeout);
      return result;

    } catch (e) {
      console.error('AIEngine: Kesalahan saat menghubungi model AI:', e.message);
      // Jika model menolak atau error, kembalikan null agar fallback aktif
      return null;
    }
  }

  // Kirim pertanyaan dengan format khusus untuk analisis terstruktur
  // Mengembalikan respons AI dalam format yang diminta
  async analyzeStructured(taskDescription, dataContext, outputFormat) {
    const prompt = [
      `TUGAS: ${taskDescription}`,
      '',
      'DATA:',
      dataContext,
      '',
      'FORMAT OUTPUT YANG DIMINTA:',
      outputFormat,
    ].join('\n');

    return await this.ask(prompt);
  }

  // Getter: nama model aktif
  get modelName() {
    return this._modelName;
  }

  // Getter: apakah AI tersedia
  get isAvailable() {
    return this._isAvailable;
  }

  // Re-inisialisasi jika model berubah
  async refresh() {
    await this.initialize();
  }
}

module.exports = AIEngine;
