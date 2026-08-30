<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gameId' => $this->game_id,
            'title' => $this->title,
            'unitPrice' => (float) $this->unit_price,
            'quantity' => $this->quantity,
            'subtotal' => round((float) $this->unit_price * $this->quantity, 2),
        ];
    }
}
