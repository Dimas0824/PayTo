# Panduan Cara Melakukan (How-to Guides)

Panduan praktis untuk menyelesaikan tugas-tugas spesifik dalam PayTo POS. Setiap panduan memberikan langkah-langkah jelas untuk mencapai tujuan tertentu.

---

## Daftar Panduan

### Manajemen Produk dan Inventori
**[Mengelola Produk](./manage-products.md)**  
Panduan lengkap untuk menambah, mengubah, dan menghapus produk. Termasuk cara mengelola stok, kategori, dan melihat alert stok menipis.

**Topik yang dicakup:**
- Menambah produk baru via API admin
- Mengubah detail produk dan stok
- Melihat alert low stock
- Menggunakan rekomendasi restock
- Menghapus produk

---

### Workflow dan Approval
**[Workflow Approval Refund](./approval-workflow.md)**  
Cara menangani proses approval untuk transaksi refund dari kasir ke supervisor.

**Topik yang dicakup:**
- Submit refund request dari POS
- Approve/reject refund sebagai supervisor
- Memeriksa status approval
- Melihat riwayat approval

---

### Sinkronisasi dan Offline Mode
**[Setup Offline Sync](./offline-sync-setup.md)**  
Panduan mengkonfigurasi dan menggunakan fitur sinkronisasi offline untuk PWA.

**Topik yang dicakup:**
- Instalasi PWA di perangkat
- Cara kerja offline queue
- Submit batch transaksi
- Menangani sync failures
- Idempotency dengan local_txn_uuid

---

### Manajemen Pengguna
**[Manajemen Staf](./staff-management.md)**  
Cara mengelola kasir dan supervisor dalam sistem.

**Topik yang dicakup:**
- Membuat kasir/supervisor baru
- Reset PIN staf
- Menonaktifkan staf
- Melihat aktivitas staf

---

### Notifikasi
**[Push Notifications](./push-notifications.md)**  
Cara setup dan mengelola notifikasi push untuk aplikasi.

**Topik yang dicakup:**
- Generate VAPID keys
- Subscribe ke notifikasi
- Mengirim test notification
- Menangani notification permissions

---

## Tips Penggunaan Panduan

- **Pilih panduan yang sesuai** dengan tugas yang ingin Anda selesaikan
- **Ikuti langkah-langkah secara berurutan** untuk hasil terbaik
- **Gunakan contoh kode** yang disediakan sebagai template
- **Periksa expected output** untuk memverifikasi setiap langkah

---

## Butuh Bantuan Lain?

- **Memulai dari awal?** Lihat [Tutorial](../tutorials/getting-started.md)
- **Mencari detail teknis?** Cek [Referensi API](../reference/api.md)
- **Ingin memahami konsep?** Baca [Penjelasan](../explanation/index.md)
- **Kembali ke halaman utama** [Dokumentasi](../index.md)
