# 📋 DAFTAR PERIKSA PENERBITAN SISTEM (DEPLOYMENT CHECKLIST)

Gunakan daftar periksa ini setiap kali akan menerbitkan sistem baru ke **Sistem Utama Aktif (`main`)**.

---

## 🕒 Pra-Penerbitan (Sebelum Tombol Ditekan)
- [ ] Dokumen UAT (*User Acceptance Test*) di Ruang Simulasi (`staging`) telah ditandatangani oleh Pemilik Bisnis.
- [ ] Cadangan data (*Data Backup*) sistem aktif pelanggan telah dibuat secara menyeluruh.
- [ ] Pengumuman pemeliharaan (*maintenance notification*) telah disampaikan ke pelanggan jika ada potensi gangguan sementara.
- [ ] Kunci rahasia & konfigurasi server (*Environment Variables*) telah dipastikan lengkap dan akurat.

## 🚀 Pelaksanaan Penerbitan (Saat Proses Otomasi Berjalan)
- [ ] Penggabungan ruang kerja dari `staging` ke `main` berhasil dilakukan tanpa kendala.
- [ ] Mesin otomasi penerbitan (CI/CD Pipeline) menyelesaikan proses *build* dan *deploy* dengan status hijau.
- [ ] Penandaan versi rilis (`vX.Y.Z`) telah dibubuhkan secara otomatis di repositori.

## 🔍 Pasca-Penerbitan (Verifikasi Langsung)
- [ ] Tim Uji Coba melakukan pemeriksaan fungsi utama (*Smoke Test*) langsung di sistem aktif pelanggan.
- [ ] Dasbor pemantauan sistem (*Monitoring & Logs*) menunjukkan tidak ada lonjakan pesan kesalahan.
- [ ] Notifikasi rilis berhasil terikirim ke obrolan internal manajemen.
