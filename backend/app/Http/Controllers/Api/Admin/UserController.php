<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $search = $request->validate(['search' => ['nullable', 'string', 'max:100']])['search'] ?? null;

        return UserResource::collection(User::query()->withCount('orders')->when($search, fn ($query, $value) => $query->where(fn ($q) => $q->whereLike('name', "%{$value}%")->orWhereLike('email', "%{$value}%")))->latest()->paginate(50));
    }

    public function update(Request $request, User $user): UserResource
    {
        $data = $request->validate(['is_active' => ['sometimes', 'boolean'], 'is_admin' => ['sometimes', 'boolean']]);
        abort_if($request->user()->is($user) && array_key_exists('is_active', $data) && ! $data['is_active'], 422, 'Você não pode desativar sua própria conta.');
        $user->update($data);
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return new UserResource($user->fresh());
    }
}
