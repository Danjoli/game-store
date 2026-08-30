<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Address> */
class AddressFactory extends Factory
{
    public function definition(): array
    {
        return ['user_id' => User::factory(), 'label' => 'Casa', 'recipient_name' => fake()->name(), 'postal_code' => '01001-000', 'address' => fake()->streetAddress(), 'city' => fake()->city(), 'state' => 'SP', 'is_default' => false];
    }
}
