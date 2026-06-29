# Login Flow - Testing Guide

## 🎯 Login Flow yang Sudah Dikonfigurasi

### Routes
- **Landing Page**: `GET /` (public)
- **Login Page**: `GET /login` (guest only)
- **Login Submit**: `POST /login` (guest only, rate limited: 5/min)
- **Kasir Dashboard**: `GET /kasir` (auth + role: CASHIER atau SUPERVISOR)
- **Admin Dashboard**: `GET /admin` (auth + role: SUPERVISOR only)

### Flow Diagram
```
Landing Page (/)
      ↓
  [Klik "Masuk"]
      ↓
Login Page (/login)
      ↓
  [Submit Credentials/PIN]
      ↓
POST /login → PosLoginController
      ↓
   [Auth Check]
      ↓
   ┌─────────────┐
   │   Success   │
   └─────────────┘
         ↓
    Check Role:
    ├─ CASHIER → redirect /kasir
    └─ SUPERVISOR → redirect /admin
```

---

## 🔐 Login Methods

### 1. **Credentials Login** (Username + Password)
```json
POST /login
{
  "login_method": "CREDENTIALS",
  "username": "kasir01",
  "password": "password123"
}
```

**Response (Success)**:
```json
{
  "redirect": "/kasir"  // atau "/admin" untuk SUPERVISOR
}
```

**Response (Error)**:
```json
{
  "message": "Kredensial tidak valid."
}
```
Status: `422`

---

### 2. **PIN Login** (6 digit)
```json
POST /login
{
  "login_method": "PIN",
  "pin": "123456"
}
```

**Response**: Same as credentials login

---

## 🧪 Manual Testing

### Test 1: Landing → Login (Guest)
1. Buka browser: `http://localhost:8000`
2. Landing page muncul ✅
3. Klik tombol **"Masuk"**
4. Redirect ke `/login` ✅
5. Login form muncul ✅

### Test 2: Login Kasir
1. Di `/login`, isi form:
   - Username: `kasir01` (atau user CASHIER yang ada di database)
   - Password: sesuai database
2. Klik **"Masuk"**
3. Redirect ke `/kasir` ✅
4. Dashboard kasir muncul ✅

### Test 3: Login Supervisor/Admin
1. Di `/login`, isi form:
   - Username: `admin` (atau user SUPERVISOR yang ada)
   - Password: sesuai database
2. Klik **"Masuk"**
3. Redirect ke `/admin` ✅
4. Admin panel muncul ✅

### Test 4: Role Access Control
**Kasir tidak bisa akses admin:**
1. Login sebagai CASHIER
2. Manual buka: `http://localhost:8000/admin`
3. Error **403 Forbidden** ✅

**Supervisor bisa akses kasir:**
1. Login sebagai SUPERVISOR
2. Manual buka: `http://localhost:8000/kasir`
3. Dashboard kasir muncul ✅

### Test 5: Guest Protection
**Guest tidak bisa akses protected pages:**
1. Logout (atau buka incognito)
2. Manual buka: `http://localhost:8000/kasir`
3. Redirect ke `/login` ✅
4. Manual buka: `http://localhost:8000/admin`
5. Redirect ke `/login` ✅

### Test 6: Authenticated Redirect
**User sudah login tidak bisa ke login page:**
1. Login sebagai CASHIER/SUPERVISOR
2. Manual buka: `http://localhost:8000/login`
3. Redirect ke `/` (landing) ✅

---

## 🔬 Automated Testing

Jalankan test suite lengkap:

```bash
# Test login flow saja
php artisan test --filter=LoginFlowTest

# Test semua authentication & authorization
php artisan test --filter=AuthenticationAuthorizationTest

# Test semua
php artisan test
```

**Test Coverage (LoginFlowTest - 15 tests):**
- ✅ Guest dapat akses landing page
- ✅ Guest dapat akses login page
- ✅ Authenticated user tidak bisa ke login page
- ✅ Kasir login → redirect /kasir
- ✅ Supervisor login → redirect /admin
- ✅ Login dengan PIN
- ✅ Kredensial salah → error 422
- ✅ User inactive tidak bisa login
- ✅ Kasir bisa akses /kasir
- ✅ Supervisor bisa akses /admin
- ✅ Kasir tidak bisa akses /admin (403)
- ✅ Supervisor bisa akses /kasir
- ✅ Guest tidak bisa akses /kasir (redirect login)
- ✅ Guest tidak bisa akses /admin (redirect login)

---

## 🛡️ Rate Limiting

**Login endpoint dilindungi rate limiter:**
- **Limit**: 5 attempts per minute
- **By**: `username + IP address`
- **Response saat limit**: HTTP 429 Too Many Requests

```json
{
  "message": "Too Many Attempts."
}
```

**Testing rate limit:**
1. Coba login 6x dengan kredensial salah dalam 1 menit
2. Request ke-6 akan dapat **429**
3. Tunggu 1 menit, bisa coba lagi

---

## 🚀 Menjalankan Development Server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (untuk hot reload frontend)
npm run dev

# Akses aplikasi
http://localhost:8000
```

---

## 📋 Checklist Verifikasi

### Frontend
- [ ] Landing page load tanpa error
- [ ] Tombol "Masuk" ada dan berfungsi
- [ ] Login page load dengan form lengkap
- [ ] Form submit tidak error console
- [ ] Redirect setelah login berfungsi

### Backend
- [ ] Route `/` accessible
- [ ] Route `/login` accessible (guest)
- [ ] POST `/login` menerima credentials
- [ ] Session dibuat setelah login
- [ ] Middleware `auth` bekerja
- [ ] Middleware `role` bekerja
- [ ] Rate limiter aktif

### Database
- [ ] Tabel `users` ada user dengan role CASHIER
- [ ] Tabel `users` ada user dengan role SUPERVISOR
- [ ] `password_hash` atau `pin_hash` terisi
- [ ] `is_active = 1`

---

## 🐛 Troubleshooting

### Problem: Login redirect ke `/` tapi masih guest
**Solusi**: Check session driver
```bash
# .env
SESSION_DRIVER=database  # atau file
```

### Problem: 403 Forbidden setelah login
**Solusi**: Check role di database
```sql
SELECT id, username, role, is_active FROM users;
```
Role harus uppercase: `CASHIER` atau `SUPERVISOR`

### Problem: PIN login tidak bekerja
**Solusi**: Check `pin_hash` di database
```sql
SELECT id, username, pin_hash FROM users WHERE role = 'CASHIER';
```
Hash harus ada (bcrypt format: `$2y$...`)

### Problem: Rate limit terlalu ketat saat development
**Solusi**: Temporary disable atau naikkan limit
```php
// app/Providers/AppServiceProvider.php
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(100)->by($request->input('username').'|'.$request->ip());
    // ^^ Naikkan jadi 100 untuk development
});
```

---

## ✅ Summary

**Login Flow Status**: ✅ **WORKING**

- Landing page → Login page: ✅
- Login dengan credentials: ✅
- Login dengan PIN: ✅
- Role-based redirect: ✅
- Access control: ✅
- Rate limiting: ✅
- Guest middleware: ✅
- Auth middleware: ✅

**Tidak ada perubahan breaking** dari flow sebelumnya. Hanya ditambahkan:
1. Rate limiting (security)
2. Role middleware (authorization)
3. Automated tests (verification)
