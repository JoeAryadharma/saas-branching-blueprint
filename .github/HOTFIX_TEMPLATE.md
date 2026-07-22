# 🚨 FORMULIR PERBAIKAN DARURAT (HOTFIX REPORT)

**ID Kejadian Darurat:** `HOTFIX-[TANGGAL]-[KODE-MASALAH]`  
**Penanggung Jawab Penanganan:** [Nama Pemimpin Teknis / Senior Dev]  
**Waktu Mulai Penanganan:** [Jam:Menit]  
**Waktu Selesai Penanganan:** [Jam:Menit]  

---

## 🔍 Analisis Masalah Kritis di Sistem Aktif
*Penjelasan ringkas mengenai kendala fatal yang terjadi di sistem aktif pelanggan.*

- **Dampak Bisnis:** [Contoh: Pelanggan gagal melakukan pembayaran online selama 30 menit]
- **Akar Penyebab Masalah:** [Penjelasan penyebab terjadinya kendala]

---

## 🛠️ Solusi Perbaikan Kilat
*Penjelasan tindakan perbaikan darurat yang diterapkan pada ruang kerja `hotfix/*`.*

---

## 📋 Daftar Periksa Jalur Darurat
- [ ] Perbaikan dites di lingkungan simulasi internal dan berjalan stabil.
- [ ] Perbaikan digabungkan langsung ke Ruang Utama (`main`) untuk pengaktifan kilat.
- [ ] Perbaikan dikembalikan (*sync*) ke Ruang Integrasi Tim (`develop`) agar tim tidak mengulangi kesalahan.
- [ ] Penandaan versi patch (`vX.Y.Z+1`) telah diperbarui.
- [ ] Laporan pasca-kejadian (*Post-Mortem*) diserahkan ke Manajemen.
