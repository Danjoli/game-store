<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Coupon;
use App\Models\Game;
use App\Models\Order;
use App\Notifications\OrderCreatedNotification;
use App\Notifications\OrderStatusNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(private readonly PaymentGateway $payments) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return OrderResource::collection(
            $request->user()->orders()->with('items')->latest()->get(),
        );
    }

    public function show(Request $request, Order $order): OrderResource
    {
        abort_unless($order->user_id === $request->user()->id, 404);

        return new OrderResource($order->load('items'));
    }

    public function store(CheckoutRequest $request): JsonResponse
    {
        $cart = $request->user()->cart()->with('items.game')->first();
        if (! $cart || $cart->items->isEmpty()) {
            throw ValidationException::withMessages(['cart' => 'O carrinho está vazio.']);
        }

        $subtotal = (float) $cart->items->sum(fn ($item) => (float) $item->game->price * $item->quantity);
        $coupon = filled($request->coupon_code) ? Coupon::query()->where('code', strtoupper($request->coupon_code))->first() : null;
        if ($coupon && ! $coupon->validFor($subtotal)) {
            throw ValidationException::withMessages(['coupon_code' => 'Cupom inválido ou expirado.']);
        }
        if ($request->coupon_code && ! $coupon) {
            throw ValidationException::withMessages(['coupon_code' => 'Cupom não encontrado.']);
        }
        $discount = $coupon?->discountFor($subtotal) ?? 0;

        $order = DB::transaction(function () use ($request, $cart, $subtotal, $discount, $coupon): Order {
            foreach ($cart->items as $item) {
                $game = Game::query()->lockForUpdate()->findOrFail($item->game_id);
                if (! $game->active || ($game->stock !== null && $game->stock < $item->quantity)) {
                    throw ValidationException::withMessages(['cart' => "Estoque insuficiente para {$game->title}."]);
                }
                $item->setRelation('game', $game);
            }
            $order = $request->user()->orders()->create([
                ...$request->validated(),
                'coupon_code' => $coupon?->code,
                'discount' => $discount,
                'status' => 'pending',
                'total' => $subtotal - $discount,
            ]);
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'game_id' => $item->game_id,
                    'title' => $item->game->title,
                    'unit_price' => $item->game->price,
                    'quantity' => $item->quantity,
                ]);
                if ($item->game->stock !== null) {
                    $item->game->decrement('stock', $item->quantity);
                }
            }
            if ($coupon) {
                $coupon->increment('times_used');
            }
            $cart->items()->delete();

            return $order;
        });

        $payment = $this->payments->create($order->load(['items', 'user']));
        $order->update([
            'payment_id' => $payment['payment_id'], 'payment_url' => $payment['payment_url'],
            'status' => $payment['status'], 'paid_at' => $payment['status'] === 'paid' ? now() : null,
        ]);
        $request->user()->notify(new OrderCreatedNotification($order->fresh()));

        return (new OrderResource($order->fresh()->load('items')))->response()->setStatusCode(201);
    }

    public function cancel(Request $request, Order $order): OrderResource
    {
        abort_unless($order->user_id === $request->user()->id, 404);
        if (! in_array($order->status, ['pending', 'paid'], true)) {
            throw ValidationException::withMessages(['order' => 'Este pedido não pode ser cancelado.']);
        }
        if ($order->status === 'paid' && filled($order->payment_id)) {
            $this->payments->refund($order);
            $order->update(['status' => 'refunded', 'refunded_at' => now(), 'cancelled_at' => now()]);
        } else {
            $order->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        }
        foreach ($order->items as $item) {
            if ($item->game_id && $item->game?->stock !== null) {
                $item->game->increment('stock', $item->quantity);
            }
        }
        $request->user()->notify(new OrderStatusNotification($order));

        return new OrderResource($order->fresh()->load('items'));
    }

    public function download(Request $request, Order $order, int $item): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id && $order->status === 'completed', 404);
        $orderItem = $order->items()->with('game')->findOrFail($item);
        abort_unless(filled($orderItem->game?->download_url), 404);

        return redirect()->away($orderItem->game->download_url);
    }
}
