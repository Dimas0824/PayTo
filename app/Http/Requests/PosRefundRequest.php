<?php

/**
 * Validates refund submission payloads for POS transactions.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PosRefundRequest extends FormRequest
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
            'sale_id' => ['required', 'integer', 'exists:sales,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.sale_item_id' => ['required', 'integer', 'exists:sale_items,id'],
            'items.*.qty' => ['required', 'numeric', 'min:0.001'],
            'reason' => ['required', 'string', 'min:10', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'sale_id.required' => 'Transaksi penjualan wajib dipilih.',
            'sale_id.exists' => 'Transaksi penjualan tidak ditemukan.',
            'items.required' => 'Item refund wajib diisi.',
            'items.min' => 'Item refund tidak boleh kosong.',
            'items.*.sale_item_id.exists' => 'Item transaksi tidak ditemukan.',
            'items.*.qty.min' => 'Jumlah refund tidak valid.',
            'reason.required' => 'Alasan refund wajib diisi.',
            'reason.min' => 'Alasan refund minimal 10 karakter.',
        ];
    }
}
