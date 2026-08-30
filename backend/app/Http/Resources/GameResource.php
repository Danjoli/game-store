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
        ];
    }
}
