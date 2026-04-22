<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Event;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiSmokeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_sanctum_csrf_cookie_endpoint_responds(): void
    {
        $response = $this->get('/sanctum/csrf-cookie');

        $response->assertStatus(204);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::query()->where('email', 'organizer@test.com')->firstOrFail();

        $this->actingAs($user);

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', 'organizer@test.com');
    }

    public function test_volunteer_notifications_index(): void
    {
        $user = User::query()->where('email', 'volunteer@test.com')->firstOrFail();

        $this->actingAs($user);

        $response = $this->getJson('/api/notifications');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertGreaterThan(0, count($data));
    }

    public function test_hours_leaderboard_shape(): void
    {
        $user = User::query()->where('email', 'admin@volunteerflow.com')->firstOrFail();

        $this->actingAs($user);

        $response = $this->getJson('/api/hours/leaderboard');

        $response->assertOk();
        $this->assertIsArray($response->json());
    }

    public function test_organizer_cannot_update_application_for_event_they_do_not_own(): void
    {
        $admin = User::query()->where('email', 'admin@volunteerflow.com')->firstOrFail();
        $organizer = User::query()->where('email', 'organizer@test.com')->firstOrFail();
        $volunteer = User::query()->where('email', 'volunteer@test.com')->firstOrFail();

        $event = Event::query()->create([
            'title' => 'Admin-owned event',
            'description' => 'Test',
            'location' => 'Test',
            'date' => now()->addWeek(),
            'required_volunteers' => 5,
            'category' => 'other',
            'created_by' => $admin->id,
        ]);

        $application = Application::query()->create([
            'event_id' => $event->id,
            'volunteer_id' => $volunteer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($organizer);

        $this->patchJson("/api/applications/{$application->id}/status", [
            'status' => 'approved',
        ])->assertForbidden();
    }
}
