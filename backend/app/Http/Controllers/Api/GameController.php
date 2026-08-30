<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GameController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $games = Game::query()
            ->with('category')
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->whereLike('title', "%{$search}%")
                        ->orWhereLike('studio', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, function (Builder $query, string $category): void {
                $query->whereHas('category', function (Builder $query) use ($category): void {
                    $query
                        ->where('slug', $category)
                        ->orWhere('name', $category);
                });
            })
            ->orderByDesc('featured')
            ->orderBy('title')
            ->get();

        return GameResource::collection($games);
    }

    public function show(Game $game): GameResource
    {
        return new GameResource($game->load('category'));
    }
}
