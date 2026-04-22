<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminVolunteerController extends Controller
{
    public function index(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return User::query()
            ->where('role', 'volunteer')
            ->with('volunteer')
            ->orderByDesc('created_at')
            ->paginate(20);
    }
}

