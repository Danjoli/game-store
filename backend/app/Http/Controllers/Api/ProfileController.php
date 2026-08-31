<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function update(Request $request): UserResource
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255'], 'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$request->user()->id]]);
        $request->user()->update($data);

        return new UserResource($request->user()->fresh());
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $data = $request->validate(['current_password' => ['required', 'current_password'], 'password' => ['required', 'confirmed', Password::min(8)]]);
        $request->user()->update(['password' => Hash::make($data['password'])]);
        $request->user()->tokens()->whereKeyNot($request->user()->currentAccessToken()?->id)->delete();

        return response()->json(['message' => 'Senha atualizada.']);
    }

    public function export(Request $request): JsonResponse
    {
        $user = $request->user()->load(['addresses', 'orders.items']);

        return response()->json(['data' => ['profile' => new UserResource($user), 'addresses' => $user->addresses, 'orders' => $user->orders]]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Conta excluída.']);
    }
}
