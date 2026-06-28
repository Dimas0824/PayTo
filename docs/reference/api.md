# API Reference

## Overview

### Base URL

```
http://localhost/api
```

### Authentication

All API endpoints (except `/pos/login`) require authentication using Laravel's session-based authentication. Use the `X-CSRF-TOKEN` header with a valid CSRF token.

**POS Login Flow:**
- Use `/pos/login` endpoint to authenticate
- The endpoint returns a redirect URL based on user role
- Subsequent requests will use the authenticated session

### Response Format

All responses are JSON formatted with consistent structure:

```json
{
  "data": { ... },
  "message": "Optional success message",
  "errors": { ... }
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## Admin Dashboard

### Get Dashboard Statistics

**GET** `/admin/dashboard`

#### Description
Returns comprehensive dashboard data including today's sales summary, transaction count, low stock alerts, weekly trends, and recent activities.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": {
    "today_sales_total": 1500000.00,
    "today_transactions": 25,
    "low_stock": {
      "total": 3,
      "items": [
        {
          "id": 1,
          "name": "Kopi Bubuk",
          "stock": 0.5,
          "reorder_point": 5.0
        }
      ]
    },
    "weekly_sales_trend": [
      { "date": "2026-06-23", "total": 1250000 },
      { "date": "2026-06-24", "total": 1380000 }
    ],
    "recent_activities": [
      {
        "type": "SALE",
        "amount": 150000,
        "user": "John Doe"
      }
    ]
  }
}
```

---

## Admin Profile

### Get Admin Profile

**GET** `/admin/profile`

#### Description
Returns the current admin user profile information including name, role, email, and join date.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": {
    "name": "Admin Name",
    "role": "SUPERVISOR",
    "id": "SPV-001",
    "email": "admin@example.com",
    "phone": "—",
    "joinDate": "01 Januari 2026",
    "lastLogin": "2 jam yang lalu"
  }
}
```

---

## Products

### List All Products

**GET** `/admin/products`

#### Description
Returns a paginated list of all products with stock information.

#### Authentication
Required (SUPERVISOR role)

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| per_page | integer | Items per page (default: 10) |

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Kopi Bubuk",
      "sku": "KPB-001",
      "barcode": "1234567890123",
      "price": 50000.00,
      "discount": 10.00,
      "price_after_discount": 45000.00,
      "cost": 35000.00,
      "uom": "pcs",
      "stock": 50.0,
      "is_active": true,
      "status": "ACTIVE"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 100,
    "last_page": 10
  }
}
```

### Create Product

**POST** `/admin/products`

#### Authentication
Required (SUPERVISOR role)

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | max:255 |
| sku | string | No | max:255, unique |
| barcode | string | No | max:255, unique |
| price | number | Yes | min:0 |
| discount | number | No | min:0 |
| cost | number | No | min:0 |
| uom | string | No | max:50 |
| is_active | boolean | No | default: true |
| stock | number | Yes | min:0 |

#### Example Request
```bash
curl -X POST http://localhost/api/admin/products \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "Kopi Bubuk Arabica",
    "sku": "KPB-001",
    "barcode": "1234567890123",
    "price": 50000,
    "discount": 10,
    "cost": 35000,
    "uom": "pcs",
    "stock": 100,
    "is_active": true
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "name": "Kopi Bubuk Arabica",
    "sku": "KPB-001",
    "price": 50000.00,
    "stock": 100.0
  },
  "message": "Produk berhasil ditambahkan."
}
```

#### Error Response (422)
```json
{
  "message": "Nama produk wajib diisi.",
  "errors": {
    "name": ["Nama produk wajib diisi."]
  }
}
```

### Get Product Details

**GET** `/admin/products/{product}`

#### Description
Returns detailed information about a specific product.

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| product | integer | Product ID |

#### Response
```json
{
  "data": {
    "id": 1,
    "name": "Kopi Bubuk Arabica",
    "sku": "KPB-001",
    "barcode": "1234567890123",
    "price": 50000.00,
    "discount": 10.00,
    "price_after_discount": 45000.00,
    "cost": 35000.00,
    "uom": "pcs",
    "stock": 50.0,
    "is_active": true,
    "status": "ACTIVE"
  }
}
```

### Update Product

**PUT** `/admin/products/{product}`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| product | integer | Product ID |

#### Request Body

All fields are optional. Only provided fields will be updated.

