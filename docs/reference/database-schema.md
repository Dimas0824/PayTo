# Database Schema Reference

## Overview

- **Database Engine**: MySQL
- **Total Tables**: 24
- **Default Connection**: `mysql` via `DB_CONNECTION`
- **Database Name**: `payto`

## Tables by Category

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | System users (cashiers, supervisors) with role-based access |
| `products` | Product catalog with pricing and inventory tracking |
| `categories` | Product category definitions |
| `sales` | Sales transactions with multi-payment support |
| `sale_items` | Line items for each sale transaction |
| `stock_items` | Inventory stock levels per product |
| `stock_movements` | Historical stock movement records |
| `refunds` | Product refund records |
| `refund_items` | Individual refunded items |

### System Tables

| Table | Description |
|-------|-------------|
| `app_settings` | Application configuration key-value pairs |
| `cache` | Cache storage for application data |
| `cache_locks` | Cache lock management for concurrent access |
| `failed_jobs` | Failed queue job records |
| `jobs` | Queue job waiting/processing records |
| `sync_batches` | Device sync batch tracking |
| `sync_idempotency_keys` | Idempotency key tracking for sync operations |

### Feature Tables

| Table | Description |
|-------|-------------|
| `approvals` | Approval workflow records for special actions |
| `push_subscriptions` | Web push notification subscription data |
| `work_time_logs` | Employee work time tracking logs |
| `inventory_recommendations` | Automated inventory restocking recommendations |
| `receipt_templates` | Receipt template definitions |
| `receipt_print_logs` | Receipt printing audit trail |
| `audit_logs` | Application activity audit trail |

## Table Details

### `app_settings`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `key` | varchar(255) | NO | - | Unique setting key |
| `value` | text | YES | NULL | Setting value |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `key`

**Foreign Keys:** None

---

### `products`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `name` | varchar(255) | NO | - | Product name |
| `sku` | varchar(255) | YES | NULL | Stock keeping unit |
| `barcode` | varchar(255) | YES | NULL | Product barcode |
| `price` | decimal(12,2) | NO | 0.00 | Selling price |
| `cost` | decimal(12,2) | YES | NULL | Cost price |
| `discount` | decimal(8,2) | NO | 0.00 | Default discount |
| `uom` | varchar(255) | NO | 'pcs' | Unit of measure |
| `is_active` | tinyint(1) | NO | 1 | Active status |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `barcode`
- Unique: `sku`

**Foreign Keys:** None

---

### `users`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `name` | varchar(255) | NO | - | Full name |
| `username` | varchar(255) | NO | - | Unique username |
| `password_hash` | varchar(255) | NO | - | Password hash |
| `remember_token` | varchar(100) | YES | NULL | Remember me token |
| `role` | enum('CASHIER','SUPERVISOR') | NO | 'CASHIER' | User role |
| `supervisor_pin_hash` | varchar(255) | YES | NULL | Supervisor PIN hash |
| `pin_hash` | varchar(255) | YES | NULL | User PIN hash |
| `is_active` | tinyint(1) | NO | 1 | Active status |
| `last_login_at` | timestamp | YES | NULL | Last login time |
| `last_logout_at` | timestamp | YES | NULL | Last logout time |
| `work_date` | date | YES | NULL | Current work date |
| `work_seconds` | int unsigned | NO | 0 | Work time accumulated |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `username`

**Foreign Keys:** None

---

### `sales`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `server_invoice_no` | varchar(255) | YES | NULL | Server-side invoice number |
| `local_txn_uuid` | char(36) | NO | - | Local transaction UUID |
| `status` | enum('DRAFT','PENDING_PAYMENT','PAID','VOID','SYNC_FAILED') | NO | 'DRAFT' | Sale status |
| `subtotal` | decimal(12,2) | NO | 0.00 | Subtotal amount |
| `discount_total` | decimal(12,2) | NO | 0.00 | Total discounts |
| `tax_total` | decimal(12,2) | NO | 0.00 | Total tax |
| `total` | decimal(12,2) | NO | 0.00 | Grand total |
| `cashier_id` | bigint unsigned | NO | - | Cashier user ID |
| `sync_batch_id` | bigint unsigned | YES | NULL | Sync batch reference |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `cashier_id` → `users.id` (NO ACTION)
- Foreign: `sync_batch_id` → `sync_batches.id` (SET NULL)

