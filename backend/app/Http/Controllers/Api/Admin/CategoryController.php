<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(Category::query()->withCount('games')->orderBy('name')->get());
    }

    public function store(CategoryRequest $request): CategoryResource
    {
        return new CategoryResource(Category::query()->create($request->validated()));
    }

    public function update(CategoryRequest $request, Category $category): CategoryResource
    {
        $category->update($request->validated());

        return new CategoryResource($category->refresh());
    }

    public function destroy(Category $category): Response|JsonResponse
    {
        if ($category->games()->exists()) {
            return response()->json([
                'message' => 'Não é possível excluir uma categoria que possui jogos.',
            ], 422);
        }

        $category->delete();

        return response()->noContent();
    }
}
