# Contributing to PayTo

Terima kasih atas minat Anda untuk berkontribusi pada PayTo! Dokumen ini berisi panduan untuk membantu Anda memulai.

## Daftar Isi

- [Code of Conduct](#code-of-conduct)
- [Cara Berkontribusi](#cara-berkontribusi)
- [Setup Development Environment](#setup-development-environment)
- [Workflow Development](#workflow-development)
- [Standards dan Conventions](#standards-dan-conventions)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Pelaporan Bug](#pelaporan-bug)
- [Feature Requests](#feature-requests)

## Code of Conduct

Dengan berpartisipasi dalam project ini, Anda setuju untuk mematuhi [Code of Conduct](CODE_OF_CONDUCT.md) kami.

## Cara Berkontribusi

Ada beberapa cara untuk berkontribusi:

1. **Melaporkan bug** - Temukan bug? Buat issue dengan detail lengkap
2. **Mengusulkan fitur** - Ada ide untuk fitur baru? Diskusikan terlebih dahulu
3. **Memperbaiki bug** - Pilih issue yang berlabel `bug` dan `good first issue`
4. **Menambah fitur** - Pastikan sudah disetujui sebelum mulai development
5. **Memperbaiki dokumentasi** - Dokumentasi yang baik sangat membantu
6. **Code review** - Review pull request dari kontributor lain

## Setup Development Environment

### Prerequisites

Pastikan Anda memiliki:
- PHP 8.2 atau lebih tinggi
- Composer 2.x
- Node.js 20.x atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- Git

### Langkah Setup

1. **Fork repository**
   ```bash
   # Fork melalui GitHub UI, kemudian clone fork Anda
   git clone https://github.com/YOUR-USERNAME/PayTo.git
   cd PayTo
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORGANIZATION/PayTo.git
   ```

3. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Setup database**
   ```bash
   # Buat database MySQL
   mysql -u root -p -e "CREATE DATABASE payto_dev"
   
   # Update .env dengan credentials database Anda
   # DB_DATABASE=payto_dev
   # DB_USERNAME=your_username
   # DB_PASSWORD=your_password
   
   # Run migrations dan seeders
   php artisan migrate --seed
   ```

6. **Build assets**
   ```bash
   npm run build
   ```

7. **Start development server**
   ```bash
   composer run dev
   # Atau secara manual:
   # php artisan serve
   # npm run dev
   # php artisan queue:listen
   ```

8. **Verify installation**
   - Buka http://localhost:8000
   - Login dengan credentials default (lihat database seeder)

## Workflow Development

### Branch Strategy

Kami menggunakan Git Flow:

- `main` - Production-ready code, protected
- `develop` - Development branch, protected
- `feature/*` - Fitur baru (branch dari `develop`)
- `bugfix/*` - Bug fixes (branch dari `develop`)
- `hotfix/*` - Urgent fixes (branch dari `main`)
- `release/*` - Persiapan release (branch dari `develop`)

### Naming Conventions

**Branches:**
```
feature/add-payment-gateway
bugfix/fix-inventory-calculation
hotfix/patch-security-vulnerability
release/v1.2.0
```

**Commits:**
Gunakan [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add Stripe payment integration
fix: correct inventory stock calculation
docs: update API documentation
style: format code with Pint
refactor: simplify approval workflow logic
test: add tests for refund process
chore: update dependencies
```

**Scope (optional):**
```
feat(payment): add Stripe integration
fix(inventory): correct stock calculation
docs(api): update endpoint documentation
```

### Development Process

1. **Sync dengan upstream**
   ```bash
   git checkout develop
   git fetch upstream
   git merge upstream/develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Tulis code dengan mengikuti standards
   - Tambahkan tests
   - Update dokumentasi jika diperlukan

4. **Test locally**
   ```bash
   # Run tests
   php artisan test
   
   # Check code style
   vendor/bin/pint --test
   
   # Build assets
   npm run build
   ```

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Kemudian buat Pull Request melalui GitHub UI.

## Standards dan Conventions

### PHP Code Style

- Ikuti [PSR-12](https://www.php-fig.org/psr/psr-12/)
- Gunakan Laravel Pint untuk formatting
- Run `vendor/bin/pint` sebelum commit

### Laravel Best Practices

- Gunakan Eloquent ORM, hindari raw queries
- Gunakan Form Requests untuk validation
- Gunakan Resource Classes untuk API responses
- Gunakan Jobs untuk operasi berat
- Gunakan Events dan Listeners untuk decoupling
- Ikuti Laravel naming conventions

### Frontend

- Gunakan TypeScript untuk type safety
- Ikuti React best practices
- Gunakan Tailwind CSS utility classes
- Komponen reusable di `resources/js/Components`
- Pages di `resources/js/Pages`

### Database

- Semua perubahan database melalui migrations
- Jangan edit migration yang sudah di-merge
- Tambahkan indexes untuk foreign keys dan query-frequent columns
- Gunakan factories untuk test data

### Security

- Jangan commit credentials atau secrets
- Gunakan environment variables
- Validasi semua user input
- Gunakan CSRF protection
- Sanitize output untuk mencegah XSS
- Gunakan parameterized queries

## Testing Guidelines

### Test Coverage

Target minimum coverage: **80%**

### Types of Tests

**Feature Tests:**
```php
// tests/Feature/PaymentTest.php
public function test_user_can_process_payment(): void
{
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 100]);

    $response = $this->actingAs($user)
        ->post('/api/payments', [
            'product_id' => $product->id,
            'amount' => 100,
            'method' => 'cash',
        ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('payments', [
        'user_id' => $user->id,
        'amount' => 100,
    ]);
}
```

**Unit Tests:**
```php
// tests/Unit/Services/InventoryServiceTest.php
public function test_calculates_stock_correctly(): void
{
    $service = new InventoryService();
    
    $result = $service->calculateStock(100, 20, 10);
    
    $this->assertEquals(90, $result);
}
```

### Running Tests

```bash
# All tests
php artisan test

# Specific test file
php artisan test tests/Feature/PaymentTest.php

# Specific test method
php artisan test --filter=test_user_can_process_payment

# With coverage
php artisan test --coverage --min=80
```

## Pull Request Process

### Before Submitting

Checklist sebelum submit PR:

- [ ] Code mengikuti style guidelines
- [ ] Semua tests passing (`php artisan test`)
- [ ] Code style passing (`vendor/bin/pint --test`)
- [ ] Assets building successfully (`npm run build`)
- [ ] Dokumentasi di-update (jika diperlukan)
- [ ] Tidak ada credentials atau secrets yang ter-commit
- [ ] Branch sudah up-to-date dengan `develop`

### PR Template

Saat membuat PR, isi template dengan:

1. **Description** - Apa yang berubah dan mengapa
2. **Type of Change** - Feature, bugfix, docs, dll
3. **Related Issues** - Link ke issue terkait
4. **Testing** - Bagaimana Anda test changes
5. **Screenshots** - Untuk perubahan UI
6. **Checklist** - Centang semua item

### Review Process

1. PR akan di-review oleh minimal 1 maintainer
2. CI/CD workflows harus passing
3. Konflik harus di-resolve oleh PR author
4. Setelah approved, PR akan di-merge oleh maintainer

### Merge Strategy

- Feature branches: **Squash and merge**
- Hotfix branches: **Merge commit**
- Release branches: **Merge commit**

## Pelaporan Bug

### Sebelum Melaporkan

1. Cek apakah bug sudah dilaporkan di [Issues](https://github.com/ORGANIZATION/PayTo/issues)
2. Pastikan Anda menggunakan versi terbaru
3. Coba reproduce di environment yang clean

### Bug Report Template

Gunakan template issue `Bug Report` dan isi:

- **Deskripsi bug** - Jelaskan apa yang terjadi
- **Steps to reproduce** - Langkah-langkah untuk reproduce
- **Expected behavior** - Apa yang seharusnya terjadi
- **Actual behavior** - Apa yang sebenarnya terjadi
- **Screenshots** - Jika applicable
- **Environment** - OS, PHP version, browser, dll
- **Additional context** - Error logs, stack traces

## Feature Requests

### Proses Usulan Fitur

1. **Cek existing issues** - Mungkin sudah ada yang mengusulkan
2. **Create discussion** - Diskusikan di GitHub Discussions dulu
3. **Create issue** - Jika disetujui, buat issue dengan template `Feature Request`
4. **Wait for approval** - Tunggu maintainer approve sebelum mulai development

### Feature Request Template

- **Deskripsi fitur** - Apa fitur yang Anda usulkan
- **Problem yang diselesaikan** - Masalah apa yang akan diselesaikan
- **Proposed solution** - Bagaimana fitur ini akan bekerja
- **Alternatives** - Alternatif yang sudah Anda pertimbangkan
- **Additional context** - Mockups, examples, dll

## Komunikasi

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - Diskusi umum, pertanyaan
- **Pull Requests** - Code review, technical discussions
- **Email** - Untuk security issues (security@payto.example.com)

## Recognition

Semua kontributor akan ditambahkan ke:
- `CONTRIBUTORS.md` file
- Release notes untuk contributions mereka
- GitHub contributors list

## Questions?

Jika Anda punya pertanyaan:
1. Cek [dokumentasi](docs/)
2. Search di [GitHub Discussions](https://github.com/ORGANIZATION/PayTo/discussions)
3. Buat discussion baru jika belum ada jawabannya

Terima kasih sudah berkontribusi! 🎉
