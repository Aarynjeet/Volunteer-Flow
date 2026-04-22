<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate([
            'email' => 'admin@volunteerflow.com',
        ], [
            'name' => 'Demo Admin User',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $volunteer = User::query()->updateOrCreate([
            'email' => 'volunteer@test.com',
        ], [
            'name' => 'Demo Volunteer User',
            'password' => 'password',
            'role' => 'volunteer',
        ]);

        $organizer = User::query()->updateOrCreate([
            'email' => 'organizer@test.com',
        ], [
            'name' => 'Demo Organizer User',
            'password' => 'password',
            'role' => 'organizer',
        ]);

        Volunteer::query()->updateOrCreate([
            'user_id' => $volunteer->id,
        ], [
            'phone' => '555-1234',
            'location' => 'Hamilton, ON',
            'skills' => 'First aid, driving',
            'availability' => 'Weekends',
            'emergency_contact' => null,
        ]);

        $events = [
            [
                'title' => 'Community Food Drive',
                'description' => 'DEMO: Help sort and distribute food donations.',
                'location' => 'Downtown Community Center',
                'date' => Carbon::parse('2026-05-05 09:00:00'),
                'required_volunteers' => 10,
                'category' => 'food_drive',
            ],
            [
                'title' => 'River Cleanup',
                'description' => 'DEMO: Join us to clean the riverbank and trails.',
                'location' => 'Riverside Park',
                'date' => Carbon::parse('2026-05-12 10:00:00'),
                'required_volunteers' => 15,
                'category' => 'community_cleanup',
            ],
            [
                'title' => 'Annual Fundraiser Gala',
                'description' => 'DEMO: Assist with registration and event setup.',
                'location' => 'City Convention Hall',
                'date' => Carbon::parse('2026-05-26 18:30:00'),
                'required_volunteers' => 8,
                'category' => 'fundraiser',
            ],
            [
                'title' => 'Youth Skills Workshop',
                'description' => 'DEMO: Mentor youth in resume writing and interviews.',
                'location' => 'Hamilton Library',
                'date' => Carbon::parse('2026-06-02 13:00:00'),
                'required_volunteers' => 6,
                'category' => 'workshop',
            ],
            [
                'title' => 'Neighborhood Outreach',
                'description' => 'DEMO: Door-to-door information about local services.',
                'location' => 'East End',
                'date' => Carbon::parse('2026-06-10 11:00:00'),
                'required_volunteers' => 12,
                'category' => 'other',
            ],
        ];

        $createdEvents = collect($events)->map(function (array $data) use ($organizer) {
            return Event::query()->updateOrCreate([
                'title' => $data['title'],
                'created_by' => $organizer->id,
            ], [
                ...$data,
                'created_by' => $organizer->id,
            ]);
        });

        Application::query()->updateOrCreate([
            'event_id' => $createdEvents[0]->id,
            'volunteer_id' => $volunteer->id,
        ], [
            'status' => 'pending',
        ]);

        Application::query()->updateOrCreate([
            'event_id' => $createdEvents[1]->id,
            'volunteer_id' => $volunteer->id,
        ], [
            'status' => 'approved',
        ]);

        Notification::query()->firstOrCreate([
            'user_id' => $volunteer->id,
            'message' => 'DEMO: Welcome to VolunteerFlow! Complete your profile to get started.',
        ]);

        Notification::query()->firstOrCreate([
            'user_id' => $volunteer->id,
            'message' => 'DEMO: New volunteer opportunities match your skills.',
        ]);
    }
}
