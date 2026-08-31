<?php

namespace App\Http\Controllers\Api\Admin;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(private readonly PaymentGateway $payments) {}

    public function index(): AnonymousResourceCollection
    {
        return OrderResource::collection(Order::with(['user', 'items'])->latest()->get());
    }

    public function updateStatus(Request $request, Order $order): OrderResource
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['processing', 'completed', 'cancelled'])],
        ]);
        if ($data['status'] === 'cancelled' && $order->status === 'paid') {
            throw ValidationException::withMessages(['status' => 'Use a ação de reembolso para pedidos pagos.']);
        }
        $order->update($data);
        $order->user->notify(new OrderStatusNotification($order));

        return new OrderResource($order->load(['user', 'items']));
    }

    public function refund(Order $order): OrderResource
    {
        abort_unless($order->status === 'paid' && filled($order->payment_id), 422, 'Pedido não pode ser reembolsado.');
        $this->payments->refund($order);
        $order->update(['status' => 'refunded', 'refunded_at' => now()]);
        $order->user->notify(new OrderStatusNotification($order));

        return new OrderResource($order->load(['user', 'items']));
    }
}
