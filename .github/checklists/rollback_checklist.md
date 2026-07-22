# ⏪ DAFTAR PERIKSA PEMBATALAN RILIS (ROLLBACK CHECKLIST)

Gunakan daftar periksa darurat ini jika rilis baru di **Sistem Utama Aktif (`main`)** mengalami kendala kritis dan tidak dapat diperbaiki secara kilat.

---

## 🚨 1. Keputusan Pembatalan (Trigger Rollback)
- [ ] Terjadi masalah fatal yang menghentikan operasional transaksi pelanggan.
- [ ] Tim Teknis mengonfirmasi bahwa perbaikan darurat (*Hotfix*) membutuhkan waktu lebih dari 1 jam.
- [ ] Pemimpin Teknis & Manajer Proyek memberikan persetujuan tertulis untuk melakukan Pembatalan Rilis (*Rollback*).

## ⚡ 2. Eksekusi Pembatalan Sistem
- [ ] Jalankan skrip pembatalan otomatis untuk mengembalikan pointer versi ke penanda rilis sebelumnya (contoh: dari `v1.2.0` kembali ke `v1.1.9`).
- [ ] Kembalikan struktur basis data (*Database Migration Rollback*) jika rilis baru mengubah struktur data.
- [ ] Bersihkan cache sistem (*System Cache Purge*) agar pengguna tidak menyimpan draf tampilan yang rusak.

## 🔍 3. Verifikasi Pasca-Pembatalan
- [ ] Akses sistem aktif pelanggan dan pastikan fungsi bisnis kembali berjalan normal seperti versi sebelumnya.
- [ ] Buat ruang investigasi khusus dari kodingan yang bermasalah untuk diteliti oleh tim pengembang tanpa mengganggu pelanggan.
- [ ] Kirimkan pemberitahuan resmi ke Manajemen bahwa sistem telah berhasil distabilkan kembali.
