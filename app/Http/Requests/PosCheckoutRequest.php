<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PosCheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method' => ['required', 'string', 'in:CASH,EWALLET'],
            'cash_received' => ['required_if:payment_method,CASH', 'numeric', 'min:0'],
            'reference' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.qty' => ['required', 'numeric', 'min:0.001'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'Metode pembayaran wajib diisi.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
            'cash_received.required_if' => 'Uang diterima wajib diisi untuk pembayaran tunai.',
            'items.required' => 'Item transaksi wajib diisi.',
            'items.min' => 'Item transaksi tidak boleh kosong.',
            'items.*.product_id.exists' => 'Produk tidak ditemukan.',
            'items.*.qty.min' => 'Jumlah item tidak valid.',
            'items.*.discount_amount.min' => 'Diskon tidak valid.',
        ];
    }
}
