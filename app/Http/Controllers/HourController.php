<?php

namespace App\Http\Controllers;

use App\Models\Hour;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HourController extends Controller
{
    public function index(Request $request)
    {
        $query = Hour::query()->with('event');

        if ($request->user()->isAdmin()) {
            $query->with('volunteer');
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
            'hours' => ['required', 'numeric', 'min:0.01', 'max:999.99'],
        ]);

        $hour = Hour::create([
            'volunteer_id' => $request->user()->id,
            'event_id' => $validated['event_id'],
            'hours' => $validated['hours'],
            'status' => 'pending',
        ]);

        return response()->json($hour->load(['event', 'volunteer']), 201);
    }

    public function approve(Request $request, int $id)
    {
        $hour = Hour::query()->findOrFail($id);

        $hour->update([
            'status' => 'approved',
        ]);

        return response()->json($hour->fresh()->load(['event', 'volunteer']));
    }

    public function leaderboard(Request $request)
    {
        $totals = DB::table('hours')
            ->select('volunteer_id', DB::raw('SUM(hours) as total_hours'))
            ->where('status', 'approved')
            ->groupBy('volunteer_id')
            ->orderByDesc('total_hours')
            ->limit(10)
            ->get();

        $users = User::query()
            ->whereIn('id', $totals->pluck('volunteer_id'))
            ->get()
            ->keyBy('id');

        $payload = $totals->map(function ($row) use ($users) {
            return [
                'volunteer_id' => (int) $row->volunteer_id,
                'total_hours' => (float) $row->total_hours,
                'user' => $users[$row->volunteer_id] ?? null,
            ];
        });

        return response()->json($payload);
    }
}
