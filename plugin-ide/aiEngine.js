const vscode = require('vscode');
const https = require('https');

// ============================================================
// AI ENGINE v9.6.1 -- Pure Prompt Generator & Real-Time Streaming
// Modul ini menjamin bahwa seluruh output Asisten Joe SELALU
// berupa DRAF PROMPT PRESISI TERSTRUKTUR (Prompt Generator Engine)
// dan bukan kode mentah.
// ============================================================

const SYSTEM_PERSONA = [
  'Kamu adalah Asisten Joe - Master Prompt Engineer & Dedicated Prompt Generator Engine.',
  'ATURAN MUTLAK PERILAKU: JANGAN PERNAH memberikan output berupa kode program mentah atau jawaban langsung biasa.',
  'Setiap jawaban, analisis, rekomendasi, solusi, dan perbaikan dari kamu WAJIB SELALU diformat sebagai DRAF PROMPT PRESISI TERSTRUKTUR (Prompt Generator) yang siap disalin oleh pengguna untuk dimasukkan ke AI lain.',
  'Gunakan format Stanford DSPy / Chain-of-Thought (CoT) berikut untuk setiap output:',
  '[PROMP GENERATOR - ASISTEN JOE]',
  '-- PERAN AI PENERIMA: (Sebutkan peran spesifik)',
  '-- KONTEKS SISTEM: (Sebutkan konteks bisnis/sistem)',
  '-- INSTRUKSI UTAMA: (Instruksi presisi)',
  '-- ALUR BERPIKIR (Chain-of-Thought): (Langkah 1, 2, 3)',
  '-- BATASAN KERAS: (Aturan larangan)',
  'Jawab selalu dalam Bahasa Indonesia yang profesional, tegas, tanpa emoji, dan tanpa kode ANSI.',
].join(' ');

class AIEngine {
  constructor() {
    this._model = null;
    this._modelName = 'Belum Tersambung';
    this._isAvailable = false;
    this._customApiKey = null;
  }

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

  // Real-Time Streaming Request (Pure Prompt Output Enforced)
  async askStream(userPrompt, systemContext = '', onChunk) {
    if (!this._isAvailable) {
      return null;
    }

    if (this._model) {
      try {
        const messages = [];

        let fullSystem = SYSTEM_PERSONA;
        if (systemContext) {
          fullSystem += '\n\nKONTEKS ARSITEKTUR PROYEK:\n' + systemContext;
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

    const result = await this.ask(userPrompt, systemContext);
    if (result && typeof onChunk === 'function') {
      onChunk(result, result);
    }
    return result;
  }

  async ask(userPrompt, systemContext = '') {
    if (!this._isAvailable) {
      return null;
    }

    if (this._model) {
      try {
        const messages = [];

        let fullSystem = SYSTEM_PERSONA;
        if (systemContext) {
          fullSystem += '\n\nKONTEKS ARSITEKTUR PROYEK:\n' + systemContext;
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
      `TUGAS PROMPT GENERATOR: ${taskDescription}`,
      '',
      'DATA:',
      dataContext,
      '',
      'SUSUN SELALU SEBAGAI PROMPT PRESISI:',
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
