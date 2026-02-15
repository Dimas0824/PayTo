# PayTo POS

PayTo adalah aplikasi Point of Sale (POS) berbasis **Laravel 12 + React (Inertia)** dengan fokus pada operasional kasir, manajemen admin, dukungan PWA, sinkronisasi transaksi offline, dan notifikasi push.

Dokumen ini adalah **dokumentasi teknis project** untuk developer.

Untuk dokumentasi aplikasi (product overview + galeri), lihat README terpisah di luar folder project.

## Ringkasan Fitur

- POS kasir (checkout, histori transaksi, profil kasir)
- Login dengan **username/password** atau **PIN 6 digit**
- Dashboard admin (ringkasan penjualan, aktivitas terbaru, low stock)
- CRUD produk dan manajemen stok
- Rekomendasi restock berbasis penjualan 7 hari
- Approval/refund flow (supervisor approval)
- Manajemen staf (cashier/supervisor) dan reset PIN
- Pengaturan struk & pengaturan printer
- PWA + offline queue sync (`/api/pos/sync/batches`)
- Web Push Notification (VAPID)

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: React 19, Inertia.js React, TypeScript
- Build Tool: Vite 7
- Styling: Tailwind CSS v4
- HTTP Client: Axios
- Push: `minishlink/web-push`
- DB default: SQLite (bisa diganti ke MySQL/PostgreSQL)

## Arsitektur Singkat

- `routes/web.php`: route halaman Inertia (`/`, `/login`, `/kasir`, `/admin`)
- `routes/api.php`: endpoint data POS/Admin/Push
- `resources/js/Pages`: UI page-level (landing, login, kasir, admin)
- `app/Http/Controllers/Api`: endpoint bisnis admin/POS
- `app/Services/Pos/CheckoutProcessor.php`: core logic checkout
- `resources/js/pwa`: service worker registration, offline queue, push subscribe

## Prasyarat

- PHP `>= 8.2`
- Composer `>= 2.x`
- Node.js `>= 20` + npm
- Ekstensi PHP umum Laravel (pdo, mbstring, openssl, dll)

## Setup Lokal

1. Install dependency backend dan frontend:

```bash
composer install
npm install
```

1. Siapkan environment:

```bash
cp .env.example .env
php artisan key:generate
```

1. Siapkan database (default SQLite):

```bash
touch database/database.sqlite
php artisan migrate --seed
```

1. Jalankan aplikasi (disarankan):

```bash
composer dev
```

Perintah di atas menjalankan:

- `php artisan serve`
- `npm run dev`
- `php artisan queue:listen`

Alternatif manual:

```bash
php artisan serve
npm run dev
```

## Script Penting

- `composer setup`: bootstrap cepat untuk environment production-like
- `composer dev`: jalankan server + queue + vite secara paralel
- `composer test`: clear config lalu jalankan test suite
- `npm run dev`: vite dev server
- `npm run build`: build asset production

## Variabel Environment Penting

Lihat `.env.example` untuk nilai default. Yang paling relevan:

- `APP_NAME`, `APP_ENV`, `APP_URL`
- `DB_CONNECTION` (+ host/port/name/user/pass jika non-sqlite)
- `SESSION_DRIVER`, `QUEUE_CONNECTION`, `CACHE_STORE`
- `WEBPUSH_VAPID_SUBJECT`
- `WEBPUSH_VAPID_PUBLIC_KEY`
- `WEBPUSH_VAPID_PRIVATE_KEY`

Catatan push notification:

- Public key disuntik ke `<meta name="webpush-public-key">` di `resources/views/app.blade.php`
- Service worker di `public/sw.js`

## Peta Endpoint

### Web

- `GET /` -> landing page
- `GET /login` -> halaman login
- `POST /login` -> proses login POS
- `GET /kasir` -> halaman kasir
- `GET /admin` -> halaman admin

### API Admin (contoh utama)

- `GET /api/admin/dashboard`
- `GET|POST|PUT|DELETE /api/admin/products[/{product}]`
- `GET /api/admin/inventory/recommendations`
- `GET|PUT /api/admin/receipt-settings`
- `GET /api/admin/approvals`
- `POST /api/admin/approvals/{approval}/approve`
- `POST /api/admin/approvals/{approval}/reject`
- `GET|POST|PUT|DELETE /api/admin/staff[/{user}]`
- `POST /api/admin/staff/{user}/reset-pin`

### API POS / PWA

- `GET /api/pos/products`
- `GET /api/pos/history`
- `GET /api/pos/profile`
- `POST /api/pos/checkout`
- `POST /api/pos/refunds`
- `POST /api/pos/logout`
- `GET /api/pos/settings`
- `POST /api/pos/settings/printer`
- `POST /api/pos/settings/printer/test`
- `POST /api/pos/settings/refresh`
- `POST /api/pos/sync/batches`

### API Push

- `POST /api/push/subscriptions`
- `DELETE /api/push/subscriptions`
- `POST /api/push/test`

## Testing

Jalankan semua test feature/unit:

```bash
composer test
```

Beberapa cakupan test yang sudah ada:

- Dashboard admin metrics
- CRUD produk + stok
- Sync batch idempotency (`PROCESSED`/`DUPLICATE`/`FAILED`)
- Refund + approval flow
- Receipt settings
- Staff management + reset PIN
- Push subscription

## Build Production

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm run build
```

Pastikan:

- environment production sudah benar
- worker queue aktif (untuk proses async jika dibutuhkan)
- kunci VAPID terpasang bila fitur push dipakai

## Struktur Folder Inti

```text
app/
  Http/
  Models/
  Services/Pos/
resources/
  js/
    Pages/
    pwa/
  views/
routes/
  web.php
  api.php
public/
  sw.js
  manifest.json
database/
  migrations/
  seeders/
tests/
  Feature/
```

## Catatan

- Dokumentasi ini fokus untuk pengembangan dan operasional project.
- Dokumentasi aplikasi (non-teknis + galeri) dipisah pada README di luar folder project agar konteks tidak tercampur.
- **Aplikasi ini masih dalam tahap pengembangan, jadi beberapa fitur mungkin belum lengkap atau masih dalam iterasi. Dokumentasi akan terus diperbarui seiring perkembangan project.**
- **Untuk pertanyaan atau kontribusi, silakan hubungi tim pengembang melalui issue atau pull request di repository.**
