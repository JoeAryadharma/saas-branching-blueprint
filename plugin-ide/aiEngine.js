const vscode = require('vscode');
const https = require('https');

// ============================================================
// AI ENGINE v9.6.0 -- Real-Time Streaming & Antigravity AI Engine
// Modul ini menghubungkan Asisten Joe dengan otak AI Antigravity IDE / Gemini
// 1. Real-Time Token Streaming (word-by-word streaming to Webview)
// 2. Otomatis Menggunakan Token Native Antigravity IDE via vscode.lm API
// 3. Fallback Opsional via Custom Gemini / Antigravity API Key
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
    this._customApiKey = null;
  }

  // 1. Cari dan sambungkan ke model AI bawaan Antigravity IDE (vscode.lm API)
  // atau API Key kustom jika dikonfigurasi
  async initialize() {
    try {
      const models = await vscode.lm.selectChatModels();
      if (models && models.length > 0) {
        const preferred = models.find(m => 
          (m.family && m.family.toLowerCase().includes('gemini')) ||
          (m.vendor && m.vendor.toLowerCase().includes('antigravity'))
        ) || models[0];

        this._model = preferred;
        const vendor = preferred.vendor || 'Antigravity';
        const family = preferred.family || 'AI Engine';
        this._modelName = `${vendor} ${family} (Token Native Antigravity)`;
        this._isAvailable = true;
        console.log(`AIEngine: Tersambung otomatis ke Antigravity IDE -> ${this._modelName}`);
        return true;
      }
    } catch (e) {
      console.log('AIEngine: Mode Native vscode.lm tidak tersedia, memeriksa API Key kustom...', e.message);
    }

    const configApiKey = vscode.workspace.getConfiguration('saasWorkflow').get('apiKey');
    const envApiKey = process.env.GEMINI_API_KEY || process.env.ANTIGRAVITY_API_KEY;
    this._customApiKey = configApiKey || envApiKey || null;

    if (this._customApiKey) {
      this._isAvailable = true;
      this._modelName = 'Gemini / Antigravity Direct API (Custom Token)';
      console.log('AIEngine: Tersambung via Custom API Key.');
      return true;
    }

    this._isAvailable = false;
    this._modelName = 'Fallback (Mode Otomatis Tanpa Token AI)';
    return false;
  }

  // Real-Time Streaming Request (v9.6.0)
  // Memanggil onChunk(fragmentText) setiap kali ada potongan kata baru dari AI
  async askStream(userPrompt, systemContext = '', onChunk) {
    if (!this._isAvailable) {
      return null;
    }

    // Jalur A: Streaming Token Native Antigravity IDE (vscode.lm)
    if (this._model) {
      try {
        const messages = [];

        let fullSystem = SYSTEM_PERSONA;
        if (systemContext) {
          fullSystem += '\n\nKONTEKS PROYEK:\n' + systemContext;
        }
        messages.push(vscode.LanguageModelChatMessage.User(fullSystem));
        messages.push(vscode.LanguageModelChatMessage.User(userPrompt));

        const tokenSource = new vscode.CancellationTokenSource();
        const timeout = setTimeout(() => tokenSource.cancel(), 45000);

        const response = await this._model.sendRequest(messages, {}, tokenSource.token);

        let fullResult = '';
        for await (const fragment of response.text) {
          fullResult += fragment;
          if (typeof onChunk === 'function') {
            onChunk(fragment, fullResult);
          }
        }

        clearTimeout(timeout);
        return fullResult;

      } catch (e) {
        console.error('AIEngine Streaming Error:', e.message);
      }
    }

    // Jalur B: Direct REST API Fallback
    const result = await this.ask(userPrompt, systemContext);
    if (result && typeof onChunk === 'function') {
      onChunk(result, result);
    }
    return result;
  }

  // Kirim pertanyaan ke model AI (Non-Streaming Fallback)
  async ask(userPrompt, systemContext = '') {
    if (!this._isAvailable) {
      return null;
    }

    if (this._model) {
      try {
        const messages = [];

        let fullSystem = SYSTEM_PERSONA;
        if (systemContext) {
          fullSystem += '\n\nKONTEKS PROYEK:\n' + systemContext;
        }
        messages.push(vscode.LanguageModelChatMessage.User(fullSystem));
        messages.push(vscode.LanguageModelChatMessage.User(userPrompt));

        const tokenSource = new vscode.CancellationTokenSource();
        const timeout = setTimeout(() => tokenSource.cancel(), 30000);

        const response = await this._model.sendRequest(messages, {}, tokenSource.token);

        let result = '';
        for await (const fragment of response.text) {
          result += fragment;
        }

        clearTimeout(timeout);
        return result;

      } catch (e) {
        console.error('AIEngine Error:', e.message);
      }
    }

    if (this._customApiKey) {
      return await this._callDirectGeminiApi(userPrompt, systemContext);
    }

    return null;
  }

  // Panggilan HTTP Direct jika menggunakan API Key
  _callDirectGeminiApi(userPrompt, systemContext = '') {
    return new Promise((resolve) => {
      const fullPrompt = `${SYSTEM_PERSONA}\n\nKONTEKS PROYEK:\n${systemContext}\n\nINSTRUKSI PENGGUNA:\n${userPrompt}`;
      const payload = JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${this._customApiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates[0].content.parts[0].text) {
              resolve(parsed.candidates[0].content.parts[0].text);
            } else {
              resolve(null);
            }
          } catch (err) {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.setTimeout(25000, () => { req.destroy(); resolve(null); });
      req.write(payload);
      req.end();
    });
  }

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

  get modelName() {
    return this._modelName;
  }

  get isAvailable() {
    return this._isAvailable;
  }

  async refresh() {
    await this.initialize();
  }
}

module.exports = AIEngine;
