<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $file = $request->validate(['image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:4096']])['image'];
        $path = $file->store('covers', 'public');

        return response()->json(['data' => ['url' => asset('storage/'.$path)]], 201);
    }
}
