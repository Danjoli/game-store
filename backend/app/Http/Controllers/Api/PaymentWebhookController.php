<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentWebhookController extends Controller
{
    public function __construct(private readonly PaymentGateway $payments) {}

    public function __invoke(Request $request): JsonResponse
    {
        $paymentId = (string) ($request->query('data.id') ?? $request->input('data.id'));
        abort_if($paymentId === '', 400);
        $this->verifySignature($request, $paymentId);
        $payment = $this->payments->fetch($paymentId);
        $order = isset($payment['order_id']) ? Order::findOrFail($payment['order_id']) : Order::where('payment_id', $paymentId)->firstOrFail();
        if ($order->status === $payment['status'] && $order->payment_id === $payment['payment_id']) {
            return response()->json(['received' => true]);
        }
        $dates = match ($payment['status']) {
            'paid' => ['paid_at' => now()], 'cancelled' => ['cancelled_at' => now()], 'refunded' => ['refunded_at' => now()], default => []
        };
        $order->update(['payment_id' => $payment['payment_id'], 'status' => $payment['status'], ...$dates]);
        $order->user->notify(new OrderStatusNotification($order));

        return response()->json(['received' => true]);
    }

    private function verifySignature(Request $request, string $paymentId): void
    {
        $secret = config('services.payment.webhook_secret');
        if (config('services.payment.driver') === 'fake') {
            return;
        }
        abort_unless(filled($secret), 503);
        preg_match('/ts=(\d+)/', (string) $request->header('x-signature'), $timestamp);
        preg_match('/v1=([a-f0-9]+)/', (string) $request->header('x-signature'), $signature);
        $manifest = 'id:'.strtolower($paymentId).';request-id:'.$request->header('x-request-id').';ts:'.($timestamp[1] ?? '').';';
        abort_unless(isset($signature[1]) && hash_equals(hash_hmac('sha256', $manifest, $secret), $signature[1]), 401);
    }
}
