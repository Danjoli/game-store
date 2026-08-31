<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\User;
use App\Services\MercadoPagoGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class MercadoPagoGatewayTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_preference_with_final_order_total(): void
    {
        config(['services.payment.access_token' => 'test-token', 'services.payment.notification_url' => 'https://example.com/webhook']);
        $order = Order::factory()->create(['user_id' => User::factory(), 'total' => 90, 'payment_method' => 'pix']);
        Http::fake(['api.mercadopago.com/checkout/preferences' => Http::response(['id' => 'pref-1', 'init_point' => 'https://mercadopago.com/checkout'], 201)]);

        $result = (new MercadoPagoGateway)->create($order->load(['items', 'user']));

        $this->assertSame('pref-1', $result['payment_id']);
        Http::assertSent(fn (Request $request) => $request['external_reference'] === (string) $order->id && $request['items'][0]['unit_price'] === 90.0 && $request->hasHeader('X-Idempotency-Key', 'order-'.$order->id));
    }
}
