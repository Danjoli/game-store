<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->items),
            'itemCount' => $this->items->sum('quantity'),
            'total' => round($this->items->sum(
                fn ($item) => (float) $item->game->price * $item->quantity,
            ), 2),
        ];
    }
}
