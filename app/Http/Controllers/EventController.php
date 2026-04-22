<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()
            ->with('creator')
            ->orderByDesc('date');

        if ($request->boolean('mine')) {
            $query->where('created_by', $request->user()->id);
        }

        return $query->paginate(10);
    }

    public function store(Request $request)
    {
        if (! $request->user()->isAdmin() && ! $request->user()->isOrganizer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'after_or_equal:1000-01-01', 'before_or_equal:9999-12-31 23:59:59'],
            'required_volunteers' => ['required', 'integer', 'min:1'],
            'category' => ['required', 'in:food_drive,community_cleanup,fundraiser,workshop,other'],
        ]);

        $event = Event::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($event->load('creator'), 201);
    }

    public function show(Request $request, int $id)
    {
        $event = Event::query()
            ->with('creator')
            ->withCount('applications')
            ->findOrFail($id);

        return response()->json($event);
    }

    public function update(Request $request, int $id)
    {
        $event = Event::query()->findOrFail($id);

        if (! $request->user()->isAdmin() && (int) $event->created_by !== (int) $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date', 'after_or_equal:1000-01-01', 'before_or_equal:9999-12-31 23:59:59'],
            'required_volunteers' => ['required', 'integer', 'min:1'],
            'category' => ['required', 'in:food_drive,community_cleanup,fundraiser,workshop,other'],
        ]);

        $event->update($validated);

        return response()->json($event->fresh()->load('creator'));
    }

    public function destroy(Request $request, int $id)
    {
        $event = Event::query()->findOrFail($id);

        $event->delete();

        return response()->json(null, 204);
    }
}
