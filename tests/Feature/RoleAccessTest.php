<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Document;
use App\Models\Event;
use App\Models\Hour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admin_can_review_documents_and_approve_hours_and_delete_events(): void
    {
        Storage::fake('public');

        $admin = User::query()->create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => 'password123', 'role' => 'admin']);
        $organizer = User::query()->create(['name' => 'Organizer', 'email' => 'organizer@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $event = Event::query()->create([
            'title' => 'Event',
            'description' => 'Desc',
            'location' => 'Loc',
            'date' => now()->addDay(),
            'required_volunteers' => 2,
            'category' => 'other',
            'created_by' => $organizer->id,
        ]);

        $document = Document::query()->create([
            'volunteer_id' => $volunteer->id,
            'file_url' => '/storage/documents/test.pdf',
            'file_name' => 'test.pdf',
            'type' => 'id',
            'status' => 'pending',
        ]);

        $hour = Hour::query()->create([
            'volunteer_id' => $volunteer->id,
            'event_id' => $event->id,
            'hours' => 1.5,
            'status' => 'pending',
        ]);

        $this->actingAs($organizer)
            ->patchJson("/api/documents/{$document->id}/review", ['status' => 'approved'])
            ->assertForbidden();

        $this->actingAs($organizer)
            ->patchJson("/api/hours/{$hour->id}/approve")
            ->assertForbidden();

        $this->actingAs($organizer)
            ->deleteJson("/api/events/{$event->id}")
            ->assertForbidden();

        $this->actingAs($admin)
            ->patchJson("/api/documents/{$document->id}/review", ['status' => 'approved'])
            ->assertOk();

        $this->actingAs($admin)
            ->patchJson("/api/hours/{$hour->id}/approve")
            ->assertOk();

        $this->actingAs($admin)
            ->deleteJson("/api/events/{$event->id}")
            ->assertNoContent();
    }

    public function test_organizer_can_only_manage_applications_for_owned_events(): void
    {
        $admin = User::query()->create(['name' => 'Admin', 'email' => 'admin2@test.com', 'password' => 'password123', 'role' => 'admin']);
        $owner = User::query()->create(['name' => 'Owner', 'email' => 'owner@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $otherOrganizer = User::query()->create(['name' => 'Other', 'email' => 'other@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer2@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $event = Event::query()->create([
            'title' => 'Owner Event',
            'description' => 'Desc',
            'location' => 'Loc',
            'date' => now()->addDay(),
            'required_volunteers' => 2,
            'category' => 'other',
            'created_by' => $owner->id,
        ]);

        $application = Application::query()->create([
            'event_id' => $event->id,
            'volunteer_id' => $volunteer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($otherOrganizer)
            ->patchJson("/api/applications/{$application->id}/status", ['status' => 'approved'])
            ->assertForbidden();

        $this->actingAs($owner)
            ->patchJson("/api/applications/{$application->id}/status", ['status' => 'approved'])
            ->assertOk()
            ->assertJsonPath('status', 'approved');

        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'status' => 'approved',
        ]);

        $this->actingAs($admin)
            ->patchJson("/api/applications/{$application->id}/status", ['status' => 'completed'])
            ->assertOk()
            ->assertJsonPath('status', 'completed');

        $this->assertDatabaseHas('applications', [
            'id' => $application->id,
            'status' => 'completed',
        ]);
    }

    public function test_organizer_can_create_event_with_valid_4_digit_year(): void
    {
        $organizer = User::query()->create(['name' => 'Organizer Year', 'email' => 'org-year@test.com', 'password' => 'password123', 'role' => 'organizer']);

        $this->actingAs($organizer)
            ->postJson('/api/events', [
                'title' => 'Year Validation Event',
                'description' => 'Event description',
                'location' => 'Community Center',
                'date' => '2026-05-01T10:30',
                'required_volunteers' => 10,
                'category' => 'other',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('events', [
            'title' => 'Year Validation Event',
            'created_by' => $organizer->id,
        ]);
    }

    public function test_event_rejects_year_outside_4_digit_range_on_update(): void
    {
        $organizer = User::query()->create(['name' => 'Organizer Year 2', 'email' => 'org-year2@test.com', 'password' => 'password123', 'role' => 'organizer']);

        $event = Event::query()->create([
            'title' => 'Existing Event',
            'description' => 'Desc',
            'location' => 'Loc',
            'date' => '2026-06-10 09:00:00',
            'required_volunteers' => 3,
            'category' => 'other',
            'created_by' => $organizer->id,
        ]);

        $this->actingAs($organizer)
            ->putJson("/api/events/{$event->id}", [
                'title' => 'Existing Event',
                'description' => 'Desc',
                'location' => 'Loc',
                'date' => '0999-12-31T23:59',
                'required_volunteers' => 3,
                'category' => 'other',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['date']);
    }
}

