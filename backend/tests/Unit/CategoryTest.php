<?php

namespace Tests\Unit;

use App\Models\Category;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_a_slug_from_the_name(): void
    {
        $category = Category::query()->create(['name' => 'RPG de Ação']);

        $this->assertSame('rpg-de-acao', $category->slug);
    }

    public function test_it_keeps_an_explicit_slug(): void
    {
        $category = Category::query()->create([
            'name' => 'Ação',
            'slug' => 'acao-personalizada',
        ]);

        $this->assertSame('acao-personalizada', $category->slug);
    }

    public function test_the_category_seeder_is_idempotent(): void
    {
        $this->seed(CategorySeeder::class);
        $this->seed(CategorySeeder::class);

        $this->assertDatabaseCount('categories', 5);
        $this->assertDatabaseHas('categories', [
            'name' => 'Ação',
            'slug' => 'acao',
        ]);
    }
}
