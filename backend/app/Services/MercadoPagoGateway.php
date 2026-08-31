<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class MercadoPagoGateway implements PaymentGateway
{
    private function client()
    {
        return Http::withToken(config('services.payment.access_token'))->acceptJson()->baseUrl('https://api.mercadopago.com');
    }

    public function create(Order $order): array
    {
        $response = $this->client()->withHeaders(['X-Idempotency-Key' => 'order-'.$order->id])->post('/checkout/preferences', [
            'external_reference' => (string) $order->id,
            'items' => [[
                'id' => (string) $order->id,
                'title' => "Pedido Game Store #{$order->id}",
                'quantity' => 1,
                'unit_price' => (float) $order->total,
                'currency_id' => 'BRL',
            ]],
            'payer' => ['email' => $order->user->email],
            'notification_url' => config('services.payment.notification_url'),
            'back_urls' => ['success' => config('app.frontend_url').'/profile', 'pending' => config('app.frontend_url').'/profile', 'failure' => config('app.frontend_url').'/checkout'],
            'auto_return' => 'approved',
            'payment_methods' => [
                'excluded_payment_types' => collect($order->payment_method === 'pix'
                    ? ['credit_card', 'debit_card', 'ticket', 'prepaid_card']
                    : ['bank_transfer', 'ticket', 'debit_card', 'prepaid_card'])
                    ->map(fn (string $id) => ['id' => $id])->all(),
            ],
        ])->throw()->json();
        if (! isset($response['id'], $response['init_point'])) {
            throw new RuntimeException('Resposta inválida do provedor de pagamento.');
        }

        return ['payment_id' => (string) $response['id'], 'payment_url' => $response['init_point'], 'status' => 'pending'];
    }

    public function fetch(string $paymentId): array
    {
        $payment = $this->client()->get('/v1/payments/'.$paymentId)->throw()->json();

        return ['payment_id' => (string) $payment['id'], 'order_id' => (int) $payment['external_reference'], 'status' => match ($payment['status']) {
            'approved' => 'paid', 'cancelled', 'rejected' => 'cancelled', 'refunded' => 'refunded', default => 'pending'
        }];
    }

    public function refund(Order $order): void
    {
        $this->client()->withHeaders(['X-Idempotency-Key' => 'refund-order-'.$order->id])->post('/v1/payments/'.$order->payment_id.'/refunds')->throw();
    }
}
