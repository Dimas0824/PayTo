# Offline Sync Setup

Learn how to configure and manage offline transactions when the POS loses connection to the server.

## Overview

The offline sync feature allows the POS to continue operating during network outages by queuing transactions locally and syncing them automatically when connection is restored.

## Problem: Need to install and enable PWA for offline functionality

The POS terminal needs to work offline during internet outages.

### Solution

Install the PWA on the POS terminal:

**Step 1: Verify service worker registration**

The application automatically registers a service worker. Check browser console for:

```
ServiceWorker registration successful
```

**Step 2: Install PWA**

- Open Chrome on the POS terminal
- Click the installation prompt (appears when site loads)
- Or go to Chrome menu → "Install PayTo POS"

**Step 3: Verify offline capability**

- Disconnect network
- Open POS in browser
- Check console: "Offline mode enabled"
- Process test transactions - they should succeed

**What happens:**
- PWA caches all critical application files
- Service worker intercepts network requests
- Transactions are queued when offline
- Sync attempts are made when connection returns

## Problem: Understanding how the offline queue works

Transactions need to be stored locally when the POS is offline.

### Solution

The offline queue system:

**When online:**
- Transactions are sent immediately to the server
- No queue is used

**When offline:**
- Transactions are stored in browser IndexedDB
- Each transaction gets a `local_txn_uuid`
- Queue is persisted across browser sessions
- Maximum queue size: 100 transactions per device

**View queue status (development):**

```javascript
// In browser console (during development)
navigator.storage.estimate().then(estimate => {
  console.log('Storage used:', estimate.usage);
  console.log('Storage quota:', estimate.quota);
});
```

**Queue structure:**

```json
{
  "device_id": "pos-terminal-001",
  "batch_uuid": "b8f3a2c1-d4e5-6789-0123-456789abcdef",
  "transactions": [
    {
      "local_txn_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "checkout": {
        "payment_method": "CASH",
        "items": [...],
        "cash_received": 100000
      },
      "occurred_at": "2026-06-28T19:30:00+07:00"
    }
  ]
}
```

## Problem: Need to submit batch transactions after offline period

After internet connection is restored, queued transactions need to sync.

### Solution

The system automatically attempts sync every 30 seconds:

**Automatic sync process:**

```javascript
// Background sync event (in service worker)
self.addEventListener('sync', function(event) {
  if (event.tag === 'offline-sync') {
    event.waitUntil(syncOfflineTransactions());
  }
});
```

**Manual sync trigger (when connection detected):**

```javascript
// Check connection and trigger sync
if (navigator.onLine) {
  fetch('/api/pos/settings/refresh', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  });
}
```

**Sync response format:**

```json
{
  "message": "Batch berhasil diproses.",
  "data": {
    "batch_uuid": "b8f3a2c1-d4e5-6789-0123-456789abcdef",
    "status": "PROCESSED",
    "results": [
      {
        "local_txn_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "status": "PROCESSED",
        "sale_id": 789,
        "invoice_no": "INV-2026-000789"
      }
    ]
  }
}
```

**What happens on successful sync:**
- All transactions in the batch are processed
- Local queue entries are removed
- Sales IDs and invoice numbers are updated
- Receipts can be regenerated with official invoice numbers

## Problem: Sync fails and transactions need manual handling

Network issues may cause sync failures that need investigation.

### Solution

**Check sync status:**

```bash
GET /api/pos/settings
Authorization: Bearer {token}
```

**Look for sync errors in response:**

```json
{
  "data": {
    "sync_status": "ERROR",
    "last_sync_error": "Connection refused",
    "last_sync_at": "2026-06-28T19:45:00+07:00"
  }
}
```

**View failed transactions (development):**

```javascript
// In browser console
indexedDB.open('payto-db').then(db => {
  const tx = db.transaction('offline-queue', 'readonly');
  const store = tx.objectStore('offline-queue');
  store.getAll().then(items => {
    console.log('Failed transactions:', items);
  });
});
```

**Retry sync manually:**

```bash
POST /api/pos/settings/refresh
Authorization: Bearer {token}
```

**Force sync with batch UUID:**

```bash
POST /api/pos/sync/batches
Content-Type: application/json
Authorization: Bearer {token}

{
  "device_id": "pos-terminal-001",
  "batch_uuid": "b8f3a2c1-d4e5-6789-0123-456789abcdef",
  "transactions": [
    {
      "local_txn_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "checkout": {
        "payment_method": "CASH",
        "items": [...]
      }
    }
  ]
}
```

## Problem: Understanding idempotency with local_txn_uuid

Ensuring transactions aren't duplicated during sync retries.

### Solution

**Idempotency mechanism:**

1. Each transaction gets a unique `local_txn_uuid` (UUID v4)
2. The UUID is combined with `device_id` to create an idempotency key
3. The key is stored in the `sync_idempotency_keys` table
4. On retry, duplicate UUIDs are detected and skipped

**Idempotency check logic:**

```php
// In PosSyncController.php
$idempotencyKey = $deviceId . ':' . $localTransactionUuid;

$existingKey = SyncIdempotencyKey::query()
    ->where('key', $idempotencyKey)
    ->first();

if ($existingKey) {
    // Transaction was already processed
    return [
        'local_txn_uuid' => $localTransactionUuid,
        'status' => 'DUPLICATE',
        'sale_id' => $existingKey->ref_id,
    ];
}
```

**Duplicate detection response:**

```json
{
  "local_txn_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "DUPLICATE",
  "sale_id": 789
}
```

**Best practices for idempotency:**
- Never reuse `local_txn_uuid` values
- Generate UUIDs before attempting online transaction
- Include `local_txn_uuid` in all retry attempts
- Store UUID locally before network call