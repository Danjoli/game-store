<?php

use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\GameController as AdminGameController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\UploadController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PasswordController;
use App\Http\Controllers\Api\PaymentWebhookController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{game:slug}', [GameController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/forgot-password', [PasswordController::class, 'forgot'])->middleware('throttle:3,1');
Route::post('/reset-password', [PasswordController::class, 'reset'])->middleware('throttle:5,1');
Route::post('/webhooks/mercado-pago', PaymentWebhookController::class)->middleware('throttle:120,1');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::get('/profile/export', [ProfileController::class, 'export']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
    Route::apiResource('addresses', AddressController::class)->except(['index', 'show']);
    Route::get('/addresses', [AddressController::class, 'index']);

    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'storeItem']);
    Route::put('/cart/items/{game}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{game}', [CartController::class, 'destroyItem']);
    Route::delete('/cart', [CartController::class, 'clear']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('/orders/{order}/items/{item}/download', [OrderController::class, 'download']);

    Route::prefix('admin')->middleware('admin')->group(function (): void {
        Route::get('/dashboard', DashboardController::class);
        Route::apiResource('categories', AdminCategoryController::class)->except('show');
        Route::apiResource('games', AdminGameController::class)->except('show');
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::post('/orders/{order}/refund', [AdminOrderController::class, 'refund']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::patch('/users/{user}', [AdminUserController::class, 'update']);
        Route::apiResource('coupons', AdminCouponController::class)->except('show');
        Route::post('/uploads/covers', UploadController::class);
    });
});
