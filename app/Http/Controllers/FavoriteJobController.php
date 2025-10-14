<?php

namespace App\Http\Controllers;

use App\Models\FavoriteJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteJobController extends Controller
{
    // Add job to favorites
    public function store($jobId)
    {
        $user = Auth::user();

        if (FavoriteJob::where('user_id', $user->id)->where('job_id', $jobId)->exists()) {
            return response()->json(['message' => 'Already in favorites.'], 409);
        }

        $favorite = FavoriteJob::create([
            'user_id' => $user->id,
            'job_id' => $jobId,
        ]);

        $favorite->load('user', 'job');
        return response()->json($favorite, 201);
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
        $favorites = FavoriteJob::with('job')->where('user_id', $user->id)->get();

        return response()->json($favorites);
    }
}