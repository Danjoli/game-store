<?php

namespace App\Models;

use Database\Factories\GameFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Game extends Model
{
    /** @use HasFactory<GameFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'studio',
        'description',
        'price',
        'old_price',
        'rating',
        'label',
        'art',
        'cover_image',
        'featured',
        'stock', 'download_url', 'active',
    ];

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'old_price' => 'decimal:2',
            'rating' => 'decimal:1',
            'featured' => 'boolean',
            'stock' => 'integer',
            'active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Game $game): void {
            if (
                blank($game->slug)
                || ($game->isDirty('title') && ! $game->isDirty('slug'))
            ) {
                $game->slug = Str::slug($game->title);
            }
        });
    }
}
