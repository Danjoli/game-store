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
            'slug' => 'neon-horizon',
            'featured' => true,
        ]);
    }

    public function test_update_or_create_generates_a_slug_for_a_new_game(): void
    {
        $category = Category::factory()->create();

        $game = Game::query()->updateOrCreate(
            ['title' => 'Final Sector'],
            [
                'category_id' => $category->id,
                'studio' => 'Iron Fox',
                'description' => 'Action game.',
                'price' => 59.90,
                'rating' => 4.5,
                'art' => 'sector',
            ],
        );

        $this->assertSame('final-sector', $game->slug);
    }

    public function test_factory_states_create_featured_and_discounted_games(): void
    {
        $featured = Game::factory()->featured()->create();
        $discounted = Game::factory()->discounted()->create();

        $this->assertTrue($featured->featured);
        $this->assertSame('DESTAQUE', $featured->label);
        $this->assertSame('99.90', $discounted->price);
        $this->assertSame('199.80', $discounted->old_price);
        $this->assertSame('-50%', $discounted->label);
    }

    public function test_every_seeded_game_has_a_cover_in_the_frontend(): void
    {
        $this->seed(CategorySeeder::class);
        $this->seed(GameSeeder::class);

        Game::query()->each(function (Game $game): void {
            $this->assertNotNull($game->cover_image);
            $this->assertFileExists(
                base_path('../frontend/public'.$game->cover_image),
                "Missing cover for {$game->title}",
            );
        });
    }
}
