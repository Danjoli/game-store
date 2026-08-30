<?php

namespace Database\Factories;

use App\Models\Game;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<OrderItem> */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'game_id' => Game::factory(),
            'title' => fake()->words(3, true),
            'unit_price' => fake()->randomFloat(2, 20, 300),
            'quantity' => fake()->numberBetween(1, 3),
        ];
    }
}
