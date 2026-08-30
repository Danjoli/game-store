<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GameRequest;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class GameController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return GameResource::collection(Game::query()->with('category')->orderByDesc('featured')->orderBy('title')->get());
    }

    public function store(GameRequest $request): GameResource
    {
        $game = Game::query()->create($request->validated());

        return new GameResource($game->load('category'));
    }

    public function update(GameRequest $request, Game $game): GameResource
    {
        $game->update($request->validated());

        return new GameResource($game->refresh()->load('category'));
    }

    public function destroy(Game $game): Response
    {
        $game->delete();

        return response()->noContent();
    }
}
