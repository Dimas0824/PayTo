<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PosCheckoutRequest;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PosCheckoutController extends Controller
{
    public function store(PosCheckoutRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $items = $payload['items'];
        $paymentMethod = (string) $payload['payment_method'];
        $cashReceived = (float) ($payload['cash_received'] ?? 0);

        $products = Product::query()
            ->whereIn('id', collect($items)->pluck('product_id'))
            ->get()
            ->keyBy('id');

        $subtotal = 0.0;
        $discountTotal = 0.0;
        $lineItems = [];
        $responseItems = [];

        foreach ($items as $item) {
            $product = $products->get($item['product_id']);
            if (! $product) {
                return response()->json(['message' => 'Produk tidak ditemukan.'], 422);
            }

            $qty = (float) $item['qty'];
            $unitPrice = (float) $product->price;
            $lineSubtotal = $unitPrice * $qty;
            $discountPerUnit = (float) ($product->discount ?? 0);
            $discountPerUnit = min($discountPerUnit, $unitPrice);
            $discountAmount = $discountPerUnit * $qty;

            if ($discountAmount > $lineSubtotal) {
                return response()->json(['message' => 'Diskon melebihi total item.'], 422);
            }

            $lineTotal = $lineSubtotal - $discountAmount;

            $subtotal += $lineSubtotal;
            $discountTotal += $discountAmount;

            $lineItems[] = [
                'product_id' => $product->id,
                'product_name_snapshot' => $product->name,
                'unit_price' => $unitPrice,
                'qty' => $qty,
                'discount_amount' => $discountAmount,
                'line_total' => $lineTotal,
            ];

            $priceAfterDiscount = $qty > 0 ? ($lineTotal / $qty) : $lineTotal;

            $responseItems[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'qty' => $qty,
                'unit_price' => $unitPrice,
                'discount_amount' => $discountAmount,
                'price_after_discount' => $priceAfterDiscount,
                'line_total' => $lineTotal,
            ];
        }

        $taxTotal = $subtotal * 0.11;
        $grandTotal = ($subtotal - $discountTotal) + $taxTotal;

        if ($paymentMethod === 'CASH' && $cashReceived < $grandTotal) {
            return response()->json(['message' => 'Uang diterima tidak mencukupi.'], 422);
        }

        $paidTotal = $paymentMethod === 'CASH' ? $cashReceived : $grandTotal;
        $changeTotal = $paymentMethod === 'CASH' ? ($cashReceived - $grandTotal) : 0;

        $user = $request->user() ?? \App\Models\User::query()->first();
        if (! $user) {
            return response()->json(['message' => 'Kasir tidak ditemukan.'], 422);
        }

        $sale = DB::transaction(function () use ($user, $lineItems, $paymentMethod, $paidTotal, $changeTotal, $taxTotal, $subtotal, $discountTotal, $grandTotal, $payload) {
            $sale = Sale::create([
                'server_invoice_no' => null,
                'local_txn_uuid' => (string) Str::uuid(),
                'status' => 'PAID',
                'cashier_id' => $user->id,
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'tax_total' => $taxTotal,
                'grand_total' => $grandTotal,
                'paid_total' => $paidTotal,
                'change_total' => $changeTotal,
                'occurred_at' => now(),
                'synced_at' => now(),
            ]);

            $invoiceNumber = 'INV-'.now()->format('Ymd').'-'.str_pad((string) $sale->id, 6, '0', STR_PAD_LEFT);
            $sale->update([
                'server_invoice_no' => $invoiceNumber,
            ]);

            foreach ($lineItems as $lineItem) {
                SaleItem::create(array_merge($lineItem, [
                    'sale_id' => $sale->id,
                ]));
            }

            Payment::create([
                'sale_id' => $sale->id,
                'method' => $paymentMethod,
                'amount' => $paidTotal,
                'reference' => $payload['reference'] ?? null,
                'status' => 'CONFIRMED',
            ]);

            return $sale;
        });

        return response()->json([
            'sale_id' => $sale->id,
            'invoice_no' => $sale->server_invoice_no,
            'payment' => [
                'status' => 'CONFIRMED',
            ],
            'items' => $responseItems,
            'totals' => [
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'tax_total' => $taxTotal,
                'grand_total' => $grandTotal,
                'paid_total' => $paidTotal,
                'change_total' => $changeTotal,
            ],
        ]);
    }
}
