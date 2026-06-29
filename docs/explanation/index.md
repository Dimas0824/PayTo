# Penjelasan (Explanations)

Pemahaman mendalam tentang konsep, arsitektur, dan keputusan desain dalam PayTo POS. Section ini membahas *mengapa* sistem bekerja dengan cara tertentu, bukan hanya *bagaimana* menggunakannya.

---

## Daftar Penjelasan

### Arsitektur Sistem
**[Architecture](./architecture.md)**  
Gambaran menyeluruh tentang arsitektur PayTo POS, termasuk tech stack, struktur aplikasi, dan pola desain yang digunakan.

**Topik yang dicakup:**
- Tech stack (Laravel 12, React 19, Inertia v2, Tailwind v4)
- Struktur lapisan aplikasi (frontend, backend, database)
- Request/response flow
- Strategi authentication
- Role-based access control (RBAC)

---

### Mekanisme Sinkronisasi
**[Offline Sync](./offline-sync.md)**  
Penjelasan detail tentang bagaimana PayTo menangani transaksi offline dan sinkronisasi data.

**Topik yang dicakup:**
- Mengapa offline-first penting untuk POS
- Strategi penyimpanan IndexedDB
- Protocol batch sync
- Idempotency dengan local_txn_uuid
- Conflict resolution
- Status tracking (PROCESSED/DUPLICATE/FAILED)

---

### Keamanan dan Akses
**[Authentication](./authentication.md)**  
Penjelasan lengkap tentang sistem autentikasi dan otorisasi dalam PayTo POS.

**Topik yang dicakup:**
- Dual login method (username/password vs PIN)
- Session management
- Work time tracking otomatis
- Role enforcement (CASHIER vs SUPERVISOR)
- Logout dan session cleanup
- Security best practices

---

### Progressive Web App
**[PWA Strategy](./pwa-strategy.md)**  
Detail implementasi PWA dan strategi offline capability dalam PayTo.

**Topik yang dicakup:**
- Service worker architecture
- Manifest configuration
- Offline capabilities
- Cache strategies
- App installation flow
- Update mechanism

---

## Mengapa Membaca Explanations?

Dokumen-dokumen dalam section ini membantu Anda:

- **Memahami keputusan desain** yang dibuat dalam sistem
- **Mengetahui trade-offs** dari berbagai pendekatan
- **Mempelajari best practices** yang diterapkan
- **Membuat keputusan yang informed** saat mengembangkan fitur baru
- **Troubleshooting dengan pemahaman yang lebih baik** tentang cara kerja sistem

---

## Target Pembaca

Explanations ditujukan untuk:

- **Developer berpengalaman** yang ingin memahami arsitektur secara mendalam
- **Tech leads** yang perlu membuat keputusan arsitektur
- **Contributors** yang ingin berkontribusi dengan pemahaman penuh
- **DevOps engineers** yang perlu deploy dan maintain aplikasi
- **Technical writers** yang perlu mendokumentasikan sistem

---

## Butuh Bantuan Lain?

- **Baru mulai?** Lihat [Tutorial](../tutorials/getting-started.md)
- **Perlu panduan praktis?** Cek [How-to Guides](../how-to/index.md)
- **Mencari detail teknis?** Baca [Referensi API](../reference/api.md)
- **Kembali ke halaman utama** [Dokumentasi](../index.md)
