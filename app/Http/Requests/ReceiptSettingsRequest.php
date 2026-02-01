<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptSettingsRequest extends FormRequest
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
            'header' => ['required', 'string', 'max:2000'],
            'footer' => ['required', 'string', 'max:2000'],
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
            'header.required' => 'Header struk wajib diisi.',
            'footer.required' => 'Footer struk wajib diisi.',
            'header.max' => 'Header struk terlalu panjang.',
            'footer.max' => 'Footer struk terlalu panjang.',
        ];
    }
}
