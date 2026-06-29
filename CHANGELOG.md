# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- CI/CD workflows with GitHub Actions
- Contributing guidelines and templates
- Security policy
- Code of Conduct

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0] - 2026-06-29

### Added
- 🏠 **Homestay Management System**
  - Room unit management with multiple rental modes (monthly/nightly)
  - Room facilities and photos
  - Availability calendar
  - Reservation system with check-in/check-out workflow
  
- 💰 **Financial Management**
  - Invoice generation and management
  - Payment processing with proof upload
  - Chart of accounts
  - Financial transactions tracking
  - Transaction receipts
  
- 👥 **User & Staff Management**
  - Multi-role authentication (Owner, Admin, Resident)
  - Property membership system
  - Resident management
  - Checkout request workflow
  
- 📊 **Booking & Approval System**
  - Room booking with hold mechanism
  - Payment proof submission
  - Multi-level approval workflow
  - Rejection with reason tracking
  
- 📝 **Reporting System**
  - Category-based reports
  - Evidence photo upload
  - Admin feedback system
  
- 🔔 **Notifications**
  - Billing reminders
  - Push notifications support
  
- 🛡️ **Security Features**
  - CSRF protection
  - XSS protection
  - SQL injection protection
  - Secure password hashing
  - Rate limiting
  
- 📱 **Frontend**
  - React + Inertia.js SPA
  - Tailwind CSS styling
  - Lucide React icons
  - Responsive design
  
- 🧪 **Testing**
  - PHPUnit test setup
  - CI/CD pipelines
  
- 📚 **Documentation**
  - Comprehensive API documentation
  - Database schema documentation
  - How-to guides
  - Architecture explanation
  - Getting started tutorial

### Technical Stack
- PHP 8.2+
- Laravel 12
- Inertia.js v2
- React 19
- Tailwind CSS v4
- MySQL 8.0
- Vite

---

## Release Notes Format

### Version Format
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, backwards compatible

### Change Categories
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

[Unreleased]: https://github.com/ORGANIZATION/PayTo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/ORGANIZATION/PayTo/releases/tag/v1.0.0
