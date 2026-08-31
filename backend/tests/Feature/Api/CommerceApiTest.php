<?php

namespace Tests\Feature\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Game;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CommerceApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_coupon_discount_and_stock_are_applied_atomically(): void
    {
        $user = User::factory()->create();
        $cart = Cart::factory()->create(['user_id' => $user]);
        $game = Game::factory()->create(['price' => 100, 'stock' => 3]);
        CartItem::factory()->create(['cart_id' => $cart, 'game_id' => $game, 'quantity' => 2]);
        Coupon::create(['code' => 'SAVE10', 'type' => 'percentage', 'value' => 10, 'active' => true]);
        Sanctum::actingAs($user);

        $this->postJson('/api/orders', [...$this->checkout(), 'coupon_code' => 'SAVE10'])
            ->assertCreated()->assertJsonPath('data.total', 180)->assertJsonPath('data.discount', 20);
        $this->assertSame(1, $game->fresh()->stock);
        $this->assertDatabaseHas('coupons', ['code' => 'SAVE10', 'times_used' => 1]);
    }

    public function test_customer_cancel_restores_stock(): void
    {
        $user = User::factory()->create();
        $game = Game::factory()->create(['stock' => 1]);
        $order = Order::factory()->create(['user_id' => $user, 'status' => 'paid']);
        OrderItem::factory()->create(['order_id' => $order, 'game_id' => $game, 'quantity' => 2]);
        Sanctum::actingAs($user);
        $this->postJson("/api/orders/{$order->id}/cancel")->assertOk()->assertJsonPath('data.status', 'cancelled');
        $this->assertSame(3, $game->fresh()->stock);
    }

    public function test_admin_can_upload_cover_and_manage_customer(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create();
        Sanctum::actingAs($admin);
        $this->postJson('/api/admin/uploads/covers', ['image' => UploadedFile::fake()->image('cover.png', 600, 800)])->assertCreated()->assertJsonPath('data.url', fn ($url) => str_contains($url, '/storage/covers/'));
        $this->patchJson("/api/admin/users/{$customer->id}", ['is_active' => false, 'is_admin' => false])->assertOk()->assertJsonPath('data.isActive', false);
        $this->assertDatabaseHas('users', ['id' => $customer->id, 'is_active' => false]);
    }

    public function test_fake_payment_webhook_is_idempotent_for_status(): void
    {
        $order = Order::factory()->create(['status' => 'pending', 'payment_id' => 'fake-payment']);
        $this->postJson('/api/webhooks/mercado-pago', ['data' => ['id' => 'fake-payment']])->assertOk();
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'paid']);
    }

    private function checkout(): array
    {
        return ['payment_method' => 'pix', 'recipient_name' => 'Cliente', 'postal_code' => '01001-000', 'address' => 'Praça da Sé, 1', 'city' => 'São Paulo', 'state' => 'SP'];
    }
}
