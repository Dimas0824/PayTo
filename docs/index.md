# Selamat Datang di Dokumentasi PayTo POS

PayTo adalah aplikasi Point of Sale (POS) yang dibangun dengan Laravel 12 dan React (Inertia). Dokumentasi ini membantu developer memahami, berkontribusi pada, dan memelihara sistem PayTo.

Ini adalah **dokumentasi teknis** untuk developer yang bekerja pada codebase. Untuk ringkasan produk dan panduan pengguna, silakan lihat dokumentasi aplikasi terpisah.

---

## Struktur Dokumentasi

Kami menggunakan kerangka [Diátasis](https://diataxis.fr/) untuk mengorganisir dokumentasi, memastikan setiap tipe memiliki tujuan spesifik:

### Tutorial
Panduan berorientasi pembelajaran yang membantu Anda memulai. Ikuti langkah demi langkah untuk membangun pemahaman Anda tentang sistem.

### Panduan Cara Melakukan (How-to)
Dokumentasi berorientasi pemecahan masalah. Temukan solusi untuk tugas-tugas spesifik seperti setup sync offline atau manajemen staf.
- **[Panduan Cara Melakukan (How-to)](./how-to/index.md)** - Kumpulan panduan praktis untuk tugas-tugas spesifik
 - [Mengelola Produk](./how-to/manage-products.md) - Cara menambah, mengubah, dan menghapus produk
 - [Workflow Approval](./how-to/approval-workflow.md) - Menangani proses approval refund
 - [Setup Offline Sync](./how-to/offline-sync-setup.md) - Konfigurasi sinkronisasi offline PWA
 - [Manajemen Staf](./how-to/staff-management.md) - Mengelola kasir dan supervisor
 - [Push Notifications](./how-to/push-notifications.md) - Setup dan kelola notifikasi push

### Referensi
Konten berorientasi informasi. Spesifikasi teknis, endpoint API, skema database, dan detail konfigurasi.

### Penjelasan (Explanations)
Konsep dan pemahaman. Diskusi mendalam tentang alasan arsitektur, mekanisme, dan keputusan desain sistem.
- **[Penjelasan (Explanations)](./explanation/index.md)** - Konsep dan pemahaman mendalam sistem
 - [Architecture](./explanation/architecture.md) - Arsitektur sistem dan tech stack
 - [Offline Sync](./explanation/offline-sync.md) - Mekanisme sinkronisasi offline
 - [Authentication](./explanation/authentication.md) - Sistem autentikasi dan otorisasi
 - [PWA Strategy](./explanation/pwa-strategy.md) - Implementasi Progressive Web App

---

## Kontribusi Dokumentasi

- Ikuti struktur kerangka Diátasis
- Gunakan bahasa yang jelas dan ringkas
- Sertakan contoh kode di mana membantu
- Perbarui tutorial, panduan cara melakukan, atau dokumen referensi yang relevan
- Jalankan `composer run lint` sebelum submit

---

## Dukungan

- Lihat [Panduan Cara Melakukan](#panduan-cara-melakukan) untuk tugas-tugas umum
- Review [Penjelasan](#penjelasan) untuk pemahaman arsitektur
- Jelajahi [Referensi API](./reference/api.md) untuk detail endpoint
- Buka issue di GitHub untuk bug atau permintaan fitur

---

**Catatan**: Dokumentasi ini sedang dalam pengembangan. Beberapa bagian mungkin belum lengkap atau sedang dalam proses pembuatan. Periksa secara berkala untuk pembaruan.
