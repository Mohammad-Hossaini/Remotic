<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\FavoriteJob;
use App\Models\Job;
use App\Models\User;
use Carbon\Carbon;
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
        $totalUsers = User::count();
        $totalJobs = Job::count();
        $totalApplications = Application::count();
        $totalEmployers = User::where('role', 'employer')->count();
        $totalJobSeekers = User::where('role', 'job_seeker')->count();

        // Applications per month
        $applicationsPerMonth = Application::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Applications per day (last 30 days)
        $applicationsPerDay = Application::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Jobs per month
        $jobsPerMonth = Job::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Jobs per day (last 30 days)
        $jobsPerDay = Job::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => [
                'total_users'        => $totalUsers,
                'total_jobs'         => $totalJobs,
                'total_applications' => $totalApplications,
                'total_employers'    => $totalEmployers,
                'total_job_seekers'  => $totalJobSeekers,
            ],
            'charts' => [
                'applications_per_month' => $applicationsPerMonth,
                'applications_per_day'   => $applicationsPerDay,
                'jobs_per_month'         => $jobsPerMonth,
                'jobs_per_day'           => $jobsPerDay,
            ],
        ]);
    }

    // 🏢 Employer Dashboard
    protected function employerDashboard($user)
    {
        $company = $user->company;
        $jobs = $company ? $company->jobs : collect();

        $applicationsCount = Application::whereIn('job_id', $jobs->pluck('id'))->count();

        // Applications per job
        $applicationsPerJob = Application::whereIn('job_id', $jobs->pluck('id'))
            ->selectRaw('job_id, COUNT(*) as count')
            ->groupBy('job_id')
            ->with('job:id,title')
            ->get()
            ->map(function ($row) {
                return [
                    'job_title' => $row->job->title,
                    'applications' => $row->count,
                ];
            });

        // Applications per day (last 30 days)
        $applicationsPerDay = Application::whereIn('job_id', $jobs->pluck('id'))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'company' => $company,
            'total_jobs_posted' => $jobs->count(),
            'total_applications_received' => $applicationsCount,
            'recent_jobs' => $jobs->take(5),
            'charts' => [
                'applications_per_job' => $applicationsPerJob,
                'applications_per_day' => $applicationsPerDay,
            ],
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

        // Applications per month
        $applicationsPerMonth = Application::where('user_id', $user->id)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Applications per day (last 30 days)
        $applicationsPerDay = Application::where('user_id', $user->id)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'profile' => $user->profile,
            'total_applied_jobs' => $appliedJobs->count(),
            'total_favorite_jobs' => $favoriteJobs->count(),
            'recent_applied_jobs' => $appliedJobs,
            'recent_favorite_jobs' => $favoriteJobs,
            'charts' => [
                'applications_per_month' => $applicationsPerMonth,
                'applications_per_day'   => $applicationsPerDay,
            ],
        ]);
    }
}