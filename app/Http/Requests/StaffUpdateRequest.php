<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StaffUpdateRequest extends FormRequest
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
        $user = $this->route('user');
        $userId = is_object($user) ? $user->id : $user;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'username' => ['sometimes', 'required', 'string', 'max:255', 'unique:users,username,'.$userId],
            'role' => ['sometimes', 'required', 'string', 'in:CASHIER,SUPERVISOR'],
            'is_active' => ['sometimes', 'boolean'],
            'password' => ['sometimes', 'nullable', 'string', 'min:6', 'max:255'],
            'pin' => ['sometimes', 'nullable', 'string', 'digits:6'],
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
            'pin.digits' => 'PIN harus 6 digit.',
        ];
    }
}
