<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        [$first, $second] = array_pad(explode(' ', $this->title, 2), 2, '');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'first' => $first,
            'second' => $second,
            'studio' => $this->studio,
            'description' => $this->description,
            'category' => $this->category->name,
            'categoryId' => $this->category->id,
            'categorySlug' => $this->category->slug,
            'rating' => (float) $this->rating,
            'price' => (float) $this->price,
            'oldPrice' => $this->old_price === null ? null : (float) $this->old_price,
            'label' => $this->label,
            'art' => $this->art,
            'image' => $this->cover_image,
            'featured' => $this->featured,
            'stock' => $this->stock,
            'available' => $this->active && ($this->stock === null || $this->stock > 0),
            'active' => $this->active,
            'downloadUrl' => $this->when($request->user()?->is_admin || $request->user()?->orders()->where('status', 'completed')->whereHas('items', fn ($query) => $query->where('game_id', $this->id))->exists(), $this->download_url),
        ];
    }
}
