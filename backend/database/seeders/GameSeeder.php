<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['category' => 'acao', 'title' => 'Neon Horizon', 'studio' => 'Black Arc Studio', 'description' => 'Sobreviva à cidade que nunca dorme em um mundo aberto cyberpunk.', 'price' => 149.90, 'old_price' => 249.90, 'rating' => 4.9, 'label' => '-40%', 'art' => 'neon', 'featured' => true],
            ['category' => 'rpg', 'title' => 'Ashen Crown', 'studio' => 'Northfall Games', 'description' => 'Reconstrua um reino em ruínas e dispute uma coroa esquecida.', 'price' => 189.90, 'old_price' => null, 'rating' => 4.8, 'label' => 'NOVO', 'art' => 'ashen', 'featured' => false],
            ['category' => 'corrida', 'title' => 'Velocity Zero', 'studio' => 'Redline Works', 'description' => 'Corridas futuristas em circuitos onde velocidade é sobrevivência.', 'price' => 99.90, 'old_price' => 199.90, 'rating' => 4.7, 'label' => '-50%', 'art' => 'velocity', 'featured' => false],
            ['category' => 'estrategia', 'title' => 'Shadow Protocol', 'studio' => 'Cipher Interactive', 'description' => 'Comande uma rede de agentes em operações táticas secretas.', 'price' => 79.90, 'old_price' => null, 'rating' => 4.6, 'label' => null, 'art' => 'shadow', 'featured' => false],
            ['category' => 'aventura', 'title' => 'Wild Orbit', 'studio' => 'Nova Forge', 'description' => 'Explore sistemas desconhecidos e descubra civilizações perdidas.', 'price' => 129.90, 'old_price' => null, 'rating' => 4.8, 'label' => 'DESTAQUE', 'art' => 'orbit', 'featured' => false],
            ['category' => 'acao', 'title' => 'Final Sector', 'studio' => 'Iron Fox', 'description' => 'Defenda o último setor humano contra uma invasão implacável.', 'price' => 59.90, 'old_price' => 119.90, 'rating' => 4.5, 'label' => '-50%', 'art' => 'sector', 'featured' => false],
        ];

        foreach ($games as $data) {
            $categorySlug = $data['category'];
            unset($data['category']);

            Game::query()->updateOrCreate(
                ['title' => $data['title']],
                [...$data, 'category_id' => Category::query()->where('slug', $categorySlug)->sole()->id],
            );
        }
    }
}
