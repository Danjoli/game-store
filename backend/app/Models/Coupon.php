<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = ['code', 'type', 'value', 'minimum_total', 'usage_limit', 'times_used', 'starts_at', 'expires_at', 'active'];

    protected function casts(): array
    {
        return ['value' => 'decimal:2', 'minimum_total' => 'decimal:2', 'starts_at' => 'datetime', 'expires_at' => 'datetime', 'active' => 'boolean'];
    }

    public function validFor(float $total): bool
    {
        return $this->active && $total >= (float) $this->minimum_total && (! $this->starts_at || $this->starts_at->isPast()) && (! $this->expires_at || $this->expires_at->isFuture()) && ($this->usage_limit === null || $this->times_used < $this->usage_limit);
    }

    public function discountFor(float $total): float
    {
        return round(min($total, $this->type === 'percentage' ? $total * (float) $this->value / 100 : (float) $this->value), 2);
    }
}
