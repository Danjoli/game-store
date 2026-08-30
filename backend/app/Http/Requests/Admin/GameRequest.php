<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GameRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255', Rule::unique('games', 'title')->ignore($this->route('game'))],
            'studio' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'old_price' => ['nullable', 'numeric', 'gt:price', 'max:99999999.99'],
            'rating' => ['required', 'numeric', 'between:0,5'],
            'label' => ['nullable', 'string', 'max:30'],
            'art' => ['required', Rule::in(['neon', 'ashen', 'velocity', 'shadow', 'orbit', 'sector'])],
            'cover_image' => ['required', 'string', 'max:255', 'starts_with:/covers/'],
            'featured' => ['required', 'boolean'],
        ];
    }
}
