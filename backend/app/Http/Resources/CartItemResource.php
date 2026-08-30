<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'unitPrice' => (float) $this->game->price,
            'subtotal' => round((float) $this->game->price * $this->quantity, 2),
            'game' => new GameResource($this->game),
        ];
    }
}
