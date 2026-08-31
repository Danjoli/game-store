<?php

namespace App\Contracts;

use App\Models\Order;

interface PaymentGateway
{
    /** @return array{payment_id: string, payment_url: ?string, status: string} */
    public function create(Order $order): array;

    /** @return array{payment_id: string, status: string, order_id?: int} */
    public function fetch(string $paymentId): array;

    public function refund(Order $order): void;
}
