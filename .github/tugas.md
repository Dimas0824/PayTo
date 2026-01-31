# POS System Improvement Tasks — Clear & Non-Ambiguous Prompt  

**Target AI Agent:** GPT-5.2 Codex  
**Stack Context:** Laravel (API) + React + TypeScript (Inertia POS)

---

## General Context

Aplikasi POS saat ini memiliki beberapa kekurangan pada **flow checkout**, **invoice**, **discount handling**, dan **layout UI**.  
Tugas berikut harus dikerjakan **tanpa menambah kompleksitas yang tidak perlu**, menjaga **backward compatibility**, dan menggunakan **struktur file yang sudah ada**.

⚠️ Jangan membuat asumsi bisnis baru tanpa dasar dari data yang sudah tersedia di backend.

---

## ✅ Task 1 — Server-Generated Invoice Number (Critical Flow)

### Problem

Saat ini **invoice number belum diberikan secara tepat waktu**.  
Invoice number **HARUS dibuat & dikirim oleh server** **saat kasir menekan tombol “Confirm Payment”**, bukan setelahnya.

### Expected Behavior

- Invoice number:
  - Dibuat di **backend**
  - Bersifat **authoritative & unique**
  - Dikirim langsung dalam response checkout
- Frontend:
  - Tidak melakukan generate invoice number sendiri
  - Menggunakan invoice number dari API response
  - InvoicePanel menampilkan invoice number **real-time setelah confirm**

### Files Involved

- `app/Http/Controllers/Api/PosCheckoutController.php`
- `resources/js/Pages/Pos/components/CheckoutModal.tsx`
- `resources/js/Pages/Pos/components/InvoicePanel.tsx`

---

## ✅ Task 2 — Discount System (Backend + Frontend Sync)

### Problem

Barang yang memiliki diskon belum diproses dan ditampilkan secara konsisten.

### Backend Requirements

- Jika item memiliki diskon:
  - Hitung diskon di **backend**
  - Pastikan:
    - Diskon per item (bukan global)
    - Aman dari manipulasi frontend
- Response API harus mengembalikan:
  - Harga asli
  - Nilai diskon
  - Harga setelah diskon

### Frontend Requirements

- **InvoicePanel**
  - Menampilkan:
    - Harga asli (opsional: strikethrough)
    - Nilai diskon
    - Harga akhir
- **CartPanel**
  - Menampilkan diskon jika ada
  - Total harga mengikuti hasil backend (bukan hitungan lokal)

### Files Involved

- `app/Http/Controllers/Api/PosCheckoutController.php`
- `resources/js/Pages/Pos/components/InvoicePanel.tsx`
- `resources/js/Pages/Pos/components/CartPanel.tsx`

---

## ✅ Task 3 — QRIS Section Overflow Fix (UI Bug)

### Problem

Pada **Checkout Modal**, section **QRIS** mengalami overflow dan keluar dari container.

### Requirements

- QRIS section:
  - Tidak boleh overflow container
  - Harus tetap responsive
  - Tidak memotong konten penting
- Solusi harus:
  - Menggunakan layout fix (flex/grid/overflow handling)
  - Bukan hard-coded height berbahaya

### Files Involved

- `resources/js/Pages/Pos/components/CheckoutModal.tsx`

---

## ✅ Task 4 — Conditional Cart Panel Visibility

### Problem

Saat user masuk ke:

- **Profile page**
- **Settings page**

`CartPanel` **masih ditampilkan**, padahal tidak dibutuhkan dan mengganggu UX.

### Expected Behavior

- CartPanel:
  - ❌ Tidak ditampilkan di ProfileView
  - ❌ Tidak ditampilkan di SettingsView
  - ✅ Tetap muncul di flow POS normal
- Logic:
  - Berdasarkan **route / view context**
  - Tidak menggunakan hack CSS (display:none)

### Files Involved

- `resources/js/Pages/admin/components/Sidebar.tsx`
- `resources/js/Pages/Pos/components/CartPanel.tsx`
- `resources/js/Pages/Pos/components/views/ProfileView.tsx`
- `resources/js/Pages/Pos/components/views/SettingsView.tsx`

---

## Technical Constraints

- ❌ Jangan membuat component baru jika tidak perlu
- ❌ Jangan memindahkan business logic ke frontend
- ✅ Gunakan existing controller & component structure
- ✅ Perubahan harus:
  - Clean
  - Maintainable
  - Minim regression
  - Layout konsisten dan responsif

---

## Expected Output from AI

- Kode perubahan untuk setiap task
- Penjelasan singkat **per task**
- Tidak menggabungkan solusi antar task secara ambigu

---
