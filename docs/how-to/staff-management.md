# Staff Management

Learn how to create, manage, and deactivate cashier and supervisor accounts in the POS system.

## Overview

Staff management allows administrators to control access to the POS system, manage staff roles, and monitor activity.

## Problem: Need to create a new cashier

Adding a new employee as a cashier with access to the POS terminal.

### Solution

Create a new cashier account:

```bash
POST /api/admin/staff
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "name": "Dewi Lestari",
  "username": "dewi.l",
  "password": "SecurePass123!",
  "role": "CASHIER",
  "is_active": true
}
```

**Expected response:**

```json
{
  "data": {
    "id": 56,
    "name": "Dewi Lestari",
    "username": "dewi.l",
    "role": "CASHIER",
    "status": "ACTIVE",
    "is_active": true
  },
  "message": "Staf berhasil ditambahkan."
}
```

**What happens:**
- User record is created with hashed password
- PIN is set via the password field
- User can log in to POS with username and PIN
- Default permissions: process sales, view products, view history
- Staff appears in POS login list

**POS login flow:**

```bash
POST /api/pos/login
Content-Type: application/json

{
  "username": "dewi.l",
  "password": "SecurePass123!"
}
```

**Expected response:**

```json
{
  "data": {
    "id": 56,
    "name": "Dewi Lestari",
    "username": "dewi.l",
    "role": "CASHIER",
    "permission": ["sale:create", "product:read", "history:read"]
  },
  "message": "Login berhasil.",
  "token": "1|abc123..."
}
```

## Problem: Need to create a supervisor account

Adding a staff member with supervisor privileges for approvals and management.

### Solution

Create a supervisor account:

```bash
POST /api/admin/staff
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "name": "Eko Prasetyo",
  "username": "eko.p",
  "password": "SecurePass456!",
  "role": "SUPERVISOR",
  "is_active": true
}
```

**Expected response:**

```json
{
  "data": {
    "id": 57,
    "name": "Eko Prasetyo",
    "username": "eko.p",
    "role": "SUPERVISOR",
    "status": "ACTIVE",
    "is_active": true
  },
  "message": "Staf berhasil ditambahkan."
}
```

**Supervisor permissions:**
- All cashier permissions
- Approve/refuse refunds
- View all staff activity
- View reports and analytics
- Manage product stock adjustments

## Problem: Need to reset staff PIN

A staff member forgot their PIN and needs it reset.

### Solution

Reset staff PIN using the dedicated endpoint:

```bash
POST /api/admin/staff/56/reset-pin
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "password": "NewSecurePass789!"
}
```

**Expected response:**

```json
{
  "message": "PIN staf berhasil direset."
}
```

**What happens:**
- Staff password is updated with the new PIN
- New PIN takes effect immediately
- Previous PIN is invalidated
- User must log in with the new PIN

**Alternative: Generate random PIN**

```bash
POST /api/admin/staff/56/reset-pin
Authorization: Bearer {admin_token}
```

This generates a random 6-digit PIN and returns it in the response.

## Problem: Need to deactivate a staff member

An employee has left the company and their access should be revoked.

### Solution

Deactivate staff account:

```bash
PUT /api/admin/staff/56
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "is_active": false
}
```

**Expected response:**

```json
{
  "data": {
    "id": 56,
    "name": "Dewi Lestari",
    "status": "INACTIVE",
    "is_active": false
  },
  "message": "Staf berhasil diperbarui."
}
```

**What happens:**
- Staff can no longer log in to POS
- Historical transactions remain attributed to the staff member
- Staff is removed from active staff lists
- Data is preserved for audit purposes

**Alternative: Deactivate via full update**

```bash
PUT /api/admin/staff/56
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "name": "Dewi Lestari",
  "username": "dewi.l",
  "role": "CASHIER",
  "is_active": false
}
```

## Problem: Need to view staff activity

Monitoring what staff members are doing in the system.

### Solution

Get all staff with activity information:

```bash
GET /api/admin/staff
Authorization: Bearer {admin_token}
```

**Expected response:**

```json
{
  "data": [
    {
      "id": 23,
      "name": "Ani Wijaya",
      "username": "ani.w",
      "role": "CASHIER",
      "status": "ACTIVE",
      "is_active": true,
      "lastLogin": "2 jam yang lalu"
    },
    {
      "id": 45,
      "name": "Budi Santoso",
      "username": "budi.s",
      "role": "SUPERVISOR",
      "status": "ACTIVE",
      "is_active": true,
      "lastLogin": "1 jam yang lalu"
    },
    {
      "id": 56,
      "name": "Dewi Lestari",
      "username": "dewi.l",
      "role": "CASHIER",
      "status": "INACTIVE",
      "is_active": false,
      "lastLogin": "3 bulan yang lalu"
    }
  ]
}
```

**View specific staff details:**

```bash
GET /api/admin/staff/56
Authorization: Bearer {admin_token}
```

**Expected response:**

```json
{
  "data": {
    "id": 56,
    "name": "Dewi Lestari",
    "username": "dewi.l",
    "role": "CASHIER",
    "status": "INACTIVE",
    "is_active": false,
    "created_at": "2026-03-15 09:30:00",
    "last_login_at": "2026-03-28 18:45:00"
  }
}
```

**Staff activity metrics:**
- Total transactions processed
- Total sales amount
- Last login timestamp
- Account creation date
- Current login status

**Role-based permissions:**
- **CASHIER**: Create sales, view products, view history
- **SUPERVISOR**: All cashier permissions + approve refunds, view reports, manage stock adjustments