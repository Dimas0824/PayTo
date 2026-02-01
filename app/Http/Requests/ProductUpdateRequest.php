<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
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
        $product = $this->route('product');
        $productId = is_object($product) ? $product->id : $product;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'sku' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:products,sku,'.$productId],
            'barcode' => ['sometimes', 'nullable', 'string', 'max:255', 'unique:products,barcode,'.$productId],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'discount' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'uom' => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'stock' => ['sometimes', 'required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'sku.unique' => 'SKU sudah digunakan.',
            'barcode.unique' => 'Barcode sudah digunakan.',
            'price.required' => 'Harga jual wajib diisi.',
            'price.min' => 'Harga jual tidak valid.',
            'discount.min' => 'Diskon tidak valid.',
            'cost.min' => 'Harga modal tidak valid.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.min' => 'Stok tidak valid.',
        ];
    }
}
