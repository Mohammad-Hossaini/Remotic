<?php

namespace App\Http\Controllers;

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
            'resume_path'       => 'required|mimes:pdf,doc,docx|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $job = Job::findOrFail($jobId);

        // 🔹 Prevent duplicate applications
        $exists = Application::where('user_id', Auth::id())
            ->where('job_id', $jobId)
            ->first();

        if ($exists) {
            return response()->json(['message' => 'You have already applied for this job.'], 400);
        }

        // 🔹 Handle resume upload
        $resumePath = null;
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('resumes'), $filename);

            $resumePath = 'resumes/' . $filename; // relative path
        }

        $application = Application::create([
            'user_id'      => Auth::id(),
            'job_id'       => $jobId,
            'cover_letter' => $request->cover_letter,
            'resume_path'  => $resumePath,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message'     => 'Application submitted successfully.',
            'application' => $application,
        ], 201);
    }
    // public function store(Request $request, $jobId)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'cover_letter' => 'nullable|string|max:2000',
    //         'resume_path'       => 'required|mimes:pdf,doc,docx|max:2048',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     // Handle resume upload
    //     // $resumePath = null;
    //     // if ($request->hasFile('resume')) {
    //     //     $resumePath = $request->file('resume')->store('public/resumes');
    //     // }
    //      if ($request->hasFile('resume')) {
    //         $file = $request->file('resume');
    //         $filename = time() . '_' . $file->getClientOriginalName();

    //         // Save directly in public/resumes
    //         $file->move(public_path('resumes'), $filename);

    //         $resumePath = 'resumes/' . $filename; // save relative path in DB
    //     }

    //     $application = Application::create([
    //         'user_id'      => Auth::id(),
    //         'job_id'       => $jobId,
    //         'cover_letter' => $request->cover_letter,
    //         'resume_path'  => $resumePath,
    //         'status'       => 'pending',
    //     ]);

    //     return response()->json([
    //         'message' => 'Application submitted successfully.',
    //         'application' => $application,
    //     ], 201);
    // }

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

        return response()->json(['message' => 'Application status updated.']);
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
