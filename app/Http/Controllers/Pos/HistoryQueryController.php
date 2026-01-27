<?php

namespace App\Http\Controllers\Pos;

use App\Models\Sale;
use Illuminate\Support\Carbon;

class HistoryQueryController
{
    public function fetch(int $limit = 10): array
    {
        $sales = Sale::with(['items', 'payments'])
            ->orderByDesc('occurred_at')
            ->limit($limit)
            ->get()
            ->map(function (Sale $sale) {
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
                    'total' => (float) $sale->grand_total,
                    'paymentMethod' => $payment?->method ?? 'CASH',
                    'status' => $sale->status,
                    'syncStatus' => $sale->synced_at ? 'SYNCED' : 'PENDING',
                    'itemsDetail' => $itemsDetail,
                ];
            })->all();

        return $sales;
    }
}
