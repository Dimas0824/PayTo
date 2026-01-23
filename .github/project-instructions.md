# POS Laravel Single Outlet - Copilot Instructions

## Project Overview

Sistem POS berbasis Laravel dengan fokus **offline-first PWA**, approval supervisor, smart inventory, dan receipt maker. Single outlet dengan 2 role: Kasir dan Supervisor.

---

## Critical Architecture Principles

### 1. Offline-First Design

- **ALWAYS** consider offline scenarios when writing features
- Use `local_txn_uuid` (UUID v4) for all transactions created on client
- Server assigns `server_invoice_no` only during sync
- Store critical data in IndexedDB: products, settings, stock_items, receipt_templates
- Implement idempotency using `device_id:local_txn_uuid` pattern

### 2. Data Integrity Rules (NON-NEGOTIABLE)

```php
// When sale becomes PAID, you MUST create:
DB::transaction(function () {
    // 1. Update sale status
    $sale->update(['status' => 'PAID']);
    
    // 2. Create payment record(s)
    $sale->payments()->create([...]);
    
    // 3. Create stock movements for EACH item
    foreach ($sale->items as $item) {
        StockMovement::create([
            'type' => 'SALE_OUT',
            'qty_delta' => -$item->qty,
            'ref_type' => 'sale',
            'ref_id' => $sale->id,
        ]);
    }
    
    // 4. Update stock cache
    StockItem::updateOnHand($productId);
});
```

### 3. Stock Management

- **Source of truth**: `stock_movements` (ledger)
- **Cache**: `stock_items.on_hand` for performance
- Never modify stock directly; always create movements
- Movement types: `SALE_OUT`, `RETURN_IN`, `ADJUSTMENT`, `SYNC_CORRECTION`

---

## Role-Based Access Control

### Kasir Capabilities

- Create transactions, scan barcode, checkout
- Apply discount ≤ limit (check `app_settings.discount_limit_percent`)
- Void transaction with reason (limited)
- Print/reprint receipts

### Supervisor Capabilities

- All Kasir capabilities
- Approve: discount override, price override, void, refund
- Stock adjustment/opname
- Manage products, receipt templates
- View inventory recommendations

### Approval Pattern

```php
// ALWAYS require for sensitive actions:
// 1. Supervisor PIN verification (hash comparison)
// 2. Reason (mandatory, min 10 chars)
// 3. Create approval record

if ($discountPercent > $discountLimit) {
    // Frontend: show approval modal
    // Backend: verify PIN + create approval
    Approval::create([
        'action' => 'DISCOUNT_OVERRIDE',
        'sale_id' => $sale->id,
        'requested_by' => $cashier->id,
        'approved_by' => $supervisor->id,
        'reason' => $request->reason,
        'payload_json' => [
            'old_discount' => 0,
            'new_discount' => $discountPercent,
            'limit' => $discountLimit,
        ],
    ]);
}
```

---

## Payment Implementation

### Cash Payment

```php
// Calculate change
$change = $amountReceived - $grandTotal;

Payment::create([
    'sale_id' => $sale->id,
    'method' => 'CASH',
    'amount' => $amountReceived,
    'status' => 'RECORDED',
]);
```

### E-Wallet (UI Only - Phase 1)

```php
// NO actual gateway integration
// Just record the payment intent

Payment::create([
    'sale_id' => $sale->id,
    'method' => 'EWALLET',
    'amount' => $grandTotal,
    'reference' => $request->reference, // Optional
    'status' => 'RECORDED', // Not 'PENDING' or 'CONFIRMED'
]);

// Frontend: show QR placeholder, instructions only
```

---

## Sync Implementation

### Push Sync Flow

```php
// POST /api/sync/push
{
    "device_id": "POS-DEVICE-01",
    "batch_uuid": "uuid-v4",
    "sales": [
        {
            "local_txn_uuid": "uuid-v4",
            "occurred_at": "2026-01-20T10:15:12",
            "cashier_username": "kasir1",
            "items": [...],
            "payments": [...],
            "approvals": [...],
            "stock_movements": [...]
        }
    ]
}

// Server response:
{
    "success": true,
    "mappings": [
        {
            "local_txn_uuid": "uuid-v4",
            "server_invoice_no": "INV-20260120-0001",
            "sale_id": 123
        }
    ]
}
```

### Idempotency Pattern

