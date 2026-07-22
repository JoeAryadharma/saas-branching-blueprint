# 📜 PANDUAN KONTRIBUSI & TATA CARA KERJA TIM

Dokumen ini berisi standar operasional prosedur (SOP) bagi seluruh anggota tim yang ingin menambahkan atau memperbaiki pekerjaan di tempat penyimpanan proyek ini.

---

## 🛠️ Langkah-Langkah Memulai Pekerjaan Fitur Baru

1. **Pastikan Ada Tiket Tugas:**
   Jangan pernah mengerjakan sesuatu tanpa ada tiket resmi yang terdaftar di Sistem Manajemen Pekerjaan dan disetujui oleh Manajer Operasional/Proyek.

2. **Buat Ruang Kerja Mandiri (`feature/*`):**
   * Selalu tarik pembaruan terbaru dari Ruang Penggabungan Tim (`develop`).
   * Buat ruang kerja baru dengan penamaan standar: `feature/NOMOR-TIKET-deskripsi-singkat`.
   * *Contoh:* `feature/TK-204-laporan-penjualan-excel`

3. **Simpan Catatan Perkembangan Pekerjaan (Commit):**
   * Lakukan penyimpanan secara berkala setiap kali 1 bagian pekerjaan selesai.
   * Gunakan kalimat bahasa bisnis yang jelas dan informatif.

4. **Ajukan Pemeriksaan Pekerjaan (Pull Request / PR):**
   * Setelah pekerjaan selesai dan dites secara mandiri, buka formulir *Pull Request* dari ruang kerja Anda menuju ke `develop`.
   * Isi seluruh lembar daftar periksa (checklist) di dalam formulir pengajuan.
   * Tag 2 orang staf senior untuk memeriksa kelayakan hasil pekerjaan Anda.

---

## 🚫 Hal-Hal Yang Dilarang Keras

1. **Dilarang menyimpan pekerjaan langsung di Ruang Utama (`main`) atau Ruang Simulasi (`staging`).**
2. **Dilarang memasukkan kode yang belum diuji secara mandiri.**
3. **Dilarang menggabungkan pekerjaan sendiri tanpa adanya persetujuan dari penanggung jawab modul (CODEOWNERS).**
4. **Dilarang membiarkan bentrok hasil kerja (*code conflict*) tanpa diselesaikan terlebih dahulu di ruang kerja masing-masing.**

---

## ⚖️ Etika & Standar Kualitas

* **Saling Meninjau dengan Konstruktif:** Saat memeriksa pekerjaan rekan tim, berikan masukan yang santun dan berfokus pada kualitas solusi bisnis.
* **Tepat Waktu:** Jika pekerjaan terhambat, segera sampaikan pada rapat koordinasi harian (*Standup Meeting*) agar dapat dibantu oleh anggota tim lain.
