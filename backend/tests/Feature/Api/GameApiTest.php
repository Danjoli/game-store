<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Game;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GameApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_games_using_the_frontend_contract(): void
    {
        $category = Category::factory()->create(['name' => 'Ação', 'slug' => 'acao']);
        $game = Game::factory()->create([
            'category_id' => $category->id,
            'title' => 'Neon Horizon',
            'slug' => 'neon-horizon',
            'price' => 149.90,
            'old_price' => 249.90,
            'rating' => 4.9,
            'featured' => true,
        ]);

        $this->getJson('/api/games')
            ->assertOk()
            ->assertJsonPath('data.0.id', $game->id)
            ->assertJsonPath('data.0.first', 'Neon')
            ->assertJsonPath('data.0.second', 'Horizon')
            ->assertJsonPath('data.0.category', 'Ação')
            ->assertJsonPath('data.0.price', 149.9)
            ->assertJsonPath('data.0.oldPrice', 249.9)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'title', 'slug', 'first', 'second', 'studio',
                        'description', 'category', 'categorySlug', 'rating',
                        'price', 'oldPrice', 'label', 'art', 'image', 'featured',
                    ],
                ],
            ]);
    }

    public function test_it_filters_games_by_search_and_category(): void
    {
        $action = Category::factory()->create(['name' => 'Ação', 'slug' => 'acao']);
        $rpg = Category::factory()->create(['name' => 'RPG', 'slug' => 'rpg']);
        Game::factory()->create(['category_id' => $action->id, 'title' => 'Neon Horizon', 'studio' => 'Black Arc']);
        Game::factory()->create(['category_id' => $rpg->id, 'title' => 'Ashen Crown', 'studio' => 'Northfall']);

        $this->getJson('/api/games?search=Neon&category=acao')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Neon Horizon');

        $this->getJson('/api/games?category=rpg')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Ashen Crown');
    }

    public function test_it_shows_a_game_by_slug(): void
    {
        $game = Game::factory()->create(['title' => 'Wild Orbit', 'slug' => 'wild-orbit']);

        $this->getJson('/api/games/wild-orbit')
            ->assertOk()
            ->assertJsonPath('data.id', $game->id)
            ->assertJsonPath('data.slug', 'wild-orbit');
    }

    public function test_it_validates_filters(): void
    {
        $this->getJson('/api/games?search[]='.'invalid')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('search');
    }
}
