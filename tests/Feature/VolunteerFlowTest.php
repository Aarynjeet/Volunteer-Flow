<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VolunteerFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_volunteer_can_apply_once_and_upload_document_and_submit_hours(): void
    {
        Storage::fake('public');

        $admin = User::query()->create(['name' => 'Admin', 'email' => 'admin3@test.com', 'password' => 'password123', 'role' => 'admin']);
        $organizer = User::query()->create(['name' => 'Organizer', 'email' => 'organizer3@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer3@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $event = Event::query()->create([
            'title' => 'Volunteer Event',
            'description' => 'Desc',
            'location' => 'Loc',
            'date' => now()->addDays(2),
            'required_volunteers' => 5,
            'category' => 'other',
            'created_by' => $organizer->id,
        ]);

        $this->actingAs($volunteer)
            ->postJson('/api/applications', ['event_id' => $event->id])
            ->assertCreated()
            ->assertJsonPath('status', 'pending');

        $this->actingAs($volunteer)
            ->postJson('/api/applications', ['event_id' => $event->id])
            ->assertUnprocessable();

        $this->actingAs($volunteer)
            ->post('/api/documents', [
                'type' => 'id',
                'file' => UploadedFile::fake()->create('doc.pdf', 120, 'application/pdf'),
            ])
            ->assertCreated()
            ->assertJsonPath('status', 'pending');

        $hourResponse = $this->actingAs($volunteer)
            ->postJson('/api/hours', [
                'event_id' => $event->id,
                'hours' => 2.5,
            ])
            ->assertCreated();

        $hourId = $hourResponse->json('id');

        $this->actingAs($admin)
            ->patchJson("/api/hours/{$hourId}/approve")
            ->assertOk()
            ->assertJsonPath('status', 'approved');
    }

    public function test_document_reject_requires_reason(): void
    {
        Storage::fake('public');

        $admin = User::query()->create(['name' => 'Admin', 'email' => 'admin4@test.com', 'password' => 'password123', 'role' => 'admin']);
        $organizer = User::query()->create(['name' => 'Organizer', 'email' => 'organizer4@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer4@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $document = $this->actingAs($volunteer)
            ->post('/api/documents', [
                'type' => 'id',
                'file' => UploadedFile::fake()->create('doc.pdf', 120, 'application/pdf'),
            ])
            ->assertCreated();

        $documentId = $document->json('id');

        $this->actingAs($admin)
            ->patchJson("/api/documents/{$documentId}/review", ['status' => 'rejected'])
            ->assertUnprocessable();

        $this->actingAs($admin)
            ->patchJson("/api/documents/{$documentId}/review", ['status' => 'rejected', 'rejection_reason' => 'Unreadable file'])
            ->assertOk()
            ->assertJsonPath('status', 'rejected');
    }

    public function test_volunteer_profile_resume_is_exposed_to_organizer_event_applicants_view(): void
    {
        Storage::fake('public');

        $organizer = User::query()->create(['name' => 'Organizer', 'email' => 'organizer5@test.com', 'password' => 'password123', 'role' => 'organizer']);
        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer5@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $event = Event::query()->create([
            'title' => 'Profile Resume Event',
            'description' => 'Desc',
            'location' => 'Loc',
            'date' => now()->addDays(2),
            'required_volunteers' => 5,
            'category' => 'other',
            'created_by' => $organizer->id,
        ]);

        $this->actingAs($volunteer)
            ->post('/api/volunteer/profile?_method=PUT', [
                'phone' => '555-0000',
                'bio' => 'Volunteer bio',
                'experience' => '3 years of support work',
                'skills' => 'first aid',
                'resume' => UploadedFile::fake()->create('resume.pdf', 120, 'application/pdf'),
            ])
            ->assertOk();

        $this->actingAs($volunteer)
            ->postJson('/api/applications', ['event_id' => $event->id])
            ->assertCreated();

        $this->actingAs($organizer)
            ->getJson("/api/events/{$event->id}/applications")
            ->assertOk()
            ->assertJsonPath('data.0.volunteer.email', 'volunteer5@test.com')
            ->assertJsonPath('data.0.volunteer.volunteer.bio', 'Volunteer bio')
            ->assertJsonPath('data.0.volunteer.volunteer.experience', '3 years of support work')
            ->assertJsonPath('data.0.volunteer.volunteer.resume_file_name', 'resume.pdf');
    }

    public function test_uploading_new_resume_replaces_previous_file_and_updates_profile(): void
    {
        Storage::fake('public');

        $volunteer = User::query()->create(['name' => 'Volunteer', 'email' => 'volunteer6@test.com', 'password' => 'password123', 'role' => 'volunteer']);

        $firstUpload = $this->actingAs($volunteer)
            ->post('/api/volunteer/profile?_method=PUT', [
                'resume' => UploadedFile::fake()->create('resume-one.pdf', 120, 'application/pdf'),
            ])
            ->assertOk();

        $firstUrl = $firstUpload->json('resume_url');
        $firstPath = ltrim(str_replace('/storage/', '', (string) parse_url((string) $firstUrl, PHP_URL_PATH)), '/');
        Storage::disk('public')->assertExists($firstPath);

        $secondUpload = $this->actingAs($volunteer)
            ->post('/api/volunteer/profile?_method=PUT', [
                'resume' => UploadedFile::fake()->create('resume-two.pdf', 120, 'application/pdf'),
            ])
            ->assertOk()
            ->assertJsonPath('resume_file_name', 'resume-two.pdf');

        $secondUrl = $secondUpload->json('resume_url');
        $secondPath = ltrim(str_replace('/storage/', '', (string) parse_url((string) $secondUrl, PHP_URL_PATH)), '/');

        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($secondPath);
    }
}

