<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
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

    public function store(CheckoutRequest $request): OrderResource
    {
        $cart = $request->user()->cart()->with('items.game')->first();
        if (! $cart || $cart->items->isEmpty()) {
            throw ValidationException::withMessages(['cart' => 'O carrinho está vazio.']);
        }

        $order = DB::transaction(function () use ($request, $cart): Order {
            $order = $request->user()->orders()->create([
                ...$request->validated(),
                'status' => 'paid',
                'total' => $cart->items->sum(fn ($item) => (float) $item->game->price * $item->quantity),
            ]);
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'game_id' => $item->game_id,
                    'title' => $item->game->title,
                    'unit_price' => $item->game->price,
                    'quantity' => $item->quantity,
                ]);
            }
            $cart->items()->delete();

            return $order;
        });

        return new OrderResource($order->load('items'));
    }
}
