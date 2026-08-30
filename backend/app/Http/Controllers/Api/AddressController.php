<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return AddressResource::collection($request->user()->addresses()->orderByDesc('is_default')->latest()->get());
    }

    public function store(AddressRequest $request): JsonResponse
    {
        return (new AddressResource($this->save($request)))
            ->response()
            ->setStatusCode(201);
    }

    public function update(AddressRequest $request, Address $address): AddressResource
    {
        $this->owned($request, $address);

        return new AddressResource($this->save($request, $address));
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        $this->owned($request, $address);
        $address->delete();

        return response()->json(['message' => 'Endereço removido.']);
    }

    private function save(AddressRequest $request, ?Address $address = null): Address
    {
        return DB::transaction(function () use ($request, $address): Address {
            if ($request->boolean('is_default')) {
                $request->user()->addresses()->update(['is_default' => false]);
            }
            $data = $request->validated();
            if (! $address) {
                $data['is_default'] = $request->boolean('is_default') || ! $request->user()->addresses()->exists();
                $address = $request->user()->addresses()->create($data);
            } else {
                $address->update($data);
            }

            return $address->fresh();
        });
    }

    private function owned(Request $request, Address $address): void
    {
        abort_unless($address->user_id === $request->user()->id, 404);
    }
}
