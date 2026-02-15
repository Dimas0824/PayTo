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

## ✅ Task 1 — Lakukan setup untuk mendukung pengembangan Fitur PWA (Progressive Web App) pada aplikasi POS

### Problem

- PWA (Progressive Web App) adalah teknologi yang memungkinkan aplikasi web untuk memberikan pengalaman seperti aplikasi native, termasuk kemampuan offline, push notifications, dan akses ke fitur perangkat. Saat ini, aplikasi POS belum mendukung fitur PWA, yang dapat meningkatkan pengalaman pengguna dan memperluas aksesibilitas.

### Objective

- Melakukan setup untuk mendukung pengembangan fitur PWA pada aplikasi POS, sehingga aplikasi dapat diakses secara offline, memberikan pengalaman pengguna yang lebih baik, dan memanfaatkan fitur perangkat.
- do best practice untuk setup PWA di Laravel + React + TypeScript (Inertia POS).

### Expected Behavior

- Aplikasi POS dapat diakses secara offline dengan menggunakan service worker.
- Pengguna dapat menerima push notifications dari aplikasi POS.
- Aplikasi POS dapat diinstal sebagai aplikasi native di perangkat pengguna.

### Implementation Details and Workflow

- Tambahkan file `manifest.json` di root direktori proyek untuk mendefinisikan metadata aplikasi PWA.
- Implementasikan service worker untuk mengelola caching dan memungkinkan akses offline.
- Integrasikan push notifications menggunakan Web Push API.
- Pastikan bahwa setup PWA tidak mengganggu fungsionalitas yang sudah ada dan tetap menjaga konsistensi kode dan desain UI/UX.

### Constraints

- Pastikan perubahan tidak mengganggu fungsionalitas yang sudah ada untuk pengguna saat ini.
- Gunakan pola desain yang sudah ada di aplikasi untuk menjaga konsistensi kode, dan desain UI/UX.
- Pastikan layout yang dibuat responsif dan dapat diakses di berbagai perangkat dengan doktrin mobile-first.

### Files Involved

- belum ada file yang dibuat, silakan buat file baru sesuai kebutuhan untuk setup PWA.

---

--- END OF TASK LIST ---