```php
$idempotencyKey = "{$deviceId}:{$localTxnUuid}";

$existing = SyncIdempotencyKey::where('key', $idempotencyKey)->first();
if ($existing) {
    // Already processed, return existing result
    return response()->json([
        'sale_id' => $existing->ref_id,
        'status' => 'already_processed'
    ]);
}

// Process and create key
DB::transaction(function () use ($idempotencyKey, $sale) {
    // ... create sale ...
    
    SyncIdempotencyKey::create([
        'key' => $idempotencyKey,
        'ref_type' => 'sale',
        'ref_id' => $sale->id,
    ]);
});
```

### Stock Conflict Handling

```php
// Check app_settings.allow_negative_stock
if (!$allowNegativeStock && $newOnHand < 0) {
    // Mark as SYNC_FAILED
    $sale->update([
        'status' => 'SYNC_FAILED',
        'error_message' => 'Insufficient stock'
    ]);
    
    // Create audit log
    AuditLog::create([
        'event' => 'SYNC_STOCK_CONFLICT',
        'entity_type' => 'sale',
        'entity_id' => $sale->local_txn_uuid,
        'meta_json' => [...]
    ]);
}
```

---

## Receipt Template System

### Template Structure

```php
// receipt_templates.template_json
{
    "paper": "80mm",
    "header": [
        {"type": "text", "value": "{store_name}", "align": "center", "bold": true},
        {"type": "text", "value": "Invoice: {invoice_no}", "align": "left"}
    ],
    "body": [
        {"type": "items_table", "columns": ["name", "qty", "price", "total"]},
        {"type": "divider"},
        {"type": "kv", "key": "Grand Total", "value": "{grand_total}", "bold": true}
    ],
    "footer": [
        {"type": "text", "value": "Thank you", "align": "center"}
    ]
}
```

### Available Placeholders

- `{store_name}`, `{invoice_no}`, `{date}`, `{time}`
- `{cashier_name}`, `{cashier_username}`
- `{subtotal}`, `{discount_total}`, `{tax_total}`, `{grand_total}`
- `{payment_method}`, `{paid_total}`, `{change_total}`

### Rendering Logic

```php
class ReceiptRenderer
{
    public function render(Sale $sale, ReceiptTemplate $template): string
    {
        $data = [
            'store_name' => config('app.store_name'),
            'invoice_no' => $sale->server_invoice_no ?? $sale->local_txn_uuid,
            'date' => $sale->occurred_at->format('Y-m-d'),
            'cashier_name' => $sale->cashier->name,
            'grand_total' => number_format($sale->grand_total, 0),
            // ... etc
        ];
        
        return $this->processTemplate($template->template_json, $data);
    }
}
```

### Reprint Consistency

```php
// ALWAYS use template version from original print
$printLog = ReceiptPrintLog::where('sale_id', $sale->id)
    ->orderBy('printed_at', 'desc')
    ->first();

$template = $printLog 
    ? ReceiptTemplate::find($printLog->template_id)
    : ReceiptTemplate::where('is_active', 1)->first();
```

---

## Smart Inventory

### Calculation Formula

```php
// Daily in scheduler (00:10)
$avgDailySales7d = DB::table('sale_items')
    ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
    ->where('sales.status', 'PAID')
    ->where('sales.occurred_at', '>=', now()->subDays(7))
    ->where('sale_items.product_id', $productId)
    ->sum('sale_items.qty') / 7;

$leadTimeDays = $product->lead_time_days ?? 3;
$safetyStock = $product->safety_stock ?? 0;

$reorderPoint = ($avgDailySales7d * $leadTimeDays) + $safetyStock;
$suggestedQty = max(0, $reorderPoint - $stockItem->on_hand);

InventoryRecommendation::updateOrCreate(
    ['product_id' => $productId],
    [
        'avg_daily_sales_7d' => $avgDailySales7d,
        'reorder_point' => $reorderPoint,
        'suggested_reorder_qty' => $suggestedQty,
        'computed_at' => now(),
    ]
);
```

### Scheduler Setup

```php
// routes/console.php or App\Console\Kernel
Schedule::command('inventory:calculate-recommendations')
    ->dailyAt('00:10')
    ->onOneServer();
```

---

## PWA Implementation

### Service Worker Strategy

```javascript
// Cache-first for static assets
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        // Network-first for API calls
        event.respondWith(networkFirst(event.request));
    } else {
        // Cache-first for assets
        event.respondWith(cacheFirst(event.request));
    }
});
```

### IndexedDB Schema

