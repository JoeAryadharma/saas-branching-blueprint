# 🛡️ KEBIJAKAN KEAMANAN & PELAPORAN CELAH BISNIS

Keamanan data dan kelangsungan operasional pelanggan adalah prioritas tertinggi perusahaan.

---

## 🔒 Kebijakan Pelaporan Celah Keamanan

Jika Anda menemukan potensi celah keamanan, bug kritis, atau kebocoran data di dalam sistem:

1. **JANGAN melaporkan celah keamanan secara terbuka** di bagian Laporan Masalah (*Public Issue*) atau grup obrolan umum.
2. **Kirimkan laporan langsung secara rahasia** melalui email keamanan perusahaan: `keamanan@perusahaan-saas.com`.
3. Cantumkan informasi berikut di dalam laporan:
   * Deskripsi potensi risiko bisnis.
   * Langkah-langkah untuk mereplikasi kendala.
   * Modul atau fitur yang terdampak.

---

## 🕒 Target Waktu Penanganan Masalah (SLA)

| Tingkat Bahaya | Respon Pertama | Penanganan Darurat (Hotfix) |
| :--- | :--- | :--- |
| **Kritis (Fatal)** | Maksimal 1 Jam | Maksimal 6 Jam |
| **Tinggi** | Maksimal 4 Jam | Maksimal 24 Jam |
| **Sedang / Rendah** | Maksimal 24 Jam | Dimasukkan ke Siklus Rilis Berikutnya |

---

## 🛡️ Standar Pengamanan Kode Internal

- Selalu gunakan enkripsi untuk data sensitif pelanggan.
- Dilarang keras menaruh kunci rahasia (*API Key / Password*) di dalam berkas kodingan. Selalu gunakan sistem penampung kunci rahasia (*Environment Secrets*).
