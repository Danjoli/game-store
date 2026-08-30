<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register_and_receive_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Danilo',
            'email' => 'danilo@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.name', 'Danilo')
            ->assertJsonPath('user.email', 'danilo@example.com')
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token']);
        $this->assertDatabaseHas('users', ['email' => 'danilo@example.com']);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_registration_validates_unique_email_and_password_strength(): void
    {
        User::factory()->create(['email' => 'used@example.com']);

        $this->postJson('/api/register', [
            'name' => 'Test',
            'email' => 'used@example.com',
            'password' => 'weak',
            'password_confirmation' => 'weak',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_a_user_can_login_access_the_profile_and_logout(): void
    {
        $user = User::factory()->create([
            'email' => 'player@example.com',
            'password' => 'Password123',
        ]);

        $token = $this->postJson('/api/login', [
            'email' => 'player@example.com',
            'password' => 'Password123',
            'device_name' => 'tests',
        ])->assertOk()->json('token');

        $headers = ['Authorization' => "Bearer {$token}"];
        $this->getJson('/api/me', $headers)
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
        $this->postJson('/api/logout', [], $headers)
            ->assertOk()
            ->assertJsonPath('message', 'Sessão encerrada.');
        $this->app->make('auth')->forgetGuards();
        $this->getJson('/api/me', $headers)->assertUnauthorized();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'player@example.com']);

        $this->postJson('/api/login', [
            'email' => 'player@example.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_protected_routes_require_authentication(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
        $this->getJson('/api/cart')->assertUnauthorized();
    }

    public function test_sanctum_can_authenticate_a_user_in_tests(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->getJson('/api/me')->assertOk()->assertJsonPath('data.id', $user->id);
    }
}
