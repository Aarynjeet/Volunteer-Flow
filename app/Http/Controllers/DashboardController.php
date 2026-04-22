<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Document;
use App\Models\Event;
use App\Models\Hour;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function volunteer(Request $request)
    {
        if (! $request->user()->isVolunteer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $userId = $request->user()->id;

        return response()->json([
            'summary' => [
                'total_applications' => Application::query()->where('volunteer_id', $userId)->count(),
                'approved_applications' => Application::query()->where('volunteer_id', $userId)->where('status', 'approved')->count(),
                'submitted_documents' => Document::query()->where('volunteer_id', $userId)->count(),
                'approved_hours' => (float) Hour::query()->where('volunteer_id', $userId)->where('status', 'approved')->sum('hours'),
            ],
            'recent_applications' => Application::query()
                ->where('volunteer_id', $userId)
                ->with('event')
                ->latest()
                ->limit(5)
                ->get(),
            'recent_notifications' => Notification::query()
                ->where('user_id', $userId)
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }

    public function organizer(Request $request)
    {
        if (! $request->user()->isOrganizer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $userId = $request->user()->id;
        $eventIds = Event::query()->where('created_by', $userId)->pluck('id');

        return response()->json([
            'summary' => [
                'owned_events' => $eventIds->count(),
                'total_applications' => Application::query()->whereIn('event_id', $eventIds)->count(),
                'pending_applications' => Application::query()->whereIn('event_id', $eventIds)->where('status', 'pending')->count(),
                'approved_hours_submissions' => Hour::query()->whereIn('event_id', $eventIds)->where('status', 'approved')->count(),
            ],
            'events' => Event::query()
                ->where('created_by', $userId)
                ->withCount('applications')
                ->orderByDesc('date')
                ->limit(10)
                ->get(),
            'recent_applications' => Application::query()
                ->whereIn('event_id', $eventIds)
                ->with(['event', 'volunteer'])
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }

    public function admin(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $monthExpression = DB::getDriverName() === 'sqlite'
            ? "strftime('%Y-%m', created_at)"
            : "DATE_FORMAT(created_at, '%Y-%m')";

        $usersByMonth = User::query()
            ->selectRaw($monthExpression.' as month, COUNT(*) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(12)
            ->get();

        return response()->json([
            'summary' => [
                'total_users' => User::query()->count(),
                'total_volunteers' => User::query()->where('role', 'volunteer')->count(),
                'total_organizers' => User::query()->where('role', 'organizer')->count(),
                'total_events' => Event::query()->count(),
                'pending_documents' => Document::query()->where('status', 'pending')->count(),
                'pending_applications' => Application::query()->where('status', 'pending')->count(),
                'pending_hours' => Hour::query()->where('status', 'pending')->count(),
            ],
            'recent_users' => User::query()->latest()->limit(10)->get(),
            'recent_applications' => Application::query()->with(['event', 'volunteer'])->latest()->limit(10)->get(),
            'recent_documents' => Document::query()->with('volunteer')->latest()->limit(10)->get(),
            'recent_hours' => Hour::query()->with(['event', 'volunteer'])->latest()->limit(10)->get(),
            'recent_notifications' => Notification::query()->latest()->limit(10)->get(),
            'analytics' => [
                'users_by_month' => $usersByMonth,
                'applications_by_status' => Application::query()
                    ->select('status', DB::raw('COUNT(*) as total'))
                    ->groupBy('status')
                    ->get(),
                'documents_by_status' => Document::query()
                    ->select('status', DB::raw('COUNT(*) as total'))
                    ->groupBy('status')
                    ->get(),
                'hours_by_status' => Hour::query()
                    ->select('status', DB::raw('COUNT(*) as total'))
                    ->groupBy('status')
                    ->get(),
            ],
        ]);
    }
}