---

### `sale_items`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `sale_id` | bigint unsigned | NO | - | Sale reference |
| `product_id` | bigint unsigned | NO | - | Product reference |
| `product_name_snapshot` | varchar(255) | NO | - | Product name at time of sale |
| `unit_price` | decimal(12,2) | NO | - | Unit selling price |
| `qty` | decimal(12,3) | NO | 0.000 | Quantity sold |
| `discount_amount` | decimal(12,2) | NO | 0.00 | Discount per line |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `sale_id` → `sales.id` (CASCADE)
- Foreign: `product_id` → `products.id` (NO ACTION)

---

### `stock_items`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `product_id` | bigint unsigned | NO | - | Product reference |
| `on_hand` | decimal(12,3) | NO | 0.000 | Current stock level |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `product_id` → `products.id` (NO ACTION)

---

### `stock_movements`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `product_id` | bigint unsigned | NO | - | Product reference |
| `type` | enum('SALE_OUT','RETURN_IN','ADJUSTMENT','SYNC_CORRECTION') | NO | - | Movement type |
| `qty_delta` | decimal(12,3) | NO | - | Quantity change |
| `reference_type` | varchar(255) | YES | NULL | Reference entity type |
| `reference_id` | varchar(255) | YES | NULL | Reference entity ID |
| `created_at` | timestamp | YES | NULL | Creation timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `product_id` → `products.id` (NO ACTION)

---

### `refunds`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `sale_id` | bigint unsigned | NO | - | Original sale reference |
| `requested_by` | bigint unsigned | NO | - | User who requested refund |
| `approved_by` | bigint unsigned | YES | NULL | User who approved refund |
| `approved_at` | timestamp | YES | NULL | Approval timestamp |
| `reason` | text | YES | NULL | Refund reason |
| `status` | enum('REQUESTED','APPROVED','COMPLETED') | NO | 'REQUESTED' | Refund status |
| `total_amount` | decimal(12,2) | NO | 0.00 | Total refund amount |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `sale_id` → `sales.id` (CASCADE)
- Foreign: `requested_by` → `users.id` (NO ACTION)
- Foreign: `approved_by` → `users.id` (NO ACTION)

---

### `refund_items`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `refund_id` | bigint unsigned | NO | - | Refund reference |
| `sale_item_id` | bigint unsigned | NO | - | Original sale item |
| `product_id` | bigint unsigned | NO | - | Product reference |
| `product_name_snapshot` | varchar(255) | NO | - | Product name snapshot |
| `unit_price` | decimal(12,2) | NO | - | Unit price at refund |
| `qty` | decimal(12,3) | NO | 0.000 | Refunded quantity |
| `created_at` | timestamp | YES | NULL | Creation timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `refund_id` → `refunds.id` (CASCADE)
- Foreign: `sale_item_id` → `sale_items.id` (CASCADE)
- Foreign: `product_id` → `products.id` (NO ACTION)

---

### `approvals`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `action` | enum('DISCOUNT_OVERRIDE','PRICE_OVERRIDE','VOID','REFUND') | NO | - | Approval action type |
| `sale_id` | bigint unsigned | YES | NULL | Related sale (if any) |
| `requested_by` | bigint unsigned | NO | - | User who requested |
| `approved_by` | bigint unsigned | YES | NULL | User who approved |
| `approved_at` | timestamp | YES | NULL | Approval timestamp |
| `reason` | text | YES | NULL | Reason for approval |
| `status` | enum('PENDING','APPROVED','REJECTED') | NO | 'PENDING' | Approval status |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `sale_id` → `sales.id` (NO ACTION)
- Foreign: `requested_by` → `users.id` (NO ACTION)
- Foreign: `approved_by` → `users.id` (NO ACTION)

---

### `payments`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `sale_id` | bigint unsigned | NO | - | Sale reference |
| `method` | enum('CASH','EWALLET') | NO | 'CASH' | Payment method |
| `amount` | decimal(12,2) | NO | 0.00 | Payment amount |
| `reference` | varchar(255) | YES | NULL | Payment reference (e.g., transaction ID) |
| `status` | enum('RECORDED','CONFIRMED') | NO | 'RECORDED' | Payment status |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `sale_id` → `sales.id` (CASCADE)

