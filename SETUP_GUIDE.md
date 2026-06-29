# Setup Guide - CI/CD & GitHub Organization

Panduan lengkap untuk setup CI/CD dan konfigurasi GitHub Organization untuk PayTo.

## 📋 Table of Contents

1. [GitHub Organization Setup](#github-organization-setup)
2. [Repository Setup](#repository-setup)
3. [CI/CD Configuration](#cicd-configuration)
4. [Team & Access Management](#team--access-management)
5. [Branch Protection](#branch-protection)
6. [Secrets Configuration](#secrets-configuration)
7. [Testing](#testing)

---

## 🏢 GitHub Organization Setup

### 1. Buat GitHub Organization

1. Buka [GitHub Organizations](https://github.com/organizations/new)
2. Pilih plan yang sesuai (Free/Team/Enterprise)
3. Isi nama organization (contoh: `payto-team`)
4. Isi billing email
5. Organization adalah milik "My personal account" atau "A business"
6. Klik **Next** dan **Complete setup**

### 2. Configure Organization Settings

**Settings → Member privileges:**
- Base permissions: **Read**
- Repository creation: **Enable** untuk admin
- Repository forking: **Enable** untuk private repos

**Settings → Actions:**
- Actions permissions: **Allow all actions and reusable workflows**
- Workflow permissions: **Read and write permissions**
- Allow GitHub Actions to create and approve pull requests: **Enable**

**Settings → Security:**
- Dependency graph: **Enable**
- Dependabot alerts: **Enable**
- Dependabot security updates: **Enable**
- Code scanning: **Enable** (akan setup via workflow)
- Secret scanning: **Enable**

---

## 📦 Repository Setup

### 1. Transfer atau Create Repository

**Option A: Transfer existing repository**
```bash
# Di repository settings → Danger Zone → Transfer ownership
# Transfer ke organization yang sudah dibuat
```

**Option B: Create new repository di organization**
```bash
# Buat repository baru di organization
# Kemudian push existing code
git remote set-url origin https://github.com/ORGANIZATION/PayTo.git
git push -u origin main
```

### 2. Repository Settings

**General:**
- Template repository: **Unchecked**
- Issues: **Enabled**
- Projects: **Enabled** (untuk kanban board)
- Wiki: **Enabled** atau **Disabled** (kita pakai docs/)
- Discussions: **Enabled** untuk Q&A dan announcements

**Features:**
- Wikis: **Disabled** (pakai docs/ folder)
- Issues: **Enabled**
- Sponsorships: **Enabled** (jika ada FUNDING.yml)
- Projects: **Enabled**
- Preserve this repository: **Enabled** untuk production
- Discussions: **Enabled**

---

## 🔄 CI/CD Configuration

### 1. Verify Workflows

Semua workflows sudah ada di `.github/workflows/`:

```bash
# Check workflows
ls -la .github/workflows/

# Output expected:
# - ci.yml              (Continuous Integration)
# - security.yml        (Security Scanning)
# - deploy.yml          (Deployment)
# - stale.yml           (Stale issues/PRs)
# - labeler.yml         (Auto-labeling)
# - auto-assign.yml     (Auto-assignment)
```

### 2. Enable GitHub Actions

1. Repository **Settings** → **Actions** → **General**
2. Actions permissions: **Allow all actions and reusable workflows**
3. Workflow permissions: **Read and write permissions**
4. **Save** changes

### 3. Test CI Workflow

```bash
# Push ke branch dan lihat Actions tab
git add .
git commit -m "ci: setup CI/CD workflows"
git push origin plan

# Buka repository di GitHub → Actions tab
# Verifikasi workflow berjalan
```

---

## 👥 Team & Access Management

### 1. Create Teams

**Organization → Teams → New team**

Buat teams berikut:

**@payto-maintainers**
- Description: Core maintainers with admin access
- Visibility: Visible
- Repository access: **Admin**

**@backend-team**
- Description: Backend developers
- Visibility: Visible
- Repository access: **Write**

**@frontend-team**
- Description: Frontend developers
- Visibility: Visible
- Repository access: **Write**

**@devops-team**
- Description: DevOps engineers
- Visibility: Visible
- Repository access: **Write**

**@security-team**
- Description: Security specialists
- Visibility: Visible
- Repository access: **Write**

**@qa-team**
- Description: QA engineers
- Visibility: Visible
- Repository access: **Write**

**@docs-team**
- Description: Documentation writers
- Visibility: Visible
- Repository access: **Write**

### 2. Update CODEOWNERS

File `.github/CODEOWNERS` sudah dikonfigurasi dengan teams di atas.

Ganti `ORGANIZATION` dengan nama organization Anda:

```bash
# Edit .github/CODEOWNERS
# Replace: @ORGANIZATION/team-name
# With: @your-org-name/team-name
```

### 3. Invite Members

1. **Organization → People → Invite member**
2. Masukkan username atau email
3. Pilih role: **Member** atau **Owner**
4. Assign ke teams yang sesuai

---

## 🔒 Branch Protection

### 1. Protect `main` Branch

**Repository → Settings → Branches → Add branch protection rule**

**Branch name pattern:** `main`

**Protection rules:**

✅ **Require a pull request before merging**
- Required approvals: **1**
- Dismiss stale reviews: **Enabled**
- Require review from Code Owners: **Enabled**
- Restrict who can dismiss reviews: **Enabled** (maintainers only)

✅ **Require status checks before merging**
- Require branches to be up to date: **Enabled**
- Status checks required:
  - `Tests (PHP 8.2)`
  - `Tests (PHP 8.3)`
  - `Code Quality`
  - `Frontend Quality`
  - `Security Audit`

✅ **Require conversation resolution**

✅ **Require signed commits** (optional tapi recommended)

✅ **Require linear history**

✅ **Include administrators**

❌ **Allow force pushes** (disabled)

❌ **Allow deletions** (disabled)

### 2. Protect `develop` Branch

Same rules as `main`, tapi bisa lebih relaxed:
- Required approvals: **1**
- Required status checks: Same as main

---

## 🔐 Secrets Configuration

### 1. Repository Secrets

**Repository → Settings → Secrets and variables → Actions → New repository secret**

**Required secrets untuk deployment:**

**Staging Environment:**
```
STAGING_HOST=staging.payto.example.com
STAGING_USER=deploy
STAGING_SSH_KEY=<private-ssh-key>
```

**Production Environment:**
```
PRODUCTION_HOST=payto.example.com
PRODUCTION_USER=deploy
PRODUCTION_SSH_KEY=<private-ssh-key>
```

**Optional (untuk notifications):**
```
SLACK_WEBHOOK_URL=<webhook-url>
DISCORD_WEBHOOK_URL=<webhook-url>
```

### 2. Environment Secrets

Untuk secrets yang spesifik per environment:

**Repository → Settings → Environments**

**Create Staging environment:**
- Name: `staging`
- Deployment branches: **Selected branches** → `main`
- Environment secrets:
  - `HOST=staging.payto.example.com`
  - `SSH_KEY=<staging-ssh-key>`

**Create Production environment:**
- Name: `production`
- Deployment branches: **Selected branches** → `main` (only tags)
- Required reviewers: **Enable** → Select reviewers
- Environment secrets:
  - `HOST=payto.example.com`
  - `SSH_KEY=<production-ssh-key>`

---

## 🧪 Testing

### 1. Test CI Workflow

```bash
# Create test PR
git checkout -b test/ci-setup
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verify CI workflow"
git push origin test/ci-setup

# Create PR dan verify:
# - CI workflow runs
# - All checks pass
# - Labels applied automatically
```

### 2. Test Security Workflow

```bash
# Security workflow runs:
# - On push to main/develop
# - Weekly via cron
# - On PR (dependency review)

# Trigger manually:
# GitHub → Actions → Security → Run workflow
```

### 3. Test Deployment Workflow (Staging)

```bash
# Push ke main untuk trigger staging deploy
git checkout main
git merge test/ci-setup
git push origin main

# Monitor di Actions tab
```

### 4. Test Production Deployment

```bash
# Tag version untuk production deploy
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Monitor di Actions tab
# Verify required reviewers approval
```

---

## ✅ Post-Setup Checklist

### GitHub Organization
- [ ] Organization created
- [ ] Teams created dan configured
- [ ] Members invited
- [ ] CODEOWNERS updated dengan team names

### Repository
- [ ] Repository transferred/created di organization
- [ ] Branch protection rules applied
- [ ] GitHub Actions enabled
- [ ] Secrets configured
- [ ] Environments configured

### CI/CD
- [ ] All workflows tested dan passing
- [ ] Dependabot enabled dan running
- [ ] Labels auto-applied pada PRs
- [ ] Stale workflow configured

### Documentation
- [ ] CONTRIBUTING.md reviewed
- [ ] CODE_OF_CONDUCT.md reviewed
- [ ] SECURITY.md updated dengan contact info
- [ ] README.md badges updated dengan org name

### Team
- [ ] Team members onboarded
- [ ] Access levels verified
- [ ] Code owners notified

---

## 🔗 Quick Links

Setelah setup, bookmark links ini:

- **Repository**: `https://github.com/ORGANIZATION/PayTo`
- **Actions**: `https://github.com/ORGANIZATION/PayTo/actions`
- **Issues**: `https://github.com/ORGANIZATION/PayTo/issues`
- **Projects**: `https://github.com/orgs/ORGANIZATION/projects`
- **Security**: `https://github.com/ORGANIZATION/PayTo/security`
- **Settings**: `https://github.com/ORGANIZATION/PayTo/settings`

---

## 🆘 Troubleshooting

### Workflows tidak running

**Problem:** Workflows tidak trigger otomatis

**Solution:**
1. Check Settings → Actions → General → Permissions
2. Pastikan "Read and write permissions" enabled
3. Pastikan workflow file valid YAML (check syntax)

### Required checks tidak muncul di PR

**Problem:** Status checks required tapi tidak muncul

**Solution:**
1. Workflow harus run minimal 1x di branch protection
2. Check exact name di workflow vs branch protection
3. Re-push untuk trigger workflow

### Deployment failing

**Problem:** Deploy workflow gagal connect SSH

**Solution:**
1. Verify secrets: HOST, USER, SSH_KEY
2. Test SSH connection manually
3. Check SSH key permissions (600)
4. Verify server firewall rules

### Dependabot PRs tidak auto-created

**Problem:** Dependabot tidak buat PRs

**Solution:**
1. Check Settings → Security → Dependabot
2. Verify dependabot.yml syntax
3. Check organization security settings

---

## 📞 Support

Jika ada masalah saat setup:

1. Check [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Check [workflow logs](https://github.com/ORGANIZATION/PayTo/actions) untuk error details
3. Buat issue dengan label `ci/cd` dan `help wanted`

---

**Setup completed!** 🎉

Team Anda sekarang punya:
- ✅ Professional CI/CD pipeline
- ✅ Automated testing dan security scanning
- ✅ Proper branch protection
- ✅ Team collaboration tools
- ✅ Automated deployments

Happy coding! 🚀
