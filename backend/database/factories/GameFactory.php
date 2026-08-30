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

        $covers = [
            'neon' => 'neon-horizon.png',
            'ashen' => 'ashen-crown.png',
            'velocity' => 'velocity-zero.png',
            'shadow' => 'shadow-protocol.png',
            'orbit' => 'wild-orbit.png',
            'sector' => 'final-sector.png',
        ];
        $art = fake()->randomElement(array_keys($covers));

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
            'art' => $art,
            'cover_image' => "/covers/{$covers[$art]}",
            'featured' => false,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => [
            'featured' => true,
            'label' => 'DESTAQUE',
        ]);
    }

    public function discounted(): static
    {
        return $this->state(fn () => [
            'price' => 99.90,
            'old_price' => 199.80,
            'label' => '-50%',
        ]);
    }
}
