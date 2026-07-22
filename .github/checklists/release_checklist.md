# 📦 DAFTAR PERIKSA PEMBEKUAN & RILIS (RELEASE CHECKLIST)

Gunakan daftar periksa ini pada fase **Ruang Penutupan (`close-packing`)** sebelum masuk ke ruang simulasi.

---

## 🔒 1. Tahap Pembekuan Fitur (Feature Freeze)
- [ ] Pengikutsertaan fitur baru di Ruang Integrasi Tim (`develop`) dihentikan sementara.
- [ ] Ruang Penutupan (`close-packing`) dibuat secara resmi dari `develop`.
- [ ] Pengembang diinstruksikan bahwa hanya perbaikan bug sisa yang diizinkan masuk ke ruang ini.

## 🧪 2. Tahap Uji Coba Kelaikan & Keamanan
- [ ] Tim QA menyelesaikan pengujian regresi penuh (*Full Regression Testing*).
- [ ] Pemindaian keamanan otomatis (*Security Scan*) tidak menemukan celah ancaman kategori Tinggi atau Kritis.
- [ ] Pengujian beban (*Load Testing*) memastikan server mampu menangani kapasitas pengguna harian.

## 📝 3. Tahap Penyiapan Berkas Rilis
- [ ] Berkas Catatan Riwayat (`CHANGELOG.md`) diperbarui dengan daftar fitur dan perbaikan terbaru.
- [ ] Draf Catatan Penerbitan (`RELEASE_NOTES.md`) telah disetujui oleh Manajer Proyek.
- [ ] Pengajuan ke Ruang Simulasi (`staging`) dibuat dan siap diuji oleh Pemilik Bisnis.
