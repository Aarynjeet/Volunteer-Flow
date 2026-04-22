<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_login_me_and_logout_flow(): void
    {
        $register = $this->postJson('/api/register', [
            'name' => 'New Volunteer',
            'email' => 'new-volunteer@test.com',
            'password' => 'password123',
            'role' => 'volunteer',
        ]);

        $register->assertCreated()->assertJsonPath('role', 'volunteer');

        $user = User::query()->where('email', 'new-volunteer@test.com')->firstOrFail();

        $this->actingAs($user)->postJson('/api/logout')->assertOk();

        $this->postJson('/api/login', [
            'email' => 'new-volunteer@test.com',
            'password' => 'password123',
        ])->assertOk();

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', 'new-volunteer@test.com');

        $this->actingAs($user)->postJson('/api/logout')->assertOk();
    }

    public function test_register_rejects_admin_role(): void
    {
        $this->postJson('/api/register', [
            'name' => 'No Admin',
            'email' => 'no-admin@test.com',
            'password' => 'password123',
            'role' => 'admin',
        ])->assertUnprocessable();
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::query()->create([
            'name' => 'Valid User',
            'email' => 'valid@test.com',
            'password' => 'password123',
            'role' => 'volunteer',
        ]);

        $this->postJson('/api/login', [
            'email' => 'valid@test.com',
            'password' => 'wrong-password',
        ])->assertUnauthorized();
    }
}

