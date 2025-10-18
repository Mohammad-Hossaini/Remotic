<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\FavoriteJob;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        switch ($user->role) {
            case 'admin':
                return $this->adminDashboard();
            case 'employer':
                return $this->employerDashboard($user);
            case 'job_seeker':
                return $this->jobSeekerDashboard($user);
            default:
                return response()->json(['message' => 'Invalid role'], 403);
        }
    }

    // 🧑‍💼 Admin Dashboard
    protected function adminDashboard()
    {
        return response()->json([
            'total_users'        => User::count(),
            'total_jobs'         => Job::count(),
            'total_applications' => Application::count(),
            'total_employers'    => User::where('role', 'employer')->count(),
            'total_job_seekers'  => User::where('role', 'job_seeker')->count(),
        ]);
    }

    // 🏢 Employer Dashboard
    protected function employerDashboard($user)
    {
        $company = $user->company;
        $jobs = $company ? $company->jobs : collect();

        $applicationsCount = Application::whereIn('job_id', $jobs->pluck('id'))->count();

        return response()->json([
            'company' => $company,
            'total_jobs_posted' => $jobs->count(),
            'total_applications_received' => $applicationsCount,
            'recent_jobs' => $jobs->take(5),
        ]);
    }

    // 👩‍🎓 Job Seeker Dashboard
    protected function jobSeekerDashboard($user)
    {
        $appliedJobs = Application::where('user_id', $user->id)
            ->with('job.company')
            ->latest()
            ->take(5)
            ->get();

        $favoriteJobs = FavoriteJob::where('user_id', $user->id)
            ->with('job.company')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'profile' => $user->profile,
            'total_applied_jobs' => $appliedJobs->count(),
            'total_favorite_jobs' => $favoriteJobs->count(),
            'recent_applied_jobs' => $appliedJobs,
            'recent_favorite_jobs' => $favoriteJobs,
        ]);
    }
}
