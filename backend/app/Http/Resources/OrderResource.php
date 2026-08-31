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
            'paymentUrl' => $this->payment_url,
            'couponCode' => $this->coupon_code,
            'discount' => (float) $this->discount,
            'paidAt' => $this->paid_at?->toISOString(),
            'cancelledAt' => $this->cancelled_at?->toISOString(),
            'refundedAt' => $this->refunded_at?->toISOString(),
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
