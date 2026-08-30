<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Ação', 'slug' => 'acao'],
            ['name' => 'RPG', 'slug' => 'rpg'],
            ['name' => 'Aventura', 'slug' => 'aventura'],
            ['name' => 'Estratégia', 'slug' => 'estrategia'],
            ['name' => 'Corrida', 'slug' => 'corrida'],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        }
    }
}
