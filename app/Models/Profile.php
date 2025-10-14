<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'description',
        'resume',
        'education',
        'skills',
        'profile_image',
        'background_image',
    ];

    // A profile belongs to one user
    public function user() {
        return $this->belongsTo(User::class);
    }
}
