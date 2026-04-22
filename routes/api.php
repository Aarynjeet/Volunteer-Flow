<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AdminVolunteerController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HourController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\VolunteerProfileController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard/volunteer', [DashboardController::class, 'volunteer'])->middleware('role:volunteer');
    Route::get('/dashboard/organizer', [DashboardController::class, 'organizer'])->middleware('role:organizer');
    Route::get('/dashboard/admin', [DashboardController::class, 'admin'])->middleware('role:admin');

    Route::get('/volunteer/profile', [VolunteerProfileController::class, 'show'])->middleware('role:volunteer');
    Route::put('/volunteer/profile', [VolunteerProfileController::class, 'update'])->middleware('role:volunteer');

    Route::get('/admin/volunteers', [AdminVolunteerController::class, 'index'])->middleware('role:admin');

    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{id}', [EventController::class, 'show'])->whereNumber('id');
    Route::put('/events/{id}', [EventController::class, 'update'])->whereNumber('id');
    Route::delete('/events/{id}', [EventController::class, 'destroy'])
        ->middleware('role:admin')
        ->whereNumber('id');

    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::get('/events/{eventId}/applications', [ApplicationController::class, 'byEvent'])
        ->middleware('role:admin,organizer')
        ->whereNumber('eventId');
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::patch('/applications/{id}/status', [ApplicationController::class, 'updateStatus'])
        ->middleware('role:admin,organizer')
        ->whereNumber('id');

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::patch('/documents/{id}/review', [DocumentController::class, 'review'])
        ->middleware('role:admin')
        ->whereNumber('id');

    Route::get('/hours/leaderboard', [HourController::class, 'leaderboard']);
    Route::get('/hours', [HourController::class, 'index']);
    Route::post('/hours', [HourController::class, 'store']);
    Route::patch('/hours/{id}/approve', [HourController::class, 'approve'])
        ->middleware('role:admin')
        ->whereNumber('id');

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markRead'])->whereNumber('id');
});
