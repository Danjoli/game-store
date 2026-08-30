<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\GameController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{game:slug}', [GameController::class, 'show']);
