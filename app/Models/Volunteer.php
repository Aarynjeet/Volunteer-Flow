<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Volunteer extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'location',
        'bio',
        'experience',
        'skills',
        'availability',
        'emergency_contact',
        'resume_url',
        'resume_file_name',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
