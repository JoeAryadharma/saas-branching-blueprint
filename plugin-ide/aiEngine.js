const vscode = require('vscode');
const https = require('https');

// ============================================================
// ASISTEN JOE v10.11.0 -- FULL STACK LARAVEL & BLADE ARCHETYPE ENGINE
// Modul Utama Pengolahan AI Chatbot Spesialis Full Stack Laravel & Blade
// Archetype Resmi: Professional Senior Full Stack Architect & Prompt Engineer
// Menggunakan Groq LLaMA 3.3 70B & Auto-Failover 3x API Key Pool
// ============================================================

const SYSTEM_PERSONA = [
  'Kamu adalah Asisten Joe - AI Chatbot & Senior Full Stack Laravel & Blade Architect yang Profesional, Lugas, dan Presisi.',
  'ARCHETYPE CHATBOT PROFESIONAL:',
  '1. Jawab setiap pertanyaan, analisis, obrolan, maupun permintaan koding/prompt pengguna secara langsung, ramah, komunikatif, dan lugas tanpa menggunakan frasa meta seperti "solusi manusiawi" atau istilah canggung.',
  '2. Spesialis Full Stack Laravel 11/12 (bootstrap/app.php, Action/Service Pattern) & Blade Component Architecture (<x-layout>, <x-button>, Zero-Logic Views).',
  '3. Pengawal Optimalisasi Eloquent (Eager Loading with(), Zero N+1 Query) & Keamanan (CSRF, XSS {{ }}, Gate/Policy @can).',
  '4. Setiap analisis prompt wajib menyertakan Evaluasi Prompt yang objektif dan terstruktur (Tingkat Kejelasan, Keamanan Scope, Skor Kesiapan, & Rekomendasi Optimasi).',
  'Gunakan Bahasa Indonesia yang profesional, tegas, ramah, tanpa emoji, dan tanpa kode ANSI.'
].join(' ');

class AIEngine {
  constructor() {
    const k1 = 'Z3NrX0EzNXpJV0ll' + 'WXg5U2RWWHlDTnow' + 'V0dkeWIzRlloNGhT' + 'dlVLN1pPNVBQNGxJ' + 'Uzg0OFdLclU=';
    const k2 = 'Z3NrX2FwaHFnRnMw' + 'VmVWNHZVZmdBMUJw' + 'V0dkeWIzRlk2MXlK' + 'TnJ0TEtyREwxNHZ3' + 'czV4Uk5RN0Q=';
    const k3 = 'Z3NrX09pTUU0VU5E' + 'Zk8yT2lzS0J1dFJI' + 'V0dkeWIzRllsSHNw' + 'SWZpdklvMGtWR2R1' + 'NlRoN0IzY2g=';

    this._groqApiKeys = [
      Buffer.from(k1, 'base64').toString('utf8'),
      Buffer.from(k2, 'base64').toString('utf8'),
      Buffer.from(k3, 'base64').toString('utf8')
    ];

    this._currentKeyIndex = 0;
    this._modelName = 'Groq LLaMA 3.3 70B (Full Stack Laravel & Blade Archetype)';
    this._isAvailable = true;
  }

  async initialize() {
    const configApiKey = vscode.workspace.getConfiguration('saasWorkflow').get('apiKey');
    if (configApiKey && !this._groqApiKeys.includes(configApiKey)) {
      this._groqApiKeys.unshift(configApiKey);
    }
    this._isAvailable = true;
    console.log(`AIEngine v10.11.0: Tersambung ke Groq API Engine dengan ${this._groqApiKeys.length} Kunci Pool Aktif.`);
    return true;
  }

  // Mendapatkan Kunci API aktif dengan rotasi otomatis
  _getActiveKey() {
    return this._groqApiKeys[this._currentKeyIndex % this._groqApiKeys.length];
  }

  // Merotasi kunci ke kunci berikutnya jika terjadi limit/error
  _rotateKey() {
    this._currentKeyIndex = (this._currentKeyIndex + 1) % this._groqApiKeys.length;
    console.log(`AIEngine v10.11.0: Melakukan rotasi otomatis ke Groq API Key indeks #${this._currentKeyIndex}`);
  }

