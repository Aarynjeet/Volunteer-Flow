<?php

namespace App\Http\Controllers;

use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VolunteerProfileController extends Controller
{
    public function show(Request $request)
    {
        if (! $request->user()->isVolunteer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $profile = Volunteer::query()->firstOrCreate(
            ['user_id' => $request->user()->id],
            [
                'phone' => null,
                'location' => null,
                'bio' => null,
                'experience' => null,
                'skills' => null,
                'availability' => null,
                'emergency_contact' => null,
                'resume_url' => null,
                'resume_file_name' => null,
            ],
        );

        return response()->json($profile->load('user'));
    }

    public function update(Request $request)
    {
        if (! $request->user()->isVolunteer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'experience' => ['nullable', 'string', 'max:5000'],
            'skills' => ['nullable', 'string', 'max:2000'],
            'availability' => ['nullable', 'string', 'max:2000'],
            'emergency_contact' => ['nullable', 'string', 'max:255'],
            'resume' => ['nullable', 'file', 'mimes:pdf', 'max:5120'],
        ]);

        $profile = Volunteer::query()->firstOrCreate(['user_id' => $request->user()->id]);

        if ($request->hasFile('resume')) {
            if ($profile->resume_url) {
                $existingPath = ltrim(str_replace('/storage/', '', $profile->resume_url), '/');
                if ($existingPath !== '' && Storage::disk('public')->exists($existingPath)) {
                    Storage::disk('public')->delete($existingPath);
                }
            }

            $path = $request->file('resume')->store('resumes', 'public');
            $validated['resume_url'] = Storage::disk('public')->url($path);
            $validated['resume_file_name'] = $request->file('resume')->getClientOriginalName();
        }

        unset($validated['resume']);

        $profile->update($validated);

        return response()->json($profile->fresh()->load('user'));
    }
}

