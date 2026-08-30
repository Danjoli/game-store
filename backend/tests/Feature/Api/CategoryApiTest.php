<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_categories_ordered_by_name(): void
    {
        Category::factory()->create(['name' => 'RPG', 'slug' => 'rpg']);
        Category::factory()->create(['name' => 'Ação', 'slug' => 'acao']);

        $response = $this->getJson('/api/categories');

        $response
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Ação')
            ->assertJsonPath('data.1.name', 'RPG')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug'],
                ],
            ]);
    }

    public function test_it_shows_a_category_by_slug(): void
    {
        $category = Category::factory()->create([
            'name' => 'Estratégia',
            'slug' => 'estrategia',
        ]);

        $this->getJson('/api/categories/estrategia')
            ->assertOk()
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', 'Estratégia')
            ->assertJsonPath('data.slug', 'estrategia');
    }

    public function test_it_returns_not_found_for_an_unknown_slug(): void
    {
        $this->getJson('/api/categories/inexistente')->assertNotFound();
    }
}
