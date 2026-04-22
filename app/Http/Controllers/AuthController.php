<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['volunteer', 'organizer'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
        ]);

        Auth::login($user);

        return response()->json($user, 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('web')->attempt([
            'email' => $validated['email'],
            'password' => $validated['password'],
        ])) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(null, 200);
    }

    public function me(Request $request)
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json($request->user());
    }
}
