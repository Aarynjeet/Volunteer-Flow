<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return Notification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(50);
    }

    public function markRead(Request $request, int $id)
    {
        $notification = Notification::query()
            ->where('user_id', $request->user()->id)
            ->whereKey($id)
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json($notification->fresh());
    }

    public function markAllRead(Request $request)
    {
        Notification::query()
            ->where('user_id', $request->user()->id)
            ->update(['read' => true]);

        return response()->json(['ok' => true]);
    }
}
