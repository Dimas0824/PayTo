<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PosSyncBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'max:255'],
            'batch_uuid' => ['required', 'uuid'],
            'transactions' => ['required', 'array', 'min:1'],
            'transactions.*.local_txn_uuid' => ['required', 'uuid'],
            'transactions.*.occurred_at' => ['nullable', 'date'],
            'transactions.*.checkout' => ['required', 'array'],
            'transactions.*.checkout.payment_method' => ['required', 'string', 'in:CASH,EWALLET'],
            'transactions.*.checkout.cash_received' => ['required_if:transactions.*.checkout.payment_method,CASH', 'numeric', 'min:0'],
            'transactions.*.checkout.reference' => ['nullable', 'string', 'max:255'],
            'transactions.*.checkout.items' => ['required', 'array', 'min:1'],
            'transactions.*.checkout.items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'transactions.*.checkout.items.*.qty' => ['required', 'numeric', 'min:0.001'],
            'transactions.*.checkout.items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
