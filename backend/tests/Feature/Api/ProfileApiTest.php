<?php

namespace Tests\Feature\Api;

use App\Models\Address;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_update_profile_and_password(): void
    {
        $user = User::factory()->create(['password' => 'old-password']);
        Sanctum::actingAs($user);
        $this->putJson('/api/profile', ['name' => 'Nome Atualizado', 'email' => 'novo@example.com'])
            ->assertOk()->assertJsonPath('data.name', 'Nome Atualizado');
        $this->putJson('/api/profile/password', ['current_password' => 'old-password', 'password' => 'new-password', 'password_confirmation' => 'new-password'])->assertOk();
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_customer_can_manage_only_their_addresses(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/addresses', $this->addressData())->assertCreated()->assertJsonPath('data.isDefault', true);
        $id = $response->json('data.id');
        $this->putJson("/api/addresses/{$id}", [...$this->addressData(), 'label' => 'Trabalho'])->assertOk()->assertJsonPath('data.label', 'Trabalho');
        $this->getJson('/api/addresses')->assertOk()->assertJsonCount(1, 'data');
        $other = Address::factory()->create();
        $this->deleteJson("/api/addresses/{$other->id}")->assertNotFound();
        $this->deleteJson("/api/addresses/{$id}")->assertOk();
    }

    public function test_password_reset_link_is_sent_without_revealing_accounts(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $this->postJson('/api/forgot-password', ['email' => $user->email])->assertOk();
        Notification::assertSentTo($user, ResetPasswordNotification::class);
        $this->postJson('/api/forgot-password', ['email' => 'missing@example.com'])->assertOk();
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $this->postJson('/api/reset-password', ['email' => $user->email, 'token' => $token, 'password' => 'fresh-password', 'password_confirmation' => 'fresh-password'])->assertOk();
        $this->assertTrue(Hash::check('fresh-password', $user->fresh()->password));
    }

    private function addressData(): array
    {
        return ['label' => 'Casa', 'recipient_name' => 'Cliente', 'postal_code' => '01001-000', 'address' => 'Praça da Sé, 1', 'city' => 'São Paulo', 'state' => 'SP'];
    }
}
