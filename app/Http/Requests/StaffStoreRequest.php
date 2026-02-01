<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StaffStoreRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'role' => ['required', 'string', 'in:CASHIER,SUPERVISOR'],
            'is_active' => ['nullable', 'boolean'],
            'password' => ['required_without:pin', 'nullable', 'string', 'min:6', 'max:255'],
            'pin' => ['required_without:password', 'nullable', 'string', 'digits:6'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama staf wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan.',
            'role.in' => 'Role tidak valid.',
            'password.required_without' => 'Password wajib diisi jika PIN kosong.',
            'pin.required_without' => 'PIN wajib diisi jika password kosong.',
            'pin.digits' => 'PIN harus 6 digit.',
        ];
    }
}
