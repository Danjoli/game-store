<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['label' => ['required', 'string', 'max:40'], 'recipient_name' => ['required', 'string', 'max:120'], 'postal_code' => ['required', 'string', 'max:12'], 'address' => ['required', 'string', 'max:180'], 'city' => ['required', 'string', 'max:100'], 'state' => ['required', 'string', 'size:2'], 'is_default' => ['sometimes', 'boolean']];
    }
}
