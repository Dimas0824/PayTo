# Getting Started with PayTo

Welcome to PayTo! This tutorial will help you set up the development environment and get started working with the project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **PHP 8.2+** - Required for Laravel framework
- **Composer** - PHP dependency manager
- **Node.js 18+** - JavaScript runtime for frontend
- **npm** - Node package manager (comes with Node.js)
- **MySQL 5.7+ or SQLite** - Database (SQLite is used by default)
- **Git** - Version control

### Verify installations

```bash
php -v           # Should show PHP 8.2 or higher
composer -V      # Should show Composer version
node -v          # Should show Node.js version
npm -v           # Should show npm version
```

## Project Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd PayTo
```

### 2. Copy environment file

Copy the example environment file to create your own `.env` file:

```bash
copy .env.example .env
```

### 3. Install PHP dependencies

Run Composer to install all PHP packages:

```bash
composer install
```

Expected output:
```
Installing dependencies from lock file
Package operations: 123 installs, 0 updates, 0 removals
...
Generating optimized autoload files
```

### 4. Install Node dependencies

Install frontend dependencies:

```bash
npm install
```

Expected output:
```
added 145 packages, and audited 146 packages in 2m
```

### 5. Generate application key

Generate a unique application key for encryption:

```bash
php artisan key:generate
```

Expected output:
```
Application key set successfully.
```

### 6. Configure database

The default configuration uses SQLite, which requires no setup. The database file is located at `database/database.sqlite`.

If you want to use MySQL instead:

1. Create a new database in MySQL:
```sql
CREATE DATABASE payto;
```

2. Update your `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=payto
DB_USERNAME=root
DB_PASSWORD=
```

### 7. Run migrations

Create database tables:

```bash
php artisan migrate
```

Expected output:
```
Migrating: 2024_01_01_000001_create_users_table
Migrated:  2024_01_01_000001_create_users_table
Migrating: 2024_01_01_000002_create_products_table
...
Migrated:  2024_01_01_000002_create_products_table
```

### 8. Run seeders

Populate the database with initial data including sample users:

```bash
php artisan db:seed
```

This creates two default users:

| Username | Role | PIN |
|----------|------|-----|
| testuser | CASHIER | 123456 |
| supervisor | SUPERVISOR | 654321 |

### 9. Build frontend assets

Compile your frontend assets with Vite:

```bash
npm run build
```

For development mode (with hot-reload), use:

```bash
npm run dev
```

## Development Environment

### Running the development server

Use the convenient composer script to run all services simultaneously:

```bash
composer run dev
```

This command starts:
- **PHP development server** - Runs on port 8000
- **Vite development server** - Handles frontend hot-reloading
- **Queue worker** - Processes background jobs
- **Logs** - Pail log viewer

Expected output:
```
[server] Starting php artisan serve...
[queue] Starting php artisan queue:listen...
[logs] Starting php artisan pail...
[vite] Starting vite...
```

### Access the application

Open your browser and visit:

```
http://localhost:8000
```

## First Steps

### 1. Login to the application

Navigate to `/login` and use the default credentials:

- **Username**: `testuser`
- **PIN**: `123456`

Or for supervisor access:
- **Username**: `supervisor`
- **PIN**: `654321`

### 2. Explore the POS interface

After logging in as a cashier, you'll be redirected to `/kasir` (POS interface). You can:

- Scan products
- Process payments
- View receipts
- Handle refunds

### 3. Access admin panel

Navigate to `/admin` to access administrative features:

- Product management
- User management
- Sales reports
- System settings

## Project Structure Overview

```
PayTo/
├── app/
│   ├── Models/          # Eloquent database models
│   ├── Http/
│   │   ├── Controllers/ # Application controllers
│   │   └── Middleware/  # Custom middleware
│   └── Providers/       # Service providers
├── database/
│   ├── factories/       # Model factories for testing
│   ├── migrations/      # Database migrations
│   └── seeders/         # Database seeders
├── resources/
│   ├── js/              # React frontend components
│   │   ├── Pages/       # Inertia pages
│   │   └── Layouts/     # Layout components
│   └── views/           # Blade views (if any)
├── routes/
│   ├── web.php          # Web routes
│   ├── api.php          # API routes
│   └── console.php      # Console commands
├── tests/
│   ├── Feature/         # Feature tests
│   └── Unit/            # Unit tests
├── docs/                # Documentation
├── public/              # Publicly accessible files
├── storage/             # Generated files (logs, cache, uploads)
├── .env                 # Environment configuration
├── composer.json        # PHP dependencies
└── package.json         # Node dependencies
```

### Key models

- **User** - Staff users with different roles
- **Product** - Products in inventory
- **Sale** - Sale transactions
- **SaleItem** - Individual items in a sale
- **Payment** - Payment records
- **StockMovement** - Inventory tracking
- **ReceiptTemplate** - Receipt formatting
- **AppSetting** - System configuration

## Common Tasks

### Clear caches

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Run tests

```bash
composer test
# or
php artisan test
```

### Format code

```bash
vendor/bin/pint
```

## Next Steps

- **API Reference**: See [docs/reference/api.md](reference/api.md) for API endpoint documentation
- **Database Schema**: Review migrations in `database/migrations/` for complete schema
- **Project Documentation**: Check the `docs/` folder for more guides
- **Laravel Documentation**: https://laravel.com/docs/12.x
- **Inertia.js Documentation**: https://inertiajs.com/

## Troubleshooting

### "Unable to locate file in Vite manifest"

Run `npm run dev` or `npm run build` to compile frontend assets.

### Database connection errors

Ensure your `.env` database settings are correct and the database server is running.

### Permission denied errors

On Linux/Mac, ensure the `storage/` and `bootstrap/cache/` directories are writable:

```bash
chmod -R 775 storage bootstrap/cache
```

### Composer install fails

Ensure your PHP version is 8.2+. Check with `php -v`.

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review browser console for frontend errors
3. Check Laravel logs at `storage/logs/laravel.log`
4. Run `php artisan pail` to view application logs in real-time

Happy coding! 🚀
