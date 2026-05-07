<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->title),
        ]);
    }

    public function rules(): array
    {
        return match ($this->route()->getActionMethod()) {
            'store'  => $this->storeRules(),
            'update' => $this->updateRules(),
            default  => [],
        };
    }

    private function storeRules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:posts'],
            'content' => ['required', 'string'],
            'image' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'mimetypes:image/jpeg,image/png,image/webp', 'max:1024'],
        ];
    }

    private function updateRules(): array
    {
        $postId = $this->route('post')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('posts')->ignore($postId)],
            'content' => ['required', 'string'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'mimetypes:image/jpeg,image/png,image/webp', 'max:1024'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute mohon diisi !',
            'max' => ':attribute max :max karakter !',
            'string' => 'Tipe :attribute harus berupa string !',

            'file' => ':attribute harus diisi melalui input tipe file !',
            'image' => 'Tipe :attribute harus berupa image !',
            'mimes' => 'Ekstensi :attribute yang diperbolehkan hanya : :values !',
            'mimetypes' => 'Mimetype :attribute tidak valid !',

            'slug.unique' => 'Terdapat judul yang sama (dapat berupa karakter simbol) saat dilakukan SlugString, silahkan ganti dan ulangi !',
            'image.max' => 'Max ukuran :attribute adalah :max kb !',
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => 'Judul',
            'slug' => 'Slug',
            'content' => 'Konten',
            'image' => 'Gambar',
        ];
    }
}
