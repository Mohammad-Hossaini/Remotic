<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

    class Application extends Model
    {
        use HasFactory;

        protected $fillable = [
            'user_id',
            'job_id',
            'cover_letter',
            'resume_path',
            'status',
        ];

        // Relationships
        
        public function job()
        {
            return $this->belongsTo(Job::class);
        }
    }