```javascript
const db = await openDB('pos-db', 1, {
    upgrade(db) {
        // Products catalog
        db.createObjectStore('products', { keyPath: 'id' });
        db.createObjectStore('products').createIndex('barcode', 'barcode', { unique: true });
        
        // Settings
        db.createObjectStore('settings', { keyPath: 'key' });
        
        // Offline queue
        db.createObjectStore('sync_queue', { keyPath: 'local_txn_uuid' });
        
        // Receipt templates
        db.createObjectStore('receipt_templates', { keyPath: 'id' });
    }
});
```

### Offline Transaction Storage

```javascript
// When creating transaction offline
const localTxn = {
    local_txn_uuid: uuidv4(),
    occurred_at: new Date().toISOString(),
    status: 'PENDING_SYNC',
    items: [...],
    payments: [...],
    approvals: [...],
};

await db.put('sync_queue', localTxn);
```

---

## Testing Strategy

### Must-Have Tests

#### 1. Checkout Integrity Test

```php
public function test_checkout_creates_all_required_records()
{
    $sale = Sale::factory()->create(['status' => 'DRAFT']);
    $items = SaleItem::factory()->count(3)->for($sale)->create();
    
    // Act: checkout
    $this->post("/api/sales/{$sale->id}/checkout", [
        'payment_method' => 'CASH',
        'amount_received' => 100000,
    ]);
    
    // Assert
    $sale->refresh();
    $this->assertEquals('PAID', $sale->status);
    $this->assertCount(1, $sale->payments);
    $this->assertCount(3, $sale->stockMovements);
    
    foreach ($items as $item) {
        $movement = StockMovement::where('ref_type', 'sale')
            ->where('ref_id', $sale->id)
            ->where('product_id', $item->product_id)
            ->first();
            
        $this->assertNotNull($movement);
        $this->assertEquals(-$item->qty, $movement->qty_delta);
    }
}
```

#### 2. Offline Sync Idempotency Test

```php
public function test_sync_prevents_duplicate_transactions()
{
    $payload = [
        'device_id' => 'TEST-DEVICE',
        'batch_uuid' => (string) Str::uuid(),
        'sales' => [
            [
                'local_txn_uuid' => (string) Str::uuid(),
                'occurred_at' => now()->toISOString(),
                'items' => [...],
                'payments' => [...],
            ]
        ]
    ];
    
    // First sync
    $response1 = $this->post('/api/sync/push', $payload);
    $saleId1 = $response1->json('mappings.0.sale_id');
    
    // Duplicate sync (same payload)
    $response2 = $this->post('/api/sync/push', $payload);
    $saleId2 = $response2->json('mappings.0.sale_id');
    
    // Should return same sale_id
    $this->assertEquals($saleId1, $saleId2);
    $this->assertEquals(1, Sale::count());
}
```

#### 3. Approval Required Test

```php
public function test_discount_over_limit_requires_supervisor_approval()
{
    $setting = AppSetting::create([
        'key' => 'discount_limit_percent',
        'value' => '10'
    ]);
    
    $sale = Sale::factory()->create(['subtotal' => 100000]);
    
    // Try 15% discount without approval
    $response = $this->actingAs($cashier)
        ->post("/api/sales/{$sale->id}/discount", [
            'discount_percent' => 15
        ]);
    
    $response->assertStatus(422);
    $response->assertJson(['error' => 'approval_required']);
    
    // With supervisor approval
    $response = $this->actingAs($cashier)
        ->post("/api/sales/{$sale->id}/discount", [
            'discount_percent' => 15,
            'supervisor_pin' => '1234',
            'reason' => 'Customer complaint'
        ]);
    
    $response->assertStatus(200);
    $this->assertDatabaseHas('approvals', [
        'action' => 'DISCOUNT_OVERRIDE',
        'sale_id' => $sale->id,
    ]);
}
```

#### 4. Smart Inventory Calculation Test

```php
public function test_smart_inventory_calculates_correct_reorder_qty()
{
    $product = Product::factory()->create([
        'lead_time_days' => 3,
        'safety_stock' => 10,
    ]);
    
    StockItem::create([
        'product_id' => $product->id,
        'on_hand' => 20,
    ]);
    
    // Create sales for last 7 days: 70 total qty = 10/day average
    Sale::factory()
        ->count(7)
        ->has(SaleItem::factory()->state([
            'product_id' => $product->id,
            'qty' => 10,
        ]))
        ->create(['status' => 'PAID', 'occurred_at' => now()->subDays(rand(1, 7))]);
    
    // Run calculation
    Artisan::call('inventory:calculate-recommendations');
    
    $rec = InventoryRecommendation::where('product_id', $product->id)->first();
    
    // avg = 10, reorder = (10 * 3) + 10 = 40
    // suggested = 40 - 20 = 20
    $this->assertEquals(10, $rec->avg_daily_sales_7d);
    $this->assertEquals(40, $rec->reorder_point);
    $this->assertEquals(20, $rec->suggested_reorder_qty);
}
```

