<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Game>
 */
class GameFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->words(2, true);

        return [
            'category_id' => Category::factory(),
            'title' => Str::title($title),
            'slug' => Str::slug($title),
            'studio' => fake()->company(),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 39, 299),
            'old_price' => null,
            'rating' => fake()->randomFloat(1, 3.5, 5),
            'label' => null,
            'art' => fake()->randomElement(['neon', 'ashen', 'velocity', 'shadow', 'orbit', 'sector']),
            'featured' => false,
        ];
    }
}
