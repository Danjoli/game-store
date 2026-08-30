<?php

namespace Tests\Feature\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_checkout_and_cart_is_cleared(): void
    {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user->id]);
        $game = Game::factory()->create(['title' => 'Neon Test', 'price' => 49.90]);
        CartItem::factory()->create(['cart_id' => $cart->id, 'game_id' => $game->id, 'quantity' => 2]);
        Sanctum::actingAs($user);

        $this->postJson('/api/orders', $this->checkoutData())
            ->assertCreated()
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonPath('data.total', 99.8)
            ->assertJsonPath('data.items.0.title', 'Neon Test');

        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseCount('order_items', 1);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_checkout_requires_items_and_valid_address(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/orders', [])->assertUnprocessable()->assertJsonValidationErrors([
            'payment_method', 'recipient_name', 'postal_code', 'address', 'city', 'state',
        ]);
        $this->postJson('/api/orders', $this->checkoutData())
            ->assertUnprocessable()->assertJsonValidationErrors('cart');
    }

    public function test_customer_only_sees_own_orders(): void
    {
        $user = User::factory()->create();
        $own = Order::factory()->create(['user_id' => $user->id]);
        $other = Order::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/orders')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/orders/{$own->id}")->assertOk();
        $this->getJson("/api/orders/{$other->id}")->assertNotFound();
    }

    public function test_admin_can_list_orders_and_update_status(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());
        $order = Order::factory()->create();

        $this->getJson('/api/admin/orders')->assertOk()->assertJsonCount(1, 'data');
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'completed'])
            ->assertOk()->assertJsonPath('data.status', 'completed');
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'completed']);
    }

    private function checkoutData(): array
    {
        return [
            'payment_method' => 'pix', 'recipient_name' => 'Cliente Teste',
            'postal_code' => '01001-000', 'address' => 'Praça da Sé, 1',
            'city' => 'São Paulo', 'state' => 'SP',
        ];
    }
}
