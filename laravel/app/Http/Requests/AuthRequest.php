<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class AuthRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function passwordRules(): array
    {
        return ['required', 'string', Password::min(6)->mixedCase()->numbers()->symbols(), 'confirmed'];
    }

    public function rules(): array
    {
        return match ($this->route()->getActionMethod()) {
            'act_register' => $this->registerRules(),
            'act_login' => $this->loginRules(),
            default => [],
        };
    }

    private function registerRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            'password_confirmation' => ['required'],
        ];
    }

    private function loginRules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute mohon diisi !',
            'max'      => ':attribute max :max karakter !',
            'min'      => ':attribute min :min karakter !',
            'string'   => 'Tipe :attribute harus berupa string !',
            'email'    => 'Format :attribute tidak valid !',
            'unique'   => ':attribute sudah terdaftar, silahkan ganti dan ulangi !',

            'password.mixed'     => ':attribute membutuhkan setidaknya satu huruf besar dan satu huruf kecil !',
            'password.symbols'   => ':attribute membutuhkan setidaknya satu spesial karakter !',
            'password.numbers'   => ':attribute membutuhkan setidaknya satu angka !',
            'password.confirmed' => 'Konfirmasi :attribute tidak sama !',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'Nama',
            'email' => 'Email',
            'password' => 'Password',
            'password_confirmation' => 'Konfirmasi Password',
        ];
    }
}
