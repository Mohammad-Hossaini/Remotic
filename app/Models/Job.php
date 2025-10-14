<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'user_id',
        'title',
        'description',
        'requirements',
        'location',
        'salary_min',
        'salary_max',
        'job_type',
        'status',
        'deadline',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function favorites()
    {
        return $this->hasMany(FavoriteJob::class);
    }

    // 🧠 Accessor to check if logged-in user applied
    public function getIsAppliedAttribute()
    {
        $user = Auth::user();
        if (!$user) return false;

        return $this->applications()->where('user_id', $user->id)->exists();
    }

    // ⭐ Accessor to check if job is favorited
    public function getIsFavoritedAttribute()
    {
        $user = Auth::user();
        if (!$user) return false;

        return $this->favorites()->where('user_id', $user->id)->exists();
    }

    // 🧭 Always include these custom attributes in JSON responses
    protected $appends = ['is_applied', 'is_favorited'];
}
