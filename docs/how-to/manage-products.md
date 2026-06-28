# Managing Products and Inventory

Learn how to add, update, and manage products in the PayTo POS system, including inventory tracking and low-stock alerts.

## Overview

Product management allows administrators to maintain the product catalog and monitor inventory levels. The system provides automated restock recommendations based on sales history.

## Problem: Need to add a new product

You need to add a new product to the catalog with initial stock levels.

### Solution

Use the admin products API to create a new product:

```bash
POST /api/admin/products
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Coca-Cola 330ml",
  "sku": "DRK-001",
  "barcode": "1234567890123",
  "price": 5000,
  "discount": 0,
  "cost": 3500,
  "uom": "Botol",
  "is_active": true,
  "stock": 100
}
```

**Expected response:**

```json
{
  "data": {
    "id": 123,
    "name": "Coca-Cola 330ml",
    "sku": "DRK-001",
    "barcode": "1234567890123",
    "price": 5000,
    "discount": 0,
    "price_after_discount": 5000,
    "cost": 3500,
    "uom": "Botol",
    "stock": 100,
    "is_active": true,
    "status": "ACTIVE"
  },
  "message": "Produk berhasil ditambahkan."
}
```

**What happens:**
- Product record is created with the specified attributes
- Stock item is automatically created with `on_hand` set to the initial stock value
- Product appears in POS product listings immediately

## Problem: Need to update product details or stock

Product information changes (price, stock levels, etc.) need to be reflected in the system.

### Solution

Update product details using the product ID:

```bash
PUT /api/admin/products/123
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Coca-Cola 330ml (Diskon 10%)",
  "price": 5000,
  "discount": 10,
  "stock": 95
}
```

**Expected response:**

```json
{
  "data": {
    "id": 123,
    "name": "Coca-Cola 330ml (Diskon 10%)",
    "price": 5000,
    "discount": 10,
    "price_after_discount": 4500,
    "stock": 95,
    "status": "ACTIVE"
  },
  "message": "Produk berhasil diperbarui."
}
```

**What happens:**
- Product attributes are updated
- Stock levels are adjusted (decrements from sales are tracked separately)
- POS terminals automatically receive updated pricing

## Problem: Need to check for low stock items

Monitoring inventory levels to prevent stockouts during peak hours.

### Solution

Check low stock alerts using the inventory recommendations endpoint:

```bash
GET /api/admin/inventory/recommendations
Authorization: Bearer {token}
```

**Expected response:**

```json
{
  "data": [
    {
      "id": 45,
      "productName": "Teh Botol",
      "sku": "DRK-002",
      "stock": 5,
      "avgSales7d": 12.5,
      "leadTime": 3,
      "reorderPoint": 40.5,
      "suggestedQty": 35.5,
      "status": "CRITICAL"
    },
    {
      "id": 67,
      "productName": "Aqua 600ml",
      "sku": "DRK-003",
      "stock": 25,
      "avgSales7d": 8.2,
      "leadTime": 2,
      "reorderPoint": 20.4,
      "suggestedQty": 0,
      "status": "WARNING"
    }
  ],
  "meta": {
    "window_days": 7,
    "computed_at": "2026-06-29 20:30:00"
  }
}
```

**Status meanings:**
- **CRITICAL**: Stock at or below safety stock level - immediate restock needed
- **WARNING**: Stock at or below reorder point - restock recommended soon
- **SAFE**: Stock levels are adequate

## Problem: Need to view restock recommendations

Calculating optimal reorder quantities based on historical sales data.

### Solution

The same inventory recommendations endpoint provides suggested reorder quantities:

```json
{
  "id": 45,
  "productName": "Teh Botol",
  "stock": 5,
  "avgSales7d": 12.5,
  "leadTime": 3,
  "reorderPoint": 40.5,
  "suggestedQty": 35.5,
  "status": "CRITICAL"
}
```

**How it works:**
- `avgSales7d`: Average daily sales over the last 7 days
- `leadTime`: Supplier delivery time (days)
- `reorderPoint`: (`avgSales7d` × `leadTime`) + `safetyStock`
- `suggestedQty`: `reorderPoint` - `currentStock` (minimum 0)

## Problem: Need to deactivate or delete a product

Removing obsolete or discontinued products from the catalog.

### Solution

Deactivate a product (recommended for ongoing businesses):

```bash
PUT /api/admin/products/123
Content-Type: application/json
Authorization: Bearer {token}

{
  "is_active": false
}
```

**Expected response:**

```json
{
  "data": {
    "id": 123,
    "status": "INACTIVE",
    "is_active": false
  },
  "message": "Produk berhasil diperbarui."
}
```

To delete a product permanently (with no sales history):

```bash
DELETE /api/admin/products/123
Authorization: Bearer {token}
```

**Important considerations:**
- Deactivated products won't appear in POS product lists
- Products with sales history should be deactivated, not deleted
- Deactivated products maintain their inventory history for reporting
- Deletion is permanent and irreversible