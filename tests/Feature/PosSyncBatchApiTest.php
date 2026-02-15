<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PosSyncBatchApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_sync_checkout_batch_and_prevent_duplicate_transaction(): void
    {
        User::factory()->create([
            'role' => 'CASHIER',
            'is_active' => true,
        ]);

        $product = Product::query()->create([
            'name' => 'Kopi Latte',
            'sku' => 'KP-001',
            'barcode' => 'KP-001',
            'price' => 25000,
            'discount' => 10,
            'cost' => 12000,
            'uom' => 'pcs',
            'is_active' => true,
        ]);

        $localTransactionUuid = (string) Str::uuid();
        $payload = [
            'device_id' => 'device-test-1',
            'batch_uuid' => (string) Str::uuid(),
            'transactions' => [
                [
                    'local_txn_uuid' => $localTransactionUuid,
                    'occurred_at' => now()->toISOString(),
                    'checkout' => [
                        'payment_method' => 'EWALLET',
                        'items' => [
                            [
                                'product_id' => $product->id,
                                'qty' => 1,
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->postJson('/api/pos/sync/batches', $payload);

        $response
            ->assertOk()
            ->assertJsonPath('data.status', 'PROCESSED')
            ->assertJsonPath('data.results.0.status', 'PROCESSED');

        $this->assertDatabaseHas('sales', [
            'local_txn_uuid' => $localTransactionUuid,
            'status' => 'PAID',
        ]);

        $this->assertDatabaseHas('sync_idempotency_keys', [
            'key' => 'device-test-1:'.$localTransactionUuid,
            'ref_type' => 'sale',
        ]);

        $duplicatePayload = $payload;
        $duplicatePayload['batch_uuid'] = (string) Str::uuid();

        $duplicateResponse = $this->postJson('/api/pos/sync/batches', $duplicatePayload);

        $duplicateResponse
            ->assertOk()
            ->assertJsonPath('data.results.0.status', 'DUPLICATE');

        $this->assertDatabaseCount('sales', 1);
    }

    public function test_sync_batch_returns_failed_status_for_invalid_checkout_data(): void
    {
        User::factory()->create([
            'role' => 'CASHIER',
            'is_active' => true,
        ]);

        $product = Product::query()->create([
            'name' => 'Teh Tarik',
            'sku' => 'TH-001',
            'barcode' => 'TH-001',
            'price' => 10000,
            'discount' => 0,
            'cost' => 4000,
            'uom' => 'pcs',
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/pos/sync/batches', [
            'device_id' => 'device-test-2',
            'batch_uuid' => (string) Str::uuid(),
            'transactions' => [
                [
                    'local_txn_uuid' => (string) Str::uuid(),
                    'checkout' => [
                        'payment_method' => 'CASH',
                        'cash_received' => 100,
                        'items' => [
                            [
                                'product_id' => $product->id,
                                'qty' => 1,
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.status', 'FAILED')
            ->assertJsonPath('data.results.0.status', 'FAILED');
    }
}
