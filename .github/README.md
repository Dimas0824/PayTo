# .github Directory

Directory ini berisi konfigurasi GitHub-specific untuk repository PayTo.

## 📁 Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci.yml             # Continuous Integration
│   ├── security.yml       # Security scanning
│   ├── deploy.yml         # Deployment automation
│   ├── stale.yml          # Auto-close stale issues
│   ├── labeler.yml        # Auto-labeling PRs
│   └── auto-assign.yml    # Auto-assign issues/PRs
├── ISSUE_TEMPLATE/         # Issue templates
│   ├── bug_report.md      # Bug report template
│   └── feature_request.md # Feature request template
├── PULL_REQUEST_TEMPLATE.md
├── CODEOWNERS             # Code ownership rules
├── dependabot.yml         # Dependency updates config
├── labeler.yml            # PR labeling rules
└── FUNDING.yml            # Funding/sponsor info
```

## 🔄 Workflows

### CI Workflow (`ci.yml`)
Runs on every push and PR to `main` and `develop`:
- ✅ PHP 8.2, 8.3 matrix testing
- ✅ Code style check (Pint)
- ✅ Security audit
- ✅ Frontend build
- ✅ Test coverage (min 80%)

### Security Workflow (`security.yml`)
Weekly security scans dan PR dependency reviews:
- 🔒 Composer audit
- 🔒 NPM audit
- 🔒 Secret scanning
- 🔒 Dependency review

### Deploy Workflow (`deploy.yml`)
Automated deployments:
- 🚀 Staging: Auto-deploy on push to `main`
- 🚀 Production: Auto-deploy on version tags (`v*`)

### Maintenance Workflows
- **Stale**: Auto-closes inactive issues/PRs
- **Labeler**: Auto-labels PRs based on changed files
- **Auto-assign**: Auto-assigns issues/PRs to team members

## 🏷️ Labels

Workflows automatically apply these labels:

- `backend` - Backend changes
- `frontend` - Frontend changes
- `tests` - Test changes
- `documentation` - Documentation changes
- `dependencies` - Dependency updates
- `ci/cd` - CI/CD changes
- `security` - Security-related
- `stale` - Inactive for too long

## 📝 Templates

### Issue Templates
1. **Bug Report** - For reporting bugs
2. **Feature Request** - For suggesting new features

### Pull Request Template
Comprehensive PR template with:
- Description
- Type of change
- Testing checklist
- Screenshots section
- Performance impact
- Breaking changes

## 👥 Code Owners

`CODEOWNERS` file defines who reviews specific parts:
- Backend Team: `/app`, `/database`, `/routes`
- Frontend Team: `/resources/js`, `/resources/css`
- DevOps Team: `/.github`, CI/CD configs
- Security Team: Middleware, security docs
- QA Team: `/tests`

## 🤖 Dependabot

Automatic dependency updates:
- **Composer**: Weekly on Monday 09:00
- **NPM**: Weekly on Monday 09:00
- **GitHub Actions**: Monthly

## 🔧 Setup

### GitHub Secrets Required

For deployment workflows to work, configure these secrets in repository settings:

**Staging:**
- `STAGING_HOST`
- `STAGING_USER`
- `STAGING_SSH_KEY`

**Production:**
- `PRODUCTION_HOST`
- `PRODUCTION_USER`
- `PRODUCTION_SSH_KEY`

### Branch Protection

Recommended branch protection rules for `main`:

- ✅ Require pull request reviews (1 approval)
- ✅ Require status checks (CI, Security)
- ✅ Require branches to be up to date
- ✅ Include administrators
- ✅ Require linear history
- ✅ Require signed commits (optional)

### Environment Configuration

Configure environments in repository settings:

**Staging:**
- Deployment branch: `main`
- Reviewers: Optional
- URL: `https://staging.payto.example.com`

**Production:**
- Deployment branch: `main` (only tags)
- Reviewers: Required (core team)
- URL: `https://payto.example.com`

## 📊 Monitoring

Workflows send notifications on:
- ❌ Failed builds
- ✅ Successful deployments
- 🔒 Security vulnerabilities found
- 📦 Dependency updates available

## 🎯 Best Practices

1. **All PRs must pass CI** before merging
2. **Security workflow must pass** for PRs
3. **Use conventional commits** for clear changelog
4. **Link PRs to issues** using keywords (Fixes #123)
5. **Keep dependencies up-to-date** via Dependabot
6. **Review and update workflows** quarterly

## 🔗 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CODEOWNERS Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
