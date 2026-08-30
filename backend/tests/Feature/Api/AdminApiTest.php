<?php

namespace Tests\Feature\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_routes_require_authentication_and_admin_role(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();

        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/admin/dashboard')
            ->assertForbidden()
            ->assertJsonPath('message', 'Acesso administrativo não autorizado.');
    }

    public function test_an_admin_can_view_dashboard_metrics(): void
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin);
        $game = Game::factory()->create();
        $cart = Cart::factory()->create();
        CartItem::factory()->create(['cart_id' => $cart->id, 'game_id' => $game->id, 'quantity' => 3]);

        $this->getJson('/api/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('data.users', 2)
            ->assertJsonPath('data.games', 1)
            ->assertJsonPath('data.categories', 1)
            ->assertJsonPath('data.activeCarts', 1)
            ->assertJsonPath('data.cartItems', 3);
    }

    public function test_an_admin_can_manage_categories(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $id = $this->postJson('/api/admin/categories', ['name' => 'Simulação'])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'simulacao')
            ->json('data.id');
        $this->putJson("/api/admin/categories/{$id}", ['name' => 'Esportes'])
            ->assertOk()
            ->assertJsonPath('data.slug', 'esportes');
        $this->deleteJson("/api/admin/categories/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('categories', ['id' => $id]);
    }

    public function test_a_category_with_games_cannot_be_deleted(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $game = Game::factory()->create();

        $this->deleteJson("/api/admin/categories/{$game->category_id}")
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Não é possível excluir uma categoria que possui jogos.');
    }

    public function test_an_admin_can_manage_games(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $category = Category::factory()->create();
        $payload = [
            'category_id' => $category->id,
            'title' => 'Solar Rift',
            'studio' => 'Nova Studio',
            'description' => 'Uma aventura espacial original.',
            'price' => 99.90,
            'old_price' => 149.90,
            'rating' => 4.7,
            'label' => 'NOVO',
            'art' => 'orbit',
            'cover_image' => '/covers/wild-orbit.png',
            'featured' => false,
        ];

        $id = $this->postJson('/api/admin/games', $payload)
            ->assertCreated()
            ->assertJsonPath('data.title', 'Solar Rift')
            ->assertJsonPath('data.categoryId', $category->id)
            ->json('data.id');
        $this->putJson("/api/admin/games/{$id}", [...$payload, 'title' => 'Solar Rift Prime', 'featured' => true])
            ->assertOk()
            ->assertJsonPath('data.slug', 'solar-rift-prime')
            ->assertJsonPath('data.featured', true);
        $this->deleteJson("/api/admin/games/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('games', ['id' => $id]);
    }

    public function test_admin_game_validation_rejects_invalid_data(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $this->postJson('/api/admin/games', [
            'title' => '',
            'price' => -1,
            'old_price' => 0,
            'rating' => 7,
            'cover_image' => 'invalid.jpg',
        ])->assertUnprocessable()->assertJsonValidationErrors([
            'category_id', 'title', 'studio', 'description', 'price',
            'rating', 'art', 'cover_image', 'featured',
        ]);
    }
}
