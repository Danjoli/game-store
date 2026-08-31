<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'status', 'total', 'payment_method', 'recipient_name',
        'postal_code', 'address', 'city', 'state', 'payment_id', 'payment_url',
        'paid_at', 'cancelled_at', 'refunded_at', 'coupon_code', 'discount',
    ];

    protected function casts(): array
    {
        return ['total' => 'decimal:2', 'discount' => 'decimal:2', 'paid_at' => 'datetime', 'cancelled_at' => 'datetime', 'refunded_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<OrderItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
