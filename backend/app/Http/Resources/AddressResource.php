<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'label' => $this->label, 'recipientName' => $this->recipient_name, 'postalCode' => $this->postal_code, 'address' => $this->address, 'city' => $this->city, 'state' => $this->state, 'isDefault' => $this->is_default];
    }
}
