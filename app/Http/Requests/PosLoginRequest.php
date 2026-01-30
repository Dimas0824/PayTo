<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PosLoginRequest extends FormRequest
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
            'login_method' => ['required', 'string', 'in:CREDENTIALS,PIN'],
            'role' => ['nullable', 'string', 'in:KASIR,ADMIN'],
            'username' => ['exclude_unless:login_method,CREDENTIALS', 'required', 'string', 'max:255'],
            'password' => ['exclude_unless:login_method,CREDENTIALS', 'required', 'string', 'max:255'],
            'pin' => ['exclude_unless:login_method,PIN', 'required', 'string', 'digits:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'login_method.required' => 'Metode login wajib dipilih.',
            'login_method.in' => 'Metode login tidak valid.',
            'role.in' => 'Role tidak valid.',
            'username.required_if' => 'Username wajib diisi.',
            'password.required_if' => 'Kata sandi wajib diisi.',
            'pin.required_if' => 'PIN wajib diisi.',
            'pin.digits' => 'PIN harus 6 digit.',
        ];
    }
}
