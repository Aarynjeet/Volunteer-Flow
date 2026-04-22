<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = Application::query()->with(['event', 'volunteer.volunteer']);

        if ($request->user()->isAdmin()) {
            // all
        } elseif ($request->user()->isOrganizer()) {
            $query->whereHas('event', function ($q) use ($request) {
                $q->where('created_by', $request->user()->id);
            });
        } else {
            $query->where('volunteer_id', $request->user()->id);
        }

        return $query->orderByDesc('created_at')->paginate(15);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isVolunteer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $exists = Application::query()
            ->where('event_id', $validated['event_id'])
            ->where('volunteer_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already applied for this event'], 422);
        }

        $application = Application::create([
            'event_id' => $validated['event_id'],
            'volunteer_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        $application->load(['event', 'volunteer.volunteer']);

        User::query()
            ->where('role', 'admin')
            ->each(function (User $admin) use ($application) {
                Notification::create([
                    'user_id' => $admin->id,
                    'message' => 'New application for event: '.$application->event->title,
                    'read' => false,
                ]);
            });

        return response()->json($application, 201);
    }

    public function updateStatus(Request $request, int $id)
    {
        $application = Application::query()->with(['event', 'volunteer.volunteer'])->findOrFail($id);

        if ($request->user()->isOrganizer()) {
            if ((int) $application->event->created_by !== (int) $request->user()->id) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected,completed'],
        ]);

        $application->update([
            'status' => $validated['status'],
        ]);

        Notification::create([
            'user_id' => $application->volunteer_id,
            'message' => 'Your application for '.$application->event->title.' is now '.$validated['status'].'.',
            'read' => false,
        ]);

        return response()->json($application->fresh()->load(['event', 'volunteer.volunteer']));
    }

    public function byEvent(Request $request, int $eventId)
    {
        $event = \App\Models\Event::query()->findOrFail($eventId);

        if (! $request->user()->isAdmin() && (int) $event->created_by !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return Application::query()
            ->where('event_id', $eventId)
            ->with(['event', 'volunteer.volunteer'])
            ->orderByDesc('created_at')
            ->paginate(20);
    }
}
