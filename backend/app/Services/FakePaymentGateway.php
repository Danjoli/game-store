<?php

namespace App\Services;

use App\Contracts\PaymentGateway;
use App\Models\Order;

class FakePaymentGateway implements PaymentGateway
{
    public function create(Order $order): array
    {
        return ['payment_id' => 'fake-'.$order->id, 'payment_url' => null, 'status' => 'paid'];
    }

    public function fetch(string $paymentId): array
    {
        return ['payment_id' => $paymentId, 'status' => 'paid'];
    }

    public function refund(Order $order): void {}
}
