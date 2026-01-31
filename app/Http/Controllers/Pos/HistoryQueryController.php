<?php

namespace App\Http\Controllers\Pos;

use App\Models\Sale;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class HistoryQueryController
{
    /**
     * @param  array{userId?: int|null, startDate?: string|null, endDate?: string|null}  $filters
     */
    public function fetch(int $limit = 10, array $filters = []): array
    {
        return $this->buildQuery($filters)
            ->limit($limit)
            ->get()
            ->map(fn (Sale $sale) => $this->mapSale($sale))
            ->all();
    }

    /**
     * @param  array{userId?: int|null, startDate?: string|null, endDate?: string|null}  $filters
     * @return array{data: array<int, array<string, mixed>>, meta: array<string, int>}
     */
    public function fetchPaginated(int $page, int $perPage, array $filters = []): array
    {
        $paginator = $this->buildQuery($filters)
            ->paginate($perPage, ['*'], 'page', $page);

        $data = $paginator->getCollection()
            ->map(fn (Sale $sale) => $this->mapSale($sale))
            ->values()
            ->all();

        return [
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ];
    }

    /**
     * @param  array{userId?: int|null, startDate?: string|null, endDate?: string|null}  $filters
     */
    protected function buildQuery(array $filters = []): Builder
    {
        $query = Sale::with(['items', 'payments'])
            ->orderByDesc('occurred_at');

        if (! empty($filters['userId'])) {
            $query->where('cashier_id', (int) $filters['userId']);
        }

        if (! empty($filters['startDate']) && ! empty($filters['endDate'])) {
            $start = Carbon::parse((string) $filters['startDate'])->startOfDay();
            $end = Carbon::parse((string) $filters['endDate'])->endOfDay();
            $query->whereBetween('occurred_at', [$start, $end]);
        } elseif (! empty($filters['startDate'])) {
            $start = Carbon::parse((string) $filters['startDate'])->startOfDay();
            $query->where('occurred_at', '>=', $start);
        } elseif (! empty($filters['endDate'])) {
            $end = Carbon::parse((string) $filters['endDate'])->endOfDay();
            $query->where('occurred_at', '<=', $end);
        }

        return $query;
    }

    /**
     * @return array<string, mixed>
     */
    protected function mapSale(Sale $sale): array
    {
        $payment = $sale->payments->first();
        $itemsDetail = $sale->items->map(fn ($it) => [
            'id' => (string) $it->id,
            'name' => $it->product_name_snapshot,
            'qty' => (int) $it->qty,
            'price' => (float) $it->unit_price,
        ])->all();

        $time = $sale->occurred_at ? Carbon::parse($sale->occurred_at)->format('H:i') : '';

        return [
            'id' => $sale->local_txn_uuid,
            'invoiceNo' => $sale->server_invoice_no ? $sale->server_invoice_no : '#'.$sale->id,
            'time' => $time,
            'items' => $sale->items->count(),
            'totalBeforeDiscount' => (float) $sale->subtotal,
            'discountTotal' => (float) $sale->discount_total,
            'totalAfterDiscount' => (float) $sale->grand_total,
            'total' => (float) $sale->grand_total,
            'paymentMethod' => $payment?->method ?? 'CASH',
            'status' => $sale->status,
            'syncStatus' => $sale->synced_at ? 'SYNCED' : 'PENDING',
            'itemsDetail' => $itemsDetail,
        ];
    }
}
