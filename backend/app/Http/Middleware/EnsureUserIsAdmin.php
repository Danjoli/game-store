<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response|JsonResponse
    {
        if (! $request->user()?->is_admin) {
            return response()->json(['message' => 'Acesso administrativo não autorizado.'], 403);
        }

        return $next($request);
    }
}
