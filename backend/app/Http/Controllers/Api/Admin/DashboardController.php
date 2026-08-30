<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Game;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                'users' => User::query()->count(),
                'games' => Game::query()->count(),
                'categories' => Category::query()->count(),
                'activeCarts' => Cart::query()->whereHas('items')->count(),
                'cartItems' => CartItem::query()->sum('quantity'),
                'orders' => Order::query()->count(),
                'revenue' => (float) Order::query()->whereNot('status', 'cancelled')->sum('total'),
            ],
        ]);
    }
}
