<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PosSyncBatchRequest;
use App\Models\SyncBatch;
use App\Models\SyncIdempotencyKey;
use App\Services\Pos\CheckoutProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PosSyncController extends Controller
{
    public function __construct(private CheckoutProcessor $checkoutProcessor) {}

    public function store(PosSyncBatchRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $user = $request->user() ?? \App\Models\User::query()->first();
        if (! $user) {
            return response()->json(['message' => 'Kasir tidak ditemukan.'], 422);
        }

        $batch = SyncBatch::query()->firstOrCreate(
            ['batch_uuid' => (string) $payload['batch_uuid']],
            [
                'device_id' => (string) $payload['device_id'],
                'status' => 'RECEIVED',
            ]
        );

        if ($batch->status === 'PROCESSED') {
            return response()->json([
                'message' => 'Batch sudah diproses.',
                'data' => [
                    'batch_uuid' => $batch->batch_uuid,
                    'status' => $batch->status,
                    'results' => [],
                ],
            ]);
        }

        $results = [];
        $hasFailures = false;
        $deviceId = (string) $payload['device_id'];

        foreach ($payload['transactions'] as $transaction) {
            $localTransactionUuid = (string) $transaction['local_txn_uuid'];
            $idempotencyKey = $deviceId.':'.$localTransactionUuid;

            $existingKey = SyncIdempotencyKey::query()->where('key', $idempotencyKey)->first();
            if ($existingKey) {
                $results[] = [
                    'local_txn_uuid' => $localTransactionUuid,
                    'status' => 'DUPLICATE',
                    'sale_id' => $existingKey->ref_id,
                ];

                continue;
            }

            try {
                $checkoutPayload = $transaction['checkout'];
                $checkoutPayload['local_txn_uuid'] = $localTransactionUuid;
                if (! empty($transaction['occurred_at'])) {
                    $checkoutPayload['occurred_at'] = $transaction['occurred_at'];
                }

                $result = $this->checkoutProcessor->process($checkoutPayload, $user);

                SyncIdempotencyKey::query()->create([
                    'key' => $idempotencyKey,
                    'ref_type' => 'sale',
                    'ref_id' => $result['sale_id'],
                ]);

                $results[] = [
                    'local_txn_uuid' => $localTransactionUuid,
                    'status' => 'PROCESSED',
                    'sale_id' => $result['sale_id'],
                    'invoice_no' => $result['invoice_no'],
                ];
            } catch (ValidationException $exception) {
                $hasFailures = true;
                $results[] = [
                    'local_txn_uuid' => $localTransactionUuid,
                    'status' => 'FAILED',
                    'errors' => $exception->errors(),
                ];
            }
        }

        $batch->update([
            'status' => $hasFailures ? 'FAILED' : 'PROCESSED',
            'pushed_at' => now(),
            'error_message' => $hasFailures ? 'Sebagian transaksi gagal diproses.' : null,
        ]);

        return response()->json([
            'message' => $hasFailures ? 'Batch diproses dengan sebagian kegagalan.' : 'Batch berhasil diproses.',
            'data' => [
                'batch_uuid' => $batch->batch_uuid,
                'status' => $batch->status,
                'results' => $results,
            ],
        ]);
    }
}
