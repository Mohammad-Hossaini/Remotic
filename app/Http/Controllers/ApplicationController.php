<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    // Submit new application
    // Submit new application (Job Seeker only)
  public function store(Request $request, $jobId)
    {
        $validator = Validator::make($request->all(), [
            'cover_letter' => 'nullable|string|max:2000',
            'resume_path'  => 'required|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = Job::findOrFail($jobId);
        $user = auth()->user();

        // 🔹 Prevent duplicate applications
        if (Application::where('user_id', $user->id)->where('job_id', $jobId)->exists()) {
            return response()->json(['message' => 'You have already applied for this job.'], 400);
        }

        // 🔹 Handle resume upload
        $resumePath = null;
        if ($request->hasFile('resume_path')) {
            $file = $request->file('resume_path');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('resumes'), $filename);
            $resumePath = 'resumes/' . $filename;
        }

        // 🔹 Create application
        $application = Application::create([
            'user_id'      => $user->id,
            'job_id'       => $jobId,
            'cover_letter' => $request->cover_letter,
            'resume_path'  => $resumePath,
            'status'       => 'pending',
        ]);

        // 🔹 Send notifications
        if ($job->company && $job->company->user_id) {
            NotificationHelper::send(
                $job->company->user_id,
                'New Job Application',
                "{$user->name} applied for your job: {$job->title}"
            );
        } elseif ($job->user_id) {
            NotificationHelper::send(
                $job->user_id,
                'New Job Application',
                "{$user->name} applied for your job: {$job->title}"
            );
        }

        NotificationHelper::send(
            $user->id,
            'Application Submitted',
            "You have successfully applied for the job: {$job->title}"
        );

        // 🔹 Refresh job to update accessors
        $job->refresh();
        // try {
        //     \Illuminate\Support\Facades\Artisan::call('cache:clear');
        //     \Illuminate\Support\Facades\Artisan::call('config:clear');
        //     \Illuminate\Support\Facades\Artisan::call('route:clear');
        //     \Illuminate\Support\Facades\Artisan::call('view:clear');
        //     \Illuminate\Support\Facades\Artisan::call('permission:cache-reset');
        // } catch (\Exception $e) {
        //     // ignore cache reset failures so response still returns
        // }
        $job->load('applications', 'favorites', 'company');

        // ✅ Now return job including is_applied = true
        return response()->json([
            'message'     => 'Application submitted successfully.',
            'job'         => $job,
        ], 201);
    }



     // Withdraw/Delete application (Job Seeker only)
    public function destroy($id)
    {
        $application = Application::where('id', $id)
            ->where('user_id', Auth::id()) // only owner can delete
            ->firstOrFail();

        // 🔹 Delete resume file from public/resumes
        if ($application->resume_path && file_exists(public_path($application->resume_path))) {
            unlink(public_path($application->resume_path));
        }

        $application->delete();

        return response()->json(['message' => 'Application withdrawn successfully.']);
    }
    // Employer updates status
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,under_review,shortlisted,accepted,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $application = Application::findOrFail($id);
        $application->status = $request->status;
        $application->save();

        $user = $application->user; // The applicant
        $job  = $application->job;
        $companyName = $job->company ? $job->company->name : ($job->user ? $job->user->name : 'Unknown');

        // 🔹 Send notification to the applicant
        $statusMessages = [
            'pending'      => "Your application for '{$job->title}' is now pending.",
            'under_review' => "Your application for '{$job->title}' is under review by {$companyName}.",
            'shortlisted'  => "Good news! Your application for '{$job->title}' has been shortlisted by {$companyName}.",
            'accepted'     => "Congratulations! Your application for '{$job->title}' has been accepted by {$companyName}.",
            'rejected'     => "We’re sorry. Your application for '{$job->title}' has been rejected by {$companyName}.",
        ];

        $message = $statusMessages[$application->status] ?? "Your application status for '{$job->title}' has been updated.";

        NotificationHelper::send(
            $user->id,
            'Application Status Update',
            $message
        );

        return response()->json([
            'message' => 'Application status updated and notification sent.',
            'application' => $application,
        ]);
    }


    // Applicant views their applications
    public function myApplications()
    {
        return response()->json(Auth::user()->applications()->with('job','user')->get());
    }

    // Employer views applicants for a job
    // public function jobApplications($jobId)
    // {
    //     return response()->json(Application::where('job_id', $jobId)->with('user','job',  )->get());
    // }

    // Employer views applicants for a job, including job and user info
    public function jobApplications(Request $request, $jobId)
    {
        // Ensure the authenticated user is the owner of the job
        $job = Job::where('id', $jobId)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Get all applications for this job with user and job info
        $applications = Application::where('job_id', $jobId)
            ->with(['user', 'job'])
            ->get();

        return response()->json($applications);
    }
    // Employer views all applications for their jobs
    public function allApplications(Request $request)
    {
        $applications = Application::whereHas('job', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->with(['user', 'job'])->get();

        return response()->json($applications);
    }
}



// class ApplicationController extends Controller
// {
//     // Apply for a job (Job Seeker only)
//     public function store(Request $request, $jobId)
//     {
//         $job = Job::findOrFail($jobId);

//         // Prevent duplicate applications
//         $existing = Application::where('user_id', $request->user()->id)
//             ->where('job_id', $job->id)
//             ->first();

//         if ($existing) {
//             return response()->json(['message' => 'Already applied'], 400);
//         }

//         $application = Application::create([
//             'user_id' => $request->user()->id,
//             'job_id' => $job->id,
//         ]);

//         return response()->json($application, 201);
//     }

//     // Employer: view applications for their jobs
//     public function employerApplications(Request $request)
//     {
//         $applications = Application::whereHas('job', function ($query) use ($request) {
//             $query->where('user_id', $request->user()->id);
//         })->with(['user', 'job'])->get();

//         return response()->json($applications);
//     }

//     // Job seeker: view their own applications
//     public function myApplications(Request $request)
//     {
//         return response()->json(
//             Application::with('job')->where('user_id', $request->user()->id)->get()
//         );
//     }
// }
