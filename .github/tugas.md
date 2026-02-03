# POS System named PayTo - Task List

**Target AI Agent:** GPT-5.2 Codex  
**Stack Context:** Laravel (API) + React + TypeScript (Inertia POS)

---

## General Context

Aplikasi POS saat ini memiliki beberapa kekurangan pada **flow checkout**, **invoice**, **discount handling**, serta **UI/UX pada halaman admin dan kasir**.  
Seluruh tugas di bawah harus dikerjakan **tanpa menambah kompleksitas yang tidak perlu**, tetap menjaga **backward compatibility**, dan **menggunakan struktur file serta pola arsitektur yang sudah ada**.

⚠️ Jangan membuat asumsi bisnis baru di luar data dan field yang sudah tersedia di backend.  
⚠️ Seluruh perhitungan harga (diskon, total, dll) **harus bersumber dari backend**, frontend hanya menampilkan hasil.
⚠️ Jika memerlukan konteks database, kamu bisa melihat pada bagian migration laravel, atau model Eloquent yang bersangkutan atau file bernama 'pos_system.sql'. BACA HANYA JIKA MEMERLUKAN KONTEXT DATABASE SAJA.

---

## ✅ Task 1 — Do implementation about refund for sales transaction

### Problem

- Saat ini aplikasi POS tidak memiliki fitur refund untuk transaksi penjualan, yang menyebabkan kesulitan dalam mengelola pengembalian barang dan uang kepada pelanggan khusus pada toko berjenis retail, jika F&B tidak bisa mengaktifkan fitur refund.
- Hal ini dapat mengakibatkan ketidakpuasan pelanggan dan kesulitan dalam pelacakan keuangan.

### Objective

- Menambahkan fitur refund pada transaksi penjualan di aplikasi POS untuk memudahkan pengelolaan pengembalian barang dan uang kepada pelanggan.

### Expected Behavior

- Pengguna dapat memilih transaksi penjualan yang ingin direfund dari histori transaksi.
- Pengguna dapat memilih item yang akan direfund dan memasukkan jumlah refund.
- Sistem akan memperbarui stok barang secara otomatis setelah refund dilakukan.
- Sistem akan mencatat transaksi refund untuk pelacakan keuangan.
- maksimal refund adalah sesuai dengan total pembayaran pada transaksi penjualan dan pengembalian dalam masa garansi (misal 2 hari, bisa dicustom oleh admin).

### Implementation Details and Workflow

- Tambahkan tombol "Refund" pada halaman detail transaksi penjualan di frontend.
- Saat tombol "Refund" diklik, tampilkan form untuk memilih item yang akan direfund dan jumlah refund adalah sesuai harga item tidak termasuk pajak.
- Sesuaikan backend untuk memproses refund, memperbarui stok barang, dan mencatat transaksi refund.
- Pastikan seluruh perhitungan harga (termasuk pajak dan diskon) tetap bersumber dari backend.
- Uji coba fitur refund untuk memastikan fungsionalitas berjalan dengan baik.
- Pastikan fitur refund memerlukan SPV atau admin untuk melakukan proses refund.

### Constraints

- Pastikan perubahan tidak mengganggu fungsionalitas yang sudah ada untuk pengguna saat ini.
- Gunakan pola desain yang sudah ada di aplikasi untuk menjaga konsistensi kode, dan desain UI/UX.
- Pastikan layout yang dibuat responsif dan dapat diakses di berbagai perangkat dengan doktrin mobile-first.

### Files Involved

- `routes/web.php`
- `app/Http/Controllers/Api/*`
- `app/Models/Transaction.php`
- `resources/js/Pages/Pos/components/views/HistoryView.tsx`
- Context: kamu bisa menambahkan file baru jika diperlukan sesuai dengan kebutuhan implementasi. dan pastikan untuk mendokumentasikan file baru tersebut di dalam kode, berikan dokumentasi singkat saja 1-2 kalimat pada bagian atas file baru tersebut.

---

## ✅ Task 2 — Implementation Approval page for Supervisor

### Problem

- Saat ini aplikasi POS memiliki hanya frontend approval untuk supervisor, namun belum ada halaman khusus untuk mengelola approval tersebut. Tidak ada fitur backend yang mendukung pengelolaan approval oleh supervisor.
- Hal ini menyulitkan supervisor dalam mengelola dan memantau approval yang diberikan kepada kasir.

### Objective

- Mengimplementasikan Backend, API, dan Frontend halaman khusus untuk supervisor dalam mengelola approval di aplikasi POS.

### Expected Behavior

- Supervisor dapat mengakses halaman khusus untuk melihat daftar approval yang diberikan kepada kasir.
- Supervisor dapat menyetujui atau menolak permintaan approval dari kasir melalui halaman tersebut
- Sistem akan mencatat tindakan approval yang dilakukan oleh supervisor untuk pelacakan.
- Sistem dapat mengirim notifikasi kepada kasir tentang status approval mereka dan mengirim notifikasi request approval kepada supervisor.
- Opsional: Sistem dapat memberikan rekomendasi, sebaiknya ditolak atau disetujui (kamu bisa membaca aplikasi ini untuk menentukan berdasarkan apa sistem rekomendasi ini).

### Implementation Details and Workflow

- Tambahkan rute baru di backend untuk mengelola approval.
- Buat controller baru untuk menangani logika approval.
- Buat model baru jika diperlukan untuk menyimpan data approval.
- Perbaiki halaman frontend khusus untuk supervisor agar dapat menampilkan daftar approval dan memungkinkan tindakan approve/deny (`resources/js/Pages/admin/components/tabs/ApprovalsTab.tsx`).

### Constraints

- Pastikan perubahan tidak mengganggu fungsionalitas yang sudah ada untuk pengguna saat ini.
- Gunakan pola desain yang sudah ada di aplikasi untuk menjaga konsistensi kode, dan desain UI/UX.
- Pastikan layout yang dibuat responsif dan dapat diakses di berbagai perangkat dengan doktrin mobile-first.

### Files Involved

- `routes/web.php`
- `app/Http/Controllers/Api/ApprovalController.php` *new file*
- `app/Models/Approval.php`
- `resources/js/Pages/admin/components/tabs/ApprovalsTab.tsx`
- Context: kamu bisa menambahkan file baru jika diperlukan sesuai dengan kebutuhan implementasi. dan pastikan untuk mendokumentasikan file baru tersebut di dalam kode, berikan dokumentasi singkat saja 1-2 kalimat pada bagian atas file baru tersebut.

---

# NOTES

Untuk setiap task yang saya berikan dari 1-3 merupakan task yang berkelanjutan dan saling terkait,
mohon untuk mengerjakan setiap task dengan urutan dari 1 hingga 3 sesuai dengan nomor task yang diberikan. Implementasikan setiap task harus mempertimbangkan task sebelumnya agar integrasi berjalan dengan baik. Pastikan untuk melakukan testing menyeluruh setelah menyelesaikan setiap task sebelum melanjutkan ke task berikutnya. Kamu diberikan akses penuh ke seluruh kode sumber aplikasi POS ini untuk menyelesaikan task yang diberikan dan melakukan command terminal non-destructive.
Before implementing the next task, make sure the previous task is fully functional and integrated properly. and I will review each task after you complete one task cuz this task is big task.
