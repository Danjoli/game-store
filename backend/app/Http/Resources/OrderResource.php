<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total' => (float) $this->total,
            'paymentMethod' => $this->payment_method,
            'recipientName' => $this->recipient_name,
            'postalCode' => $this->postal_code,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'createdAt' => $this->created_at?->toISOString(),
            'customer' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
