# Approval Workflow for Refunds

Learn how to handle refund requests from POS terminals and approve or reject them as a supervisor.

## Overview

The approval workflow ensures that refund transactions require supervisor authorization before processing. This prevents unauthorized refunds and maintains financial accountability.

## Problem: Customer requests a refund at POS

A customer wants to return items and get a refund. The cashier initiates the refund request.

### Solution

The cashier submits a refund request from the POS:

```bash
POST /api/pos/refunds
Content-Type: application/json
Authorization: Bearer {cashier_token}

{
  "sale_id": 456,
  "items": [
    {
      "sale_item_id": 789,
      "qty": 2
    }
  ],
  "reason": "Barang cacat dan tidak layak jual"
}
```

**Expected response:**

```json
{
  "data": {
    "id": 101,
    "sale_id": 456,
    "requested_by": 23,
    "status": "PENDING",
    "total_amount": 10000,
    "reason": "Barang cacat dan tidak layak jual"
  },
  "message": "Permintaan refund berhasil dikirim untuk approval supervisor."
}
```

**What happens:**
- An approval record is created with status `PENDING`
- A refund record is created (not yet processed)
- The sale transaction details are locked for review
- The refund amount is calculated from the items and quantities

## Problem: Supervisor needs to review and approve/refuse refund

Supervisor receives notification and needs to approve or reject the refund request.

### Solution

Check pending approvals:

```bash
GET /api/admin/approvals?status=PENDING
Authorization: Bearer {supervisor_token}
```

**Expected response:**

```json
{
  "data": [
    {
      "id": 101,
      "action": "refund",
      "sale_id": 456,
      "requested_by": 23,
      "requested_by_name": "Budi Santoso",
      "status": "PENDING",
      "reason": "Barang cacat dan tidak layak jual",
      "payload_json": {
        "sale": {
          "invoice_no": "INV-2026-000456",
          "total_amount": 50000,
          "paid_amount": 50000,
          "occurred_at": "2026-06-28 18:30:00"
        },
        "items": [
          {
            "product_name": "Teh Botol",
            "qty": 2,
            "price": 5000,
            "discount": 0
          }
        ]
      },
      "created_at": "2026-06-28 19:45:00"
    }
  ]
}
```

Approve the refund:

```bash
POST /api/admin/approvals/101/approve
Content-Type: application/json
Authorization: Bearer {supervisor_token}

{
  "reason": "Barang memang cacat sesuai penjelasan kasir"
}
```

**Expected response:**

```json
{
  "data": {
    "id": 101,
    "status": "APPROVED",
    "approved_by": 45,
    "approved_by_name": "Supervisor Andi"
  },
  "message": "Refund berhasil disetujui."
}
```

**What happens on approval:**
- Refund transaction is processed
- Stock is returned to inventory
- Refund amount is credited back to customer
- Audit log entry is created
- Receipt is generated for the refund

Reject the refund:

```bash
POST /api/admin/approvals/101/reject
Content-Type: application/json
Authorization: Bearer {supervisor_token}

{
  "reason": "Tidak sesuai kebijakan refund - tidak ada bukti cacat"
}
```

**Expected response:**

```json
{
  "data": {
    "id": 101,
    "status": "REJECTED",
    "approved_by": 45,
    "approved_by_name": "Supervisor Andi"
  },
  "message": "Refund ditolak."
}
```

## Problem: Need to check refund approval status

Tracking whether a refund request has been approved, rejected, or is still pending.

### Solution

Check a specific refund approval:

```bash
GET /api/admin/approvals/101
Authorization: Bearer {supervisor_token}
```

**Expected response:**

```json
{
  "data": {
    "id": 101,
    "action": "refund",
    "sale_id": 456,
    "requested_by": 23,
    "requested_by_name": "Budi Santoso",
    "approved_by": 45,
    "approved_by_name": "Supervisor Andi",
    "status": "APPROVED",
    "reason": "Barang memang cacat sesuai penjelasan kasir",
    "total_amount": 10000,
    "created_at": "2026-06-28 19:45:00",
    "approved_at": "2026-06-28 20:00:00"
  }
}
```

## Problem: Need to view complete approval history

Auditing all refund requests and their approval status over time.

### Solution

Get all approvals (optionally filtered by status or date range):

```bash
GET /api/admin/approvals?status=ALL&from=2026-06-28&to=2026-06-28
Authorization: Bearer {supervisor_token}
```

**Expected response:**

```json
{
  "data": [
    {
      "id": 100,
      "action": "refund",
      "sale_id": 455,
      "requested_by_name": "Ani Wijaya",
      "status": "APPROVED",
      "total_amount": 5000,
      "created_at": "2026-06-28 14:30:00"
    },
    {
      "id": 101,
      "action": "refund",
      "sale_id": 456,
      "requested_by_name": "Budi Santoso",
      "status": "APPROVED",
      "total_amount": 10000,
      "created_at": "2026-06-28 19:45:00"
    },
    {
      "id": 102,
      "action": "refund",
      "sale_id": 457,
      "requested_by_name": "Citra Lestari",
      "status": "REJECTED",
      "total_amount": 7500,
      "created_at": "2026-06-28 21:00:00"
    }
  ],
  "meta": {
    "total": 3,
    "approved": 2,
    "rejected": 1,
    "pending": 0
  }
}
```

**Approval workflow rules:**
- Refund window: 2 days from original sale date (configurable)
- Only paid sales can be refunded
- Refund amount cannot exceed original payment
- Maximum refund quantity per item is the original purchase quantity
- All approvals are logged for audit purposes
- Approved refunds are irreversible