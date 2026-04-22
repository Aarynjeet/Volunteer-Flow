<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hour extends Model
{
    protected $fillable = [
        'volunteer_id',
        'event_id',
        'hours',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'hours' => 'decimal:2',
        ];
    }

    public function volunteer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'volunteer_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
