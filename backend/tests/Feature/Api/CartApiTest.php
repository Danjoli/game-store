<?php

namespace Tests\Feature\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_it_returns_an_empty_cart_for_a_new_user(): void
    {
        $this->getJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('data.itemCount', 0)
            ->assertJsonPath('data.total', 0)
            ->assertJsonCount(0, 'data.items');
        $this->assertDatabaseCount('carts', 1);
    }

    public function test_it_adds_a_game_and_increments_an_existing_item(): void
    {
        $game = Game::factory()->create(['price' => 49.90]);

        $this->postJson('/api/cart/items', ['game_id' => $game->id, 'quantity' => 2])
            ->assertOk()
            ->assertJsonPath('data.itemCount', 2)
            ->assertJsonPath('data.total', 99.8);
        $this->postJson('/api/cart/items', ['game_id' => $game->id])
            ->assertOk()
            ->assertJsonPath('data.itemCount', 3)
            ->assertJsonPath('data.items.0.quantity', 3);
        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_it_updates_and_removes_an_item(): void
    {
        $game = Game::factory()->create();
        $this->postJson('/api/cart/items', ['game_id' => $game->id]);

        $this->putJson("/api/cart/items/{$game->id}", ['quantity' => 4])
            ->assertOk()
            ->assertJsonPath('data.items.0.quantity', 4);
        $this->deleteJson("/api/cart/items/{$game->id}")
            ->assertOk()
            ->assertJsonPath('data.itemCount', 0);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_it_clears_the_cart(): void
    {
        $cart = Cart::factory()->create(['user_id' => $this->user->id]);
        CartItem::factory()->count(2)->create(['cart_id' => $cart->id]);

        $this->deleteJson('/api/cart')
            ->assertOk()
            ->assertJsonPath('message', 'Carrinho esvaziado.');
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_it_validates_games_and_quantities(): void
    {
        $this->postJson('/api/cart/items', ['game_id' => 999999, 'quantity' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['game_id', 'quantity']);
    }

    public function test_users_cannot_change_each_others_cart_items(): void
    {
        $otherCart = Cart::factory()->create();
        $game = Game::factory()->create();
        CartItem::factory()->create([
            'cart_id' => $otherCart->id,
            'game_id' => $game->id,
            'quantity' => 1,
        ]);

        $this->putJson("/api/cart/items/{$game->id}", ['quantity' => 2])->assertNotFound();
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $otherCart->id,
            'game_id' => $game->id,
            'quantity' => 1,
        ]);
    }
}