  // Real-Time Streaming Chatbot Murni over Groq SSE
  async askStream(userPrompt, systemContext = '', conversationHistory = [], onChunk) {
    if (!this._isAvailable) return null;

    let attempts = 0;
    const maxAttempts = this._groqApiKeys.length;

    while (attempts < maxAttempts) {
      try {
        const result = await this._callGroqStreamingApi(userPrompt, systemContext, conversationHistory, onChunk);
        if (result !== null) {
          return result;
        }
      } catch (err) {
        console.error(`AIEngine Stream Error (Key #${this._currentKeyIndex}):`, err.message);
      }

      this._rotateKey();
      attempts++;
    }

    return null;
  }

  // Permintaan Langsung Chatbot Murni
  async ask(userPrompt, systemContext = '', conversationHistory = []) {
    if (!this._isAvailable) return null;

    let attempts = 0;
    const maxAttempts = this._groqApiKeys.length;

    while (attempts < maxAttempts) {
      try {
        const result = await this._callGroqDirectApi(userPrompt, systemContext, conversationHistory);
        if (result !== null) {
          return result;
        }
      } catch (err) {
        console.error(`AIEngine Direct Error (Key #${this._currentKeyIndex}):`, err.message);
      }

      this._rotateKey();
      attempts++;
    }

    return null;
  }

  // Panggilan Streaming HTTP SSE ke Groq API
  _callGroqStreamingApi(userPrompt, systemContext = '', conversationHistory = [], onChunk) {
    return new Promise((resolve) => {
      const apiKey = this._getActiveKey();
      const messages = [];

      let fullSystem = SYSTEM_PERSONA;
      if (systemContext) {
        fullSystem += '\n\nKONTEKS PROYEK & SISTEM:\n' + systemContext;
      }
      messages.push({ role: 'system', content: fullSystem });

      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          if (msg.role && msg.content) {
            messages.push({ role: msg.role, content: msg.content });
          }
        });
      }

      messages.push({ role: 'user', content: userPrompt });

      const payload = JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.6,
        max_tokens: 4096,
        stream: true
      });

      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          console.error(`Groq API Status Error: ${res.statusCode}`);
          resolve(null);
          return;
        }

        let fullResult = '';
        let buffer = '';

        res.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;
            if (trimmed === 'data: [DONE]') continue;

            if (trimmed.startsWith('data: ')) {
              try {
                const jsonStr = trimmed.substring(6);
                const parsed = JSON.parse(jsonStr);
                const deltaContent = parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content;
                if (deltaContent) {
                  fullResult += deltaContent;
                  if (typeof onChunk === 'function') {
                    onChunk(deltaContent, fullResult);
                  }
                }
              } catch (e) {
                // Abaikan kesalahan parsial JSON
              }
            }
          }
        });

        res.on('end', () => {
          resolve(fullResult.length > 0 ? fullResult : null);
        });
      });

      req.on('error', (err) => {
        console.error('Groq HTTPS Request Error:', err.message);
        resolve(null);
      });

      req.setTimeout(35000, () => {
        req.destroy();
        resolve(null);
      });

      req.write(payload);
      req.end();
    });
  }

  // Panggilan Non-Streaming Direct HTTP ke Groq API
  _callGroqDirectApi(userPrompt, systemContext = '', conversationHistory = []) {
    return new Promise((resolve) => {
      const apiKey = this._getActiveKey();
      const messages = [];

      let fullSystem = SYSTEM_PERSONA;
      if (systemContext) {
        fullSystem += '\n\nKONTEKS PROYEK & SISTEM:\n' + systemContext;
      }
      messages.push({ role: 'system', content: fullSystem });

      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          if (msg.role && msg.content) {
            messages.push({ role: msg.role, content: msg.content });
          }
        });
      }

      messages.push({ role: 'user', content: userPrompt });

      const payload = JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.6,
        max_tokens: 4096,
        stream: false
      });

      const options = {
        hostname: 'api.groq.com',
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const parsed = JSON.parse(data);
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
                resolve(parsed.choices[0].message.content);
                return;
              }
            }
            resolve(null);
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
      `TUGAS ANALISIS KRITIS: ${taskDescription}`,
      '',
      'DATA CONTEXT:',
      dataContext,
      '',
      'SUSUN DENGAN FORMAT STRUKTUR BERIKUT:',
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
