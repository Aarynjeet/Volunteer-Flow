<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query()->with('volunteer');

        if ($request->user()->isAdmin()) {
            // all
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
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'type' => ['required', 'in:id,background_check,certification,training'],
        ]);

        $path = $validated['file']->store('documents', 'public');
        $url = Storage::disk('public')->url($path);

        $document = Document::create([
            'volunteer_id' => $request->user()->id,
            'file_url' => $url,
            'file_name' => $validated['file']->getClientOriginalName(),
            'type' => $validated['type'],
            'status' => 'pending',
        ]);

        return response()->json($document->load('volunteer'), 201);
    }

    public function review(Request $request, int $id)
    {
        $document = Document::query()->with('volunteer')->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
            'rejection_reason' => ['nullable', 'string', 'required_if:status,rejected'],
        ]);

        $document->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
        ]);

        Notification::create([
            'user_id' => $document->volunteer_id,
            'message' => 'Your document '.$document->file_name.' was '.$validated['status'].'.',
            'read' => false,
        ]);

        return response()->json($document->fresh()->load('volunteer'));
    }
}