| Field | Type | Validation |
|-------|------|------------|
| name | string | max:255 |
| sku | string | max:255, unique |
| barcode | string | max:255, unique |
| price | number | min:0 |
| discount | number | min:0 |
| cost | number | min:0 |
| uom | string | max:50 |
| is_active | boolean | |
| stock | number | min:0 |

#### Example Request
```bash
curl -X PUT http://localhost/api/admin/products/1 \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "price": 55000,
    "stock": 75
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "name": "Kopi Bubuk Arabica",
    "price": 55000.00,
    "stock": 75.0
  },
  "message": "Produk berhasil diperbarui."
}
```

### Delete Product

**DELETE** `/admin/products/{product}`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| product | integer | Product ID |

#### Response
```json
{
  "message": "Produk berhasil dihapus."
}
```

---

## Inventory Recommendations

### Get Inventory Recommendations

**GET** `/admin/inventory/recommendations`

#### Description
Analyzes sales data from the last 7 days to provide inventory restocking recommendations. Returns products with stock levels below reorder points.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "productName": "Kopi Bubuk Arabica",
      "sku": "KPB-001",
      "stock": 2.5,
      "avgSales7d": 5.0,
      "leadTime": 3,
      "reorderPoint": 15.0,
      "suggestedQty": 12.5,
      "status": "WARNING"
    }
  ],
  "meta": {
    "window_days": 7,
    "computed_at": "2026-06-29 12:00:00"
  }
}
```

#### Status Values

- **SAFE**: Stock is above reorder point
- **WARNING**: Stock is at or below reorder point
- **CRITICAL**: Stock is at or below safety stock level

---

## Receipt Settings

### Get Receipt Settings

**GET** `/admin/receipt-settings`

#### Description
Returns current receipt header and footer configuration.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": {
    "header": "TOKO CABANG PUSAT\nJl. Sudirman No. 45, Jakarta",
    "footer": "Terima kasih atas kunjungan Anda\nFollow IG: @tokokopi"
  }
}
```

### Update Receipt Settings

**PUT** `/admin/receipt-settings`

#### Authentication
Required (SUPERVISOR role)

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| header | string | Yes | max:2000 |
| footer | string | Yes | max:2000 |

#### Example Request
```bash
curl -X PUT http://localhost/api/admin/receipt-settings \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "header": "CAFE RAJA KOPI\nJl. Merdeka No. 10, Bandung",
    "footer": "Terima kasih atas kepercayaan Anda"
  }'
```

#### Success Response
```json
{
  "data": {
    "header": "CAFE RAJA KOPI\nJl. Merdeka No. 10, Bandung",
    "footer": "Terima kasih atas kepercayaan Anda"
  }
}
```

---

## Approvals

### List Pending Approvals

**GET** `/admin/approvals`

#### Description
Returns list of pending refund approval requests.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "sale": {
        "invoice_no": "INV-2026-001",
        "total": 150000,
        "date": "29 Jun 2026 10:30"
      },
      "requested_by": {
        "name": "John Doe",
        "username": "cashier1"
      },
      "reason": "Barang rusak saat dikirim",
      "items": [
        {
          "product": "Kopi Bubuk Arabica",
          "qty": 2,
          "subtotal": 100000
        }
      ],
      "total_amount": 100000,
      "status": "PENDING"
    }
  ]
}
```

### Approve Refund

**POST** `/admin/approvals/{approval}/approve`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| approval | integer | Approval ID |

#### Example Request
```bash
curl -X POST http://localhost/api/admin/approvals/1/approve \
  -H "X-CSRF-TOKEN: your-csrf-token"
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "status": "APPROVED"
  },
  "message": "Refund disetujui dan diproses."
}
```

### Reject Refund

**POST** `/admin/approvals/{approval}/reject`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| approval | integer | Approval ID |

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| reason | string | Yes | min:5, max:255 |

#### Example Request
```bash
curl -X POST http://localhost/api/admin/approvals/1/reject \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "reason": "Waktu refund telah melewati batas 2 hari"
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "status": "REJECTED"
  },
  "message": "Refund ditolak."
}
```

---

## Staff Management

### List All Staff

**GET** `/admin/staff`

#### Description
Returns list of all staff members (CASHIER and SUPERVISOR roles).

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "cashier1",
      "role": "CASHIER",
      "status": "ACTIVE",
      "is_active": true,
      "lastLogin": "2 jam yang lalu"
    }
  ]
}
```

### Create Staff

**POST** `/admin/staff`

