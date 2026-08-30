<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Order> */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => 'paid',
            'total' => fake()->randomFloat(2, 20, 500),
            'payment_method' => 'pix',
            'recipient_name' => fake()->name(),
            'postal_code' => '01001-000',
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => 'SP',
        ];
    }
}