---

### `receipt_templates`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `name` | varchar(255) | NO | - | Template name |
| `version` | int | NO | 1 | Template version |
| `is_active` | tinyint(1) | NO | 0 | Active template flag |
| `template_json` | json | NO | - | JSON template definition |
| `created_by` | bigint unsigned | NO | - | Creator user ID |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `created_by` → `users.id` (NO ACTION)

---

### `receipt_print_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `sale_id` | bigint unsigned | NO | - | Sale reference |
| `template_id` | bigint unsigned | NO | - | Template used |
| `printed_by` | bigint unsigned | NO | - | User who printed |
| `printed_at` | timestamp | YES | NULL | Print timestamp |
| `status` | enum('SUCCESS','FAILED') | NO | - | Print status |
| `error_message` | text | YES | NULL | Error details |
| `created_at` | timestamp | YES | NULL | Creation timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `sale_id` → `sales.id` (NO ACTION)
- Foreign: `template_id` → `receipt_templates.id` (NO ACTION)
- Foreign: `printed_by` → `users.id` (NO ACTION)

---

### `audit_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `actor_id` | bigint unsigned | YES | NULL | User ID (if available) |
| `event` | varchar(255) | NO | - | Event type/name |
| `entity_type` | varchar(255) | YES | NULL | Affected entity type |
| `entity_id` | varchar(255) | YES | NULL | Affected entity ID |
| `meta_json` | json | YES | NULL | Additional event metadata |
| `occurred_at` | timestamp | YES | NULL | Event timestamp |
| `created_at` | timestamp | YES | NULL | Log creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `actor_id` → `users.id` (NO ACTION)

---

### `push_subscriptions`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `user_id` | bigint unsigned | YES | NULL | User reference |
| `endpoint` | varchar(512) | NO | - | Push endpoint URL |
| `public_key` | varchar(255) | NO | - | VAPID public key |
| `auth_token` | varchar(255) | NO | - | VAPID auth token |
| `content_encoding` | varchar(50) | NO | 'aesgcm' | Content encoding |
| `user_agent` | text | YES | NULL | Browser user agent |
| `last_seen_at` | timestamp | YES | NULL | Last activity timestamp |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `endpoint`
- Foreign: `user_id` → `users.id` (SET NULL)

---

### `inventory_recommendations`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `product_id` | bigint unsigned | NO | - | Product reference |
| `avg_daily_sales_7d` | decimal(12,3) | NO | 0.000 | 7-day average daily sales |
| `avg_daily_sales_30d` | decimal(12,3) | NO | 0.000 | 30-day average daily sales |
| `lead_time_days` | int | NO | 3 | Supplier lead time |
| `safety_stock` | decimal(12,3) | NO | 0.000 | Safety stock level |
| `reorder_point` | decimal(12,3) | NO | 0.000 | Reorder threshold |
| `suggested_reorder_qty` | decimal(12,3) | NO | 0.000 | Recommended order quantity |
| `computed_at` | timestamp | YES | NULL | Computation timestamp |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `product_id` → `products.id` (NO ACTION)

---

### `sync_batches`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `device_id` | varchar(255) | NO | - | Device identifier |
| `batch_uuid` | char(36) | NO | - | Unique batch UUID |
| `pushed_at` | timestamp | YES | NULL | Push timestamp |
| `status` | enum('RECEIVED','PROCESSED','FAILED') | NO | 'RECEIVED' | Batch status |
| `error_message` | text | YES | NULL | Error details |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `batch_uuid`

---

### `sync_idempotency_keys`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `key` | varchar(255) | NO | - | Idempotency key |
| `ref_type` | varchar(255) | YES | NULL | Reference type |
| `ref_id` | bigint unsigned | YES | NULL | Reference ID |
| `created_at` | timestamp | YES | NULL | Creation timestamp |
| `updated_at` | timestamp | YES | NULL | Last update timestamp |

**Indexes:**
- Primary: `id`
- Unique: `key`

---

### `cache`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `key` | varchar(255) | NO | - | Cache key |
| `value` | mediumtext | NO | - | Cache value |
| `expiration` | int | NO | - | Expiration timestamp |

