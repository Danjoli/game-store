<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Game;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request): CartResource
    {
        return new CartResource($this->cart($request));
    }

    public function storeItem(Request $request): CartResource
    {
        $data = $request->validate([
            'game_id' => ['required', 'integer', 'exists:games,id'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:99'],
        ]);
        $cart = $this->cart($request);
        $item = $cart->items()->firstOrNew(['game_id' => $data['game_id']]);
        $item->quantity = min(99, ($item->exists ? $item->quantity : 0) + ($data['quantity'] ?? 1));
        $item->save();

        return new CartResource($cart->fresh(['items.game.category']));
    }

    public function updateItem(Request $request, Game $game): CartResource
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);
        $cart = $this->cart($request);
        $cart->items()->where('game_id', $game->id)->firstOrFail()->update([
            'quantity' => $data['quantity'],
        ]);

        return new CartResource($cart->fresh(['items.game.category']));
    }

    public function destroyItem(Request $request, Game $game): CartResource
    {
        $cart = $this->cart($request);
        $cart->items()->where('game_id', $game->id)->delete();

        return new CartResource($cart->fresh(['items.game.category']));
    }

    public function clear(Request $request): JsonResponse
    {
        $this->cart($request)->items()->delete();

        return response()->json(['message' => 'Carrinho esvaziado.']);
    }

    private function cart(Request $request): Cart
    {
        $cart = $request->user()
            ->cart()
            ->firstOrCreate();

        return Cart::query()
            ->with('items.game.category')
            ->findOrFail($cart->id);
    }
}