#### Authentication
Required (SUPERVISOR role)

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | max:255 |
| username | string | Yes | max:255, unique |
| role | string | Yes | enum:CASHIER,SUPERVISOR |
| is_active | boolean | No | default: true |
| password | string | Conditional | min:6, max:255 (required if pin not provided) |
| pin | string | Conditional | digits:6 (required if password not provided) |

**Note:** Either password or PIN must be provided, but not both.

#### Example Request (Password)
```bash
curl -X POST http://localhost/api/admin/staff \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "Jane Smith",
    "username": "cashier2",
    "role": "CASHIER",
    "password": "password123",
    "is_active": true
  }'
```

#### Example Request (PIN)
```bash
curl -X POST http://localhost/api/admin/staff \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "Bob Wilson",
    "username": "supervisor1",
    "role": "SUPERVISOR",
    "pin": "123456",
    "is_active": true
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "username": "cashier2",
    "role": "CASHIER",
    "status": "ACTIVE"
  },
  "message": "Staf berhasil ditambahkan."
}
```

### Get Staff Details

**GET** `/admin/staff/{user}`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| user | integer | User ID |

#### Response
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "cashier1",
    "role": "CASHIER",
    "status": "ACTIVE",
    "is_active": true,
    "lastLogin": "2 jam yang lalu"
  }
}
```

### Update Staff

**PUT** `/admin/staff/{user}`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| user | integer | User ID |

#### Request Body

All fields are optional. Only provided fields will be updated.

| Field | Type | Validation |
|-------|------|------------|
| name | string | max:255 |
| username | string | max:255, unique |
| role | string | enum:CASHIER,SUPERVISOR |
| is_active | boolean | |
| password | string | min:6, max:255 |
| pin | string | digits:6 |

**Note:** Either password or PIN can be provided, but not both.

#### Example Request
```bash
curl -X PUT http://localhost/api/admin/staff/1 \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "John Doe Updated",
    "is_active": false
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "is_active": false
  },
  "message": "Staf berhasil diperbarui."
}
```

### Delete Staff

**DELETE** `/admin/staff/{user}`

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| user | integer | User ID |

#### Response
```json
{
  "message": "Staf berhasil dihapus."
}
```

### Reset Staff PIN

**POST** `/admin/staff/{user}/reset-pin`

#### Description
Resets the staff member's PIN to a new value.

#### Authentication
Required (SUPERVISOR role)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| user | integer | User ID |

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| pin | string | Yes | digits:6 |

#### Example Request
```bash
curl -X POST http://localhost/api/admin/staff/1/reset-pin \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "pin": "654321"
  }'
```

#### Success Response
```json
{
  "message": "PIN staf berhasil direset."
}
```

---

## POS API

### POS Login

**POST** `/pos/login`

#### Description
 authenticates POS users using either credentials or PIN.

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| login_method | string | Yes | enum:CREDENTIALS,PIN |
| role | string | No | enum:KASIR,ADMIN |
| username | string | Conditional | max:255 (required if login_method=CREDENTIALS) |
| password | string | Conditional | max:255 (required if login_method=CREDENTIALS) |
| pin | string | Conditional | digits:6 (required if login_method=PIN) |

#### Example Request (Credentials)
```bash
curl -X POST http://localhost/api/pos/login \
  -H "Content-Type: application/json" \
  -d '{
    "login_method": "CREDENTIALS",
    "username": "cashier1",
    "password": "password123"
  }'
```

#### Example Request (PIN)
```bash
curl -X POST http://localhost/api/pos/login \
  -H "Content-Type: application/json" \
  -d '{
    "login_method": "PIN",
    "pin": "123456"
  }'
```

#### Success Response
```json
{
  "redirect": "/kasir"
}
```

#### Error Response (422)
```json
{
  "message": "Kredensial tidak valid."
}
```

### Get POS Products

**GET** `/pos/products`

#### Description
Returns list of active products available for sale in POS.

#### Authentication
Required

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Kopi Bubuk Arabica",
      "sku": "KPB-001",
      "price": 50000.00,
      "discount": 10.00,
      "price_after_discount": 45000.00,
      "stock": 50.0
    }
  ]
}
```

### Get POS History

**GET** `/pos/history`

#### Description
Returns paginated list of completed sales transactions for the current user.

#### Authentication
Required

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| per_page | integer | Items per page (default: 10) |
| start_date | string | Filter by start date (YYYY-MM-DD) |
| end_date | string | Filter by end date (YYYY-MM-DD) |

