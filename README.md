# 🏢 PUSAT TEMPAT PENYIMPANAN PEKERJAAN PROYEK (REPOSITORI SAAS)

Selamat datang di tempat penyimpanan seluruh hasil pekerjaan proyek SaaS perusahaan. Dokumen ini dibuat agar seluruh anggota tim (manajemen, operasional, penguji, dan pengembang) memiliki pemahaman yang sama mengenai alur kerja digital.

---

## 📌 Ruang Kerja Digital (Branching Structure)

Proyek ini menggunakan 6 ruang kerja terisolasi agar pengembangan fitur baru tidak merusak pengalaman pengguna di sistem aktif:

1. **`main` (Sistem Utama Aktif):**
   - **Fungsi:** Tempat menyimpan versi aplikasi yang sedang digunakan langsung oleh pelanggan (Live Output).
   - **Akses:** Sangat ketat. Hanya bisa diubah melalui penggabungan otomatis yang disetujui Pemimpin Teknis.

2. **`staging` (Ruang Simulasi Akhir):**
   - **Fungsi:** Tempat simulasi akhir sebelum sistem diterbitkan ke pelanggan. Digunakan oleh Pemilik Bisnis & Tim Uji Coba.

3. **`close-packing` (Ruang Penutupan & Audit Akhir):**
   - **Fungsi:** Tempat pembekuan fitur baru untuk fokus pada pembersihan bug sisa dan audit akhir sebelum masuk simulasi.

4. **`develop` (Ruang Integrasi Tim):**
   - **Fungsi:** Ruang penggabungan harian seluruh hasil pekerjaan anggota tim pengembang.

5. **`feature/*` (Ruang Kerja Fitur Baru):**
   - **Fungsi:** Ruang kerja mandiri sementara untuk menyelesaikan 1 tugas fitur spesifik.

6. **`hotfix/*` (Jalur Perbaikan Darurat):**
   - **Fungsi:** Ruang pertolongan pertama jika terjadi kendala kritis di sistem aktif pelanggan.

---

## 🚀 Alur Kerja Singkat Anggota Tim

```
[Tiket Tugas Disetujui]
        ↓
[Buat Ruang Fitur: feature/NAMA-TIKET] (dari develop)
        ↓
[Selesaikan Pekerjaan & Simpan Catatan (Commit)]
        ↓
[Ajukan Pemeriksaan Pekerjaan (Pull Request)] (ke develop)
        ↓
[Diperiksa 2 Staf Senior & Di-ACC]
        ↓
[Masuk Ruang Penutupan -> Simulasi -> Sistem Aktif]
```

---

## 📋 Aturan Catatan Simpan Pekerjaan (Commit Convention)

Setiap menyimpan perkembangan kerja, gunakan format bahasa bisnis:

- `fitur(nama-modul): penjelasan pekerjaan [ID-TIKET]`
- `perbaikan(nama-modul): penjelasan perbaikan kendala [ID-TIKET]`

*Contoh:* `fitur(pembayaran): menambahkan integrasi pembayaran QRIS [TK-101]`

---

## 📞 Penanggung Jawab & Layanan Bantuan

Jika menemukan kendala operasional alur kerja, hubungi:
- **Pemimpin Teknis (Lead Architect):** Untuk persetujuan rilis & masalah integrasi.
- **Manajer Proyek (Project Manager):** Untuk alokasi tiket tugas & jadwal siklus rilis.
