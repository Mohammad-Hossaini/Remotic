<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Models\FavoriteJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteJobController extends Controller
{
    // Add job to favorites
    public function store($jobId)
    {
        $user = Auth::user();

        // 🔹 Prevent duplicate favorites
        if (FavoriteJob::where('user_id', $user->id)->where('job_id', $jobId)->exists()) {
            return response()->json(['message' => 'Already in favorites.'], 409);
        }

        // 🔹 Create favorite job
        $favorite = FavoriteJob::create([
            'user_id' => $user->id,
            'job_id'  => $jobId,
        ]);

        // Load relationships
        // $favorite->load('user', 'job');
        $favorite->load('user', 'job.company');


        // 🔹 Send notification to the user
        $job = $favorite->job;
        $companyName = $job->company ? $job->company->name : ($job->user ? $job->user->name : 'Unknown');

        NotificationHelper::send(
            $user->id,
            'Added to Favorites',
            "You have added the job '{$job->title}' by {$companyName} to your favorites."
        );

        return response()->json([
            'message'  => 'Job added to favorites successfully.',
            'favorite' => $favorite,
        ], 201);
    }


    // Remove from favorites
    public function destroy($jobId)
    {
        $user = Auth::user();
        FavoriteJob::where('user_id', $user->id)->where('job_id', $jobId)->delete();

        return response()->json(['message' => 'Removed from favorites.']);
    }

    // Get all favorite jobs
    public function myFavorites()
    {
        $user = Auth::user();
        // $favorites = FavoriteJob::with('job')->where('user_id', $user->id)->get();
        $favorites = FavoriteJob::with('job.company')->where('user_id', $user->id)->get();


        return response()->json($favorites);
    }
}