#### Response
```json
{
  "data": [
    {
      "id": 1,
      "invoice_no": "INV-2026-001",
      "total": 45000,
      "payment_method": "CASH",
      "cash_received": 50000,
      "change": 5000,
      "items": 1,
      "occurred_at": "29 Jun 2026 10:30"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 25,
    "last_page": 3
  }
}
```

### Get POS Profile

**GET** `/pos/profile`

#### Description
Returns current POS user profile information.

#### Authentication
Required

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | integer | Optional user ID to look up |

#### Response
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "username": "cashier1",
    "role": "CASHIER",
    "last_login_at": "2 jam yang lalu"
  }
}
```

### POS Checkout

**POST** `/pos/checkout`

#### Description
Processes a new sale transaction.

#### Authentication
Required (CASHIER or SUPERVISOR role)

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| payment_method | string | Yes | enum:CASH,EWALLET |
| cash_received | number | Conditional | min:0 (required if payment_method=CASH) |
| reference | string | No | max:255 |
| items | array | Yes | min:1 item |

#### Items Array

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| product_id | integer | Yes | exists:products,id |
| qty | number | Yes | min:0.001 |
| discount_amount | number | No | min:0 |

#### Example Request
```bash
curl -X POST http://localhost/api/pos/checkout \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "payment_method": "CASH",
    "cash_received": 100000,
    "reference": "Customer referral",
    "items": [
      {
        "product_id": 1,
        "qty": 2,
        "discount_amount": 5000
      }
    ]
  }'
```

#### Success Response
```json
{
  "sale_id": 123,
  "invoice_no": "INV-2026-123",
  "payment": {
    "status": "CONFIRMED"
  },
  "items": [
    {
      "product_id": 1,
      "product_name": "Kopi Bubuk Arabica",
      "qty": 2,
      "price": 50000,
      "discount": 5000,
      "subtotal": 95000
    }
  ],
  "totals": {
    "subtotal": 95000,
    "discount_total": 5000,
    "tax_total": 0,
    "grand_total": 95000,
    "paid_total": 95000,
    "change_total": 5000
  }
}
```

### POS Refund

**POST** `/pos/refunds`

#### Description
Submits a refund request for supervisor approval. Refunds require approval before processing.

#### Authentication
Required (CASHIER or SUPERVISOR role)

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| sale_id | integer | Yes | exists:sales,id |
| items | array | Yes | min:1 item |
| reason | string | Yes | min:10, max:255 |

#### Items Array

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| sale_item_id | integer | Yes | exists:sale_items,id |
| qty | number | Yes | min:0.001 |

#### Example Request
```bash
curl -X POST http://localhost/api/pos/refunds \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "sale_id": 123,
    "items": [
      {
        "sale_item_id": 5,
        "qty": 1
      }
    ],
    "reason": "Barang tidak sesuai pesanan"
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "sale_id": 123,
    "total_amount": 45000,
    "status": "PENDING"
  },
  "message": "Permintaan refund berhasil dikirim untuk approval supervisor."
}
```

### POS Logout

**POST** `/pos/logout`

#### Description
Logs out the current POS user and saves work session data.

#### Authentication
Required

#### Response
```json
{
  "status": "ok"
}
```

### Get POS Settings

**GET** `/pos/settings`

#### Description
Returns current POS settings including printer configuration.

#### Authentication
Required

#### Response
```json
{
  "data": {
    "printer": {
      "name": "EPSON TM-T82",
      "status": "connected"
    },
    "sync": {
      "mode": "auto"
    }
  }
}
```

### Update POS Printer

**POST** `/pos/settings/printer`

#### Description
Updates the default printer configuration.

#### Authentication
Required

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | max:255 |

#### Example Request
```bash
curl -X POST http://localhost/api/pos/settings/printer \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "name": "EPSON TM-T82 II"
  }'
