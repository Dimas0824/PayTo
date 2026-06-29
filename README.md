# PayTo

<div align="center">

![PayTo Logo](docs/assets/logo.png)

**Sistem Manajemen Homestay & Kos Modern**

[![CI](https://github.com/ORGANIZATION/PayTo/actions/workflows/ci.yml/badge.svg)](https://github.com/ORGANIZATION/PayTo/actions/workflows/ci.yml)
[![Security](https://github.com/ORGANIZATION/PayTo/actions/workflows/security.yml/badge.svg)](https://github.com/ORGANIZATION/PayTo/actions/workflows/security.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PHP Version](https://img.shields.io/badge/php-%3E%3D8.2-8892BF.svg)](https://php.net/)
[![Laravel Version](https://img.shields.io/badge/laravel-12.x-FF2D20.svg)](https://laravel.com/)
[![Code Style](https://img.shields.io/badge/code%20style-pint-orange.svg)](https://laravel.com/docs/pint)

[Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Contributing](#contributing) • [License](#license)

</div>

---

## 📋 Tentang PayTo

PayTo adalah sistem manajemen homestay dan kos yang komprehensif, dirancang untuk mempermudah pengelolaan properti, pembayaran, dan interaksi antara owner, admin, dan resident.

### ✨ Key Features

- 🏠 **Manajemen Unit Kamar** - Kelola kamar dengan berbagai tipe dan fasilitas
- 💰 **Sistem Keuangan** - Invoice, pembayaran, dan tracking transaksi lengkap
- 📊 **Dashboard Analytics** - Insight mendalam tentang performa properti
- 👥 **Multi-Role System** - Owner, Admin, dan Resident dengan hak akses berbeda
- 🔔 **Notifikasi Real-time** - Push notifications untuk event penting
- 📱 **Responsive Design** - Akses dari desktop maupun mobile
- 🔒 **Keamanan Terjamin** - Enkripsi, CSRF protection, dan audit trail
- 📝 **Approval Workflow** - Sistem persetujuan bertingkat untuk transaksi

## 🚀 Quick Start

### Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 20.x+
- MySQL 8.0+ / PostgreSQL 13+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/ORGANIZATION/PayTo.git
cd PayTo

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database
php artisan migrate --seed

# Build assets
npm run build

# Start development server
composer run dev
```

Aplikasi akan berjalan di `http://localhost:8000`

**Default Login:**
- Email: `admin@payto.test`
- Password: `password`

📖 Lihat [Getting Started Guide](docs/tutorials/getting-started.md) untuk instruksi lengkap.

## 📚 Documentation

Dokumentasi lengkap tersedia di folder [`docs/`](docs/):

- **[Getting Started](docs/tutorials/getting-started.md)** - Panduan awal untuk setup dan penggunaan
- **[Architecture](docs/explanation/architecture.md)** - Arsitektur sistem dan design decisions
- **[API Reference](docs/reference/api.md)** - Dokumentasi API endpoints
- **[Database Schema](docs/reference/database-schema.md)** - Struktur dan relasi database
- **[How-to Guides](docs/how-to/)** - Tutorial untuk fitur-fitur spesifik

## 🏗️ Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **MySQL 8.0** - Database
- **Laravel MCP** - Model Context Protocol

### Frontend
- **React 19** - UI Library
- **Inertia.js v2** - Modern monolith approach
- **Tailwind CSS v4** - Utility-first CSS
- **Lucide React** - Icon library
- **Vite** - Build tool

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** (optional) - Containerization
- **Laravel Pint** - Code styling
- **PHPUnit** - Testing

## 🤝 Contributing

Kami sangat menghargai kontribusi dari komunitas! Ada banyak cara untuk berkontribusi:

- 🐛 [Laporkan bug](https://github.com/ORGANIZATION/PayTo/issues/new?template=bug_report.md)
- 💡 [Usulkan fitur](https://github.com/ORGANIZATION/PayTo/issues/new?template=feature_request.md)
- 📖 Perbaiki atau tambahkan dokumentasi
- 💻 Submit pull request

Sebelum berkontribusi, mohon baca [Contributing Guidelines](CONTRIBUTING.md) dan [Code of Conduct](CODE_OF_CONDUCT.md).

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ...

# Run tests
php artisan test

# Check code style
vendor/bin/pint --test

# Build assets
npm run build

# Commit changes (use conventional commits)
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage --min=80

# Run specific test
php artisan test --filter=PaymentTest

# Run tests in parallel
php artisan test --parallel
```

## 📦 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` dan `APP_DEBUG=false`
- [ ] Generate strong `APP_KEY`
- [ ] Configure database credentials
- [ ] Set up queue workers
- [ ] Configure cron for scheduled tasks
- [ ] Enable HTTPS dengan valid SSL certificate
- [ ] Set up backup strategy
- [ ] Configure monitoring dan logging

Lihat [Deployment Guide](docs/how-to/deployment.md) untuk instruksi lengkap.

## 🔒 Security

Keamanan adalah prioritas kami. Jika Anda menemukan vulnerability, **JANGAN** laporkan melalui public issues.

Kirim laporan ke: **security@payto.example.com**

Lihat [Security Policy](SECURITY.md) untuk detail lengkap.

## 📊 Project Status

- ✅ **Active Development** - Aktif dikembangkan dan maintained
- 🔄 **Version**: 1.0.0
- 📅 **Last Updated**: 2026-06-29

### Roadmap

- [x] Core homestay management
- [x] Financial system
- [x] Multi-role authentication
- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Advanced analytics dashboard
- [ ] Multi-property support
- [ ] API for third-party integrations

Lihat [Project Board](https://github.com/ORGANIZATION/PayTo/projects) untuk detail.

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- Laravel Team untuk framework yang luar biasa
- Inertia.js Team untuk modern monolith approach
- Tailwind Labs untuk utility-first CSS
- Semua [contributors](CONTRIBUTORS.md) yang telah membantu

## 📞 Support & Community

- 📧 Email: support@payto.example.com
- 💬 [GitHub Discussions](https://github.com/ORGANIZATION/PayTo/discussions)
- 🐛 [Issue Tracker](https://github.com/ORGANIZATION/PayTo/issues)
- 📖 [Documentation](docs/)

---

<div align="center">

**[⬆ back to top](#payto)**

Made with ❤️ by the PayTo Team

</div>
