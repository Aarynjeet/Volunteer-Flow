<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isVolunteer(): bool
    {
        return $this->role === 'volunteer';
    }

    public function isOrganizer(): bool
    {
        return $this->role === 'organizer';
    }

    public function volunteer(): HasOne
    {
        return $this->hasOne(Volunteer::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'volunteer_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'volunteer_id');
    }

    public function hours(): HasMany
    {
        return $this->hasMany(Hour::class, 'volunteer_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