---

## Frontend Conventions

### Inertia Page Structure

```jsx
// resources/js/Pages/POS/Checkout.jsx
import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export default function Checkout({ products, settings }) {
    const [cart, setCart] = useLocalStorage('pos_cart', []);
    const { queueTransaction, syncStatus } = useOfflineSync();
    
    // ... component logic
}
```

### Offline Transaction Pattern

```javascript
// hooks/useOfflineSync.js
export function useOfflineSync() {
    const queueTransaction = async (txnData) => {
        const localTxn = {
            local_txn_uuid: uuidv4(),
            device_id: getDeviceId(),
            occurred_at: new Date().toISOString(),
            ...txnData,
            _offline: true,
        };
        
        // Save to IndexedDB
        await db.put('sync_queue', localTxn);
        
        // Try sync immediately if online
        if (navigator.onLine) {
            await syncPendingTransactions();
        }
        
        return localTxn;
    };
    
    return { queueTransaction, syncStatus };
}
```

### Supervisor Approval Modal

```jsx
// components/SupervisorApprovalModal.jsx
function SupervisorApprovalModal({ action, onApprove, onCancel }) {
    const [pin, setPin] = useState('');
    const [reason, setReason] = useState('');
    
    const handleSubmit = async () => {
        const response = await fetch('/api/approvals/verify', {
            method: 'POST',
            body: JSON.stringify({ action, pin, reason }),
        });
        
        if (response.ok) {
            onApprove(await response.json());
        }
    };
    
    return (
        <Modal>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} 
                   placeholder="Supervisor PIN" />
            <textarea value={reason} onChange={e => setReason(e.target.value)}
                      placeholder="Reason (min 10 chars)" minLength={10} required />
            <button onClick={handleSubmit}>Approve</button>
        </Modal>
    );
}
```

---

## Common Pitfalls to Avoid

### ❌ DON'T

```php
// Never update stock directly
$stockItem->update(['on_hand' => $newQty]);

// Never create sale without movements
$sale->update(['status' => 'PAID']);

// Never use env() outside config
$limit = env('DISCOUNT_LIMIT');

// Never trust frontend for sensitive calcs
$total = $request->grand_total; // ❌
```

### ✅ DO

```php
// Always create movement
StockMovement::create([
    'type' => 'SALE_OUT',
    'qty_delta' => -$qty,
]);
StockItem::recalculate($productId);

// Atomic checkout
DB::transaction(function () {
    // sale + payments + movements
});

// Use config
$limit = config('pos.discount_limit');

// Recalculate on backend
$total = $sale->items->sum('line_total') - $sale->discount_total;
```

---

## Audit & Security Checklist

### Every Sensitive Action Must Have

- [ ] Audit log entry with `actor_id`, `event`, `meta_json`
- [ ] Approval record if supervisor override
- [ ] Reason (min 10 chars) for approvals
- [ ] Timestamp (`occurred_at` for offline, `created_at` always)

### PIN Security

```php
// Storing supervisor PIN
$user->update([
    'supervisor_pin_hash' => Hash::make($pin)
]);

// Verifying PIN
if (!Hash::check($inputPin, $supervisor->supervisor_pin_hash)) {
    throw new UnauthorizedException('Invalid PIN');
}
```

### Rate Limiting for Sync

```php
// routes/api.php
Route::post('/sync/push', [SyncController::class, 'push'])
    ->middleware('throttle:100,1'); // 100 requests per minute
```

---

## Migration Best Practices

### Product Table

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('sku')->unique()->nullable();
    $table->string('barcode')->unique()->nullable();
    $table->decimal('price', 12, 2);
    $table->decimal('cost', 12, 2)->nullable();
    $table->string('uom')->default('pcs');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    
    $table->index('name');
    $table->index(['is_active', 'created_at']);
});
```

### Sales Table with Offline Support

```php
Schema::create('sales', function (Blueprint $table) {
    $table->id();
    $table->string('server_invoice_no')->unique()->nullable();
    $table->char('local_txn_uuid', 36)->unique();
    $table->enum('status', ['DRAFT', 'PENDING_PAYMENT', 'PAID', 'VOID', 'SYNC_FAILED']);
    $table->foreignId('cashier_id')->constrained('users');
    $table->decimal('subtotal', 12, 2);
    $table->decimal('discount_total', 12, 2)->default(0);
    $table->decimal('tax_total', 12, 2)->default(0);
    $table->decimal('grand_total', 12, 2);
    $table->decimal('paid_total', 12, 2)->default(0);
    $table->decimal('change_total', 12, 2)->default(0);
    $table->timestamp('occurred_at');
    $table->timestamp('synced_at')->nullable();
    $table->timestamps();
    
    $table->index('local_txn_uuid');
    $table->index('server_invoice_no');
    $table->index(['status', 'occurred_at']);
    $table->index(['cashier_id', 'occurred_at']);
});
```

---

## Deployment & Environment

### Required ENV Variables

```env
# App
APP_NAME="POS Laravel"
APP_STORE_NAME="Toko Makmur"

