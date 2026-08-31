<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CouponController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Coupon::latest()->paginate(50)]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['data' => Coupon::create($this->data($request))], 201);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $coupon->update($this->data($request, $coupon));

        return response()->json(['data' => $coupon->fresh()]);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json([], 204);
    }

    private function data(Request $request, ?Coupon $coupon = null): array
    {
        $data = $request->validate(['code' => ['required', 'string', 'max:40', Rule::unique('coupons')->ignore($coupon)], 'type' => ['required', Rule::in(['percentage', 'fixed'])], 'value' => ['required', 'numeric', 'gt:0'], 'minimum_total' => ['sometimes', 'numeric', 'min:0'], 'usage_limit' => ['nullable', 'integer', 'min:1'], 'starts_at' => ['nullable', 'date'], 'expires_at' => ['nullable', 'date', 'after:starts_at'], 'active' => ['sometimes', 'boolean']]);
        $data['code'] = strtoupper($data['code']);

        return $data;
    }
}