```

#### Success Response
```json
{
  "data": {
    "name": "EPSON TM-T82 II",
    "status": "connected"
  }
}
```

### Test POS Printer

**POST** `/pos/settings/printer/test`

#### Description
Sends a test print job to the configured printer.

#### Authentication
Required

#### Response
```json
{
  "message": "Test print berhasil dikirim."
}
```

### Sync POS Data

**POST** `/pos/sync/batches`

#### Description
Processes batch sync transactions from offline POS devices. Supports idempotency to prevent duplicate processing.

#### Authentication
Required

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| device_id | string | Yes | max:255 |
| batch_uuid | string | Yes | uuid |
| transactions | array | Yes | min:1 transaction |

#### Transaction Object

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| local_txn_uuid | string | Yes | uuid |
| occurred_at | string | No | date |
| checkout | object | Yes | same as /pos/checkout |

#### Example Request
```bash
curl -X POST http://localhost/api/pos/sync/batches \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "device_id": "pos-device-001",
    "batch_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "transactions": [
      {
        "local_txn_uuid": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "checkout": {
          "payment_method": "CASH",
          "cash_received": 100000,
          "items": [
            {
              "product_id": 1,
              "qty": 2
            }
          ]
        }
      }
    ]
  }'
```

#### Success Response (All Processed)
```json
{
  "message": "Batch berhasil diproses.",
  "data": {
    "batch_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "status": "PROCESSED",
    "results": [
      {
        "local_txn_uuid": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "status": "PROCESSED",
        "sale_id": 124,
        "invoice_no": "INV-2026-124"
      }
    ]
  }
}
```

#### Success Response (Partial Failure)
```json
{
  "message": "Batch diproses dengan sebagian kegagalan.",
  "data": {
    "batch_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "status": "FAILED",
    "results": [
      {
        "local_txn_uuid": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "status": "PROCESSED",
        "sale_id": 124,
        "invoice_no": "INV-2026-124"
      },
      {
        "local_txn_uuid": "6ba7b810-9dad-11d1-80b4-00c04fd430c9",
        "status": "FAILED",
        "errors": {
          "qty": ["Jumlah item tidak valid."]
        }
      }
    ]
  }
}
```

---

## Push Notifications

### Subscribe to Push Notifications

**POST** `/push/subscriptions`

#### Description
Subscribes a user to web push notifications.

#### Authentication
Required

#### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| endpoint | string | Yes | max:512 |
| keys.p256dh | string | Yes | max:255 |
| keys.auth | string | Yes | max:255 |
| content_encoding | string | No | max:50 |

#### Example Request
```bash
curl -X POST http://localhost/api/push/subscriptions \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: your-csrf-token" \
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BID...",
      "auth": "gAAA..."
    },
    "content_encoding": "aes128gcm"
  }'
```

#### Success Response
```json
{
  "data": {
    "id": 1,
    "endpoint": "https://fcm.googleapis.com/fcm/send/..."
  },
  "message": "Subscription berhasil dibuat."
}
```

### Unsubscribe from Push Notifications

**DELETE** `/push/subscriptions`

#### Description
Removes the current user's push subscription.

#### Authentication
Required

#### Response
```json
{
  "message": "Subscription berhasil dihapus."
}
```

### Send Test Push Notification

**POST** `/push/test`

#### Description
Sends a test push notification to all subscribed users.

#### Authentication
Required (SUPERVISOR role)

#### Response
```json
{
  "message": "Pengiriman test push selesai.",
  "data": {
    "sent": 5,
    "failed": 0
  }
}
```

---

## Error Codes

### Validation Errors (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### Unauthorized (401)

```json
{
  "message": "Unauthorized."
}
```

### Not Found (404)

```json
{
  "message": "Resource not found."
}
```

### Internal Server Error (500)

```json
{
  "message": "Internal server error."
}
```

---

## Business Logic Notes

### Refund Policy
- Refunds must be requested within 2 days of the original sale
- Supervisor approval is required for all refunds
- The total refund amount cannot exceed the original payment
- Refunded items must be part of the original sale
- System checks item availability before allowing refunds

### Work Session Tracking
- Staff work time is tracked from login to logout
- If a user logs in again without logging out, the session continues
- Work time is stored in seconds and accumulated across multiple sessions
- Daily work data is reset when the work_date changes

### Stock Management
- Stock is tracked with 3 decimal precision
- Sale items reduce stock immediately
- Refunds restore stock to inventory
- Inventory recommendations calculate based on 7-day sales average
- Reorder point formula: (avg_sales_7d × lead_time) + safety_stock

### Sync Process
- POS sync uses batch processing for offline transactions
- Idempotency is enforced using device_id + local_txn_uuid
- Duplicate transactions are identified and skipped
- Partial failures allow successful transactions to complete
- Batch status indicates overall success or failure

### Authentication
- Session-based authentication is used
- CSRF tokens are required for POST/PUT/DELETE requests
- Staff can login using username/password or 6-digit PIN
- Supervisor login grants access to both admin and POS features
- Cashier login restricts access to POS features only