# POS Settings
POS_DISCOUNT_LIMIT_PERCENT=10
POS_ALLOW_NEGATIVE_STOCK=false
POS_OFFLINE_LOGIN_ENABLED=true

# Smart Inventory
INVENTORY_DEFAULT_LEAD_TIME_DAYS=3
INVENTORY_DEFAULT_SAFETY_STOCK=0
```

### Artisan Commands to Create

```bash
php artisan make:command InventoryCalculateRecommendations
php artisan make:command SyncReconcileStockConflicts
php artisan make:command PruneOldAuditLogs
```

---

## Quick Reference

### Status Flow

```
DRAFT → PENDING_PAYMENT → PAID → (VOID)
                        ↓
                   SYNC_FAILED
```

### Movement Types

- `SALE_OUT`: qty_delta negative
- `RETURN_IN`: qty_delta positive
- `ADJUSTMENT`: supervisor correction
- `SYNC_CORRECTION`: auto-fix conflicts

### Approval Actions

- `DISCOUNT_OVERRIDE`
- `PRICE_OVERRIDE`
- `VOID`
- `REFUND`

### API Endpoints Priority

1. `/api/sync/push` - Most critical
2. `/api/sync/pull` - Second priority
3. `/api/catalog/products` - Cache heavily
4. `/api/receipts/active-template` - Cache heavily

---

## Documentation Requirements

When documenting code:

```php
/**
 * Process offline transaction batch with idempotency guarantee.
 * 
 * Handles stock conflict based on allow_negative_stock setting.
 * Creates approval records for supervisor overrides.
 * 
 * @param array $batch ['device_id', 'batch_uuid', 'sales' => [...]]
 * @return array ['success' => bool, 'mappings' => [...], 'conflicts' => [...]]
 * @throws InsufficientStockException if not allowed negative
 */
```

---

## Emergency Procedures

### Stock Mismatch Detected

1. Stop new transactions on affected products
2. Run stock reconciliation:

```php
Artisan::call('sync:reconcile-stock', ['product_id' => $id]);
```

3. Create SYNC_CORRECTION movements
2. Update audit log
3. Resume operations

### Sync Failure Accumulation

1. Check `/api/sync/failed-batches`
2. Review error messages in `sync_batches`
3. Fix data issues
4. Mark for retry:

```php
SyncBatch::where('status', 'FAILED')
    ->update(['status' => 'RECEIVED']);
```

---

## Performance Optimization

### Database Indexes (Critical)

```sql
-- For sync queries
CREATE INDEX idx_sales_sync ON sales(synced_at, status);
CREATE INDEX idx_movements_ref ON stock_movements(ref_type, ref_id);

-- For inventory calcs
CREATE INDEX idx_sale_items_product_date ON sale_items(product_id, created_at);

-- For approvals
CREATE INDEX idx_approvals_action_date ON approvals(action, occurred_at);
```

### Caching Strategy

```php
// Cache product catalog for 1 hour
Cache::remember('pos:products:active', 3600, function () {
    return Product::where('is_active', true)
        ->with('stockItem')
        ->get();
});

// Cache settings indefinitely (manual invalidation)
Cache::rememberForever('pos:settings', function () {
    return AppSetting::pluck('value', 'key');
});
```

---

## Final Notes

- **NEVER** skip the DB transaction when creating sales
- **ALWAYS** use `search-docs` tool for Laravel/Inertia questions
- **ALWAYS** run tests after changes: `php artisan test --filter=<test>`
- **ALWAYS** run Pint before commit: `vendor/bin/pint --dirty`
- **OFFLINE FIRST** is not optional - design every feature with offline in mind
- Ask user to run `npm run dev` or `composer run dev` if frontend changes not reflected

For questions about this architecture, search internal docs or ask supervisor.
