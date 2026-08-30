<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Game;
use Database\Seeders\CategorySeeder;
use Database\Seeders\GameSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_a_slug_and_belongs_to_a_category(): void
    {
        $category = Category::factory()->create();
        $game = Game::query()->create([
            'category_id' => $category->id,
            'title' => 'Neon Horizon',
            'studio' => 'Black Arc Studio',
            'description' => 'Cyberpunk action game.',
            'price' => 149.90,
            'rating' => 4.9,
            'art' => 'neon',
        ]);

        $this->assertSame('neon-horizon', $game->slug);
        $this->assertTrue($game->category->is($category));
        $this->assertTrue($category->games->contains($game));
    }

    public function test_the_database_seeder_is_idempotent(): void
    {
        $this->seed(CategorySeeder::class);
        $this->seed(GameSeeder::class);
        $this->seed(GameSeeder::class);

        $this->assertDatabaseCount('categories', 5);
        $this->assertDatabaseCount('games', 6);
        $this->assertDatabaseHas('games', [
            'title' => 'Neon Horizon',
            'featured' => true,
        ]);
    }
}