**Indexes:**
- Primary: `key`
- Index: `expiration`

---

### `cache_locks`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `key` | varchar(255) | NO | - | Lock key |
| `owner` | varchar(255) | NO | - | Lock owner |
| `expiration` | int | NO | - | Expiration timestamp |

**Indexes:**
- Primary: `key`
- Index: `expiration`

---

### `failed_jobs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `uuid` | varchar(255) | NO | - | Unique UUID |
| `connection` | text | NO | - | Queue connection |
| `queue` | text | NO | - | Queue name |
| `payload` | longtext | NO | - | Job payload |
| `exception` | longtext | NO | - | Exception details |
| `failed_at` | timestamp | NO | CURRENT_TIMESTAMP | Failure timestamp |

**Indexes:**
- Primary: `id`
- Unique: `uuid`

---

### `jobs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `queue` | varchar(255) | NO | - | Queue name |
| `payload` | longtext | NO | - | Job payload |
| `attempts` | tinyint unsigned | NO | 0 | Retry count |
| `reserved_at` | int unsigned | YES | NULL | Reserved timestamp |
| `available_at` | int unsigned | NO | - | Available timestamp |
| `created_at` | int unsigned | NO | - | Creation timestamp |

**Indexes:**
- Primary: `id`
- Index: `queue`

---

### `work_time_logs`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | bigint unsigned | NO | - | Primary key |
| `user_id` | bigint unsigned | NO | - | User reference |
| `action` | enum('START','PAUSE','RESUME','END') | NO | - | Action type |
| `timestamp` | timestamp | NO | - | Action timestamp |
| `duration_seconds` | int unsigned | YES | NULL | Duration in seconds |
| `created_at` | timestamp | YES | NULL | Creation timestamp |

**Indexes:**
- Primary: `id`
- Foreign: `user_id` → `users.id` (NO ACTION)

---

## Entity Relationship Overview

### Core Sales Flow

1. **Users** create **Sales** transactions
2. Each **Sale** contains multiple **Sale Items** referencing **Products**
3. **Payments** are recorded against **Sales**
4. When **Sales** are completed, **Stock Movements** update inventory
5. **Stock Items** track current stock levels per **Product**

### Refund Flow

1. **Refunds** reference original **Sales** and are initiated by **Users**
2. **Refund Items** reference original **Sale Items**
3. Refunds require approval via **Approvals** table

### Inventory Management

1. **Products** have associated **Stock Items** for current inventory
2. **Stock Movements** track all inventory changes:
   - `SALE_OUT`: Decrease from sales
   - `RETURN_IN`: Increase from returns
   - `ADJUSTMENT`: Manual adjustments
   - `SYNC_CORRECTION`: Sync corrections
3. **Inventory Recommendations** provide restocking suggestions based on sales history

### Audit & Compliance

1. **Approvals** track special actions (discount overrides, voids, refunds)
2. **Audit Logs** record application events
3. **Receipt Print Logs** track receipt generation

### Device Sync

1. **Sync Batches** track device-to-server synchronization
2. **Sync Idempotency Keys** prevent duplicate submissions

---

## Enum Reference

### `users.role`
- `CASHIER`
- `SUPERVISOR`

### `sales.status`
- `DRAFT`
- `PENDING_PAYMENT`
- `PAID`
- `VOID`
- `SYNC_FAILED`

### `stock_movements.type`
- `SALE_OUT`
- `RETURN_IN`
- `ADJUSTMENT`
- `SYNC_CORRECTION`

### `refunds.status`
- `REQUESTED`
- `APPROVED`
- `COMPLETED`

### `approvals.action`
- `DISCOUNT_OVERRIDE`
- `PRICE_OVERRIDE`
- `VOID`
- `REFUND`

### `approvals.status`
- `PENDING`
- `APPROVED`
- `REJECTED`

### `payments.method`
- `CASH`
- `EWALLET`

### `payments.status`
- `RECORDED`
- `CONFIRMED`

### `receipt_print_logs.status`
- `SUCCESS`
- `FAILED`

### `sync_batches.status`
- `RECEIVED`
- `PROCESSED`
- `FAILED`

### `work_time_logs.action`
- `START`
- `PAUSE`
- `RESUME`
- `END`

---

*Last updated: June 28, 2026*
