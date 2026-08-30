<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['required', Rule::in(['pix', 'credit_card'])],
            'recipient_name' => ['required', 'string', 'max:120'],
            'postal_code' => ['required', 'string', 'max:12'],
            'address' => ['required', 'string', 'max:180'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'size:2'],
        ];
    }
}
