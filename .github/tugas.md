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

## ✅ Task 1 — Perbaiki pop up menu profile dan notifikasi

### Problem

- Pop up menu profile dan notifikasi saat ini memiliki beberapa masalah, tenggelam atau tertutup oleh elemen lain.

### Objective

- Memperbaiki pop up menu profile dan notifikasi agar selalu muncul di atas elemen lain, memastikan pengguna dapat mengaksesnya dengan mudah.

### Expected Behavior

- Pop up menu profile dan notifikasi harus selalu muncul di atas elemen lain, tidak tertutup oleh elemen lain, dan dapat diakses dengan mudah oleh pengguna.

### Implementation Details and Workflow

- Periksa struktur HTML dan CSS yang digunakan untuk pop up menu profile dan notifikasi.
- Pastikan elemen pop up memiliki properti CSS `z-index` yang lebih tinggi daripada elemen lain di halaman.
- Uji perubahan pada berbagai resolusi layar untuk memastikan pop up tetap dapat diakses dengan baik.

### Constraints

- Pastikan perubahan tidak mengganggu fungsionalitas yang sudah ada untuk pengguna saat ini.
- Gunakan pola desain yang sudah ada di aplikasi untuk menjaga konsistensi kode, dan desain UI/UX.
- Pastikan layout yang dibuat responsif dan dapat diakses di berbagai perangkat dengan doktrin mobile-first.

### Files Involved

- .github/image.png

---

## ✅ Task 2 — Perbaiki aksi products tab action

### Problem

- Aksi pada products tab saat ini tidak berfungsi dengan baik, menyebabkan pengguna kesulitan dalam mengelola produk dan icon aksi tidak terlihat atau tidak responsif.

### Objective

- Memperbaiki aksi pada products tab agar berfungsi dengan baik, memastikan pengguna dapat mengelola produk dengan mudah dan icon aksi terlihat serta responsif.

### Expected Behavior

- Aksi pada products tab harus berfungsi dengan baik, memungkinkan pengguna untuk mengelola produk dengan mudah, dan icon aksi harus terlihat serta responsif di berbagai perangkat.

### Implementation Details and Workflow

- Periksa kode yang menangani aksi pada products tab, pastikan event handler terpasang dengan benar.
- Pastikan icon aksi memiliki ukuran dan posisi yang sesuai agar terlihat jelas.
- Uji perubahan pada berbagai resolusi layar untuk memastikan aksi dan icon tetap dapat diakses dengan baik.

### Constraints

- Pastikan perubahan tidak mengganggu fungsionalitas yang sudah ada untuk pengguna saat ini.
- Gunakan pola desain yang sudah ada di aplikasi untuk menjaga konsistensi kode, dan desain UI/UX.
- Pastikan layout yang dibuat responsif dan dapat diakses di berbagai perangkat dengan doktrin mobile-first.

### Files Involved

- resources/js/Pages/admin/components/tabs/ProductsTab.tsx

---

--- END OF TASK LIST ---
