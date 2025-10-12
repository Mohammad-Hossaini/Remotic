<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class JobController extends Controller
{
    /**
     * List all open jobs (for job seekers & public view)
     */
    public function index()
    {
        // Show only jobs with status "open"
        $jobs = Job::with('company', 'user')
            ->where('status', 'open')
            ->latest()
            ->get();

        return response()->json($jobs);
    }

    /**
     * Show single job details (only open jobs for seekers, all for admin/employer)
     */
    public function show(Request $request, $id)
    {
        $job = Job::with('company', 'user')->findOrFail($id);

        // If job is not open, only the owner or admin can view it
        if ($job->status !== 'open' &&
            !($request->user()->id === $job->user_id || $request->user()->role === 'admin')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($job);
    }

    /**
     * Employer: Create a new job
     */
   public function store(Request $request)
    {
        // ✅ Validate only other fields (no need for company_id)
        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'requirements' => 'nullable|string',
            'salary_min'   => 'nullable|numeric|min:0',
            'salary_max'   => 'nullable|numeric|min:0|gte:salary_min',
            'job_type'     => 'required|in:full-time,part-time,contract,internship,remote',
            'location'     => 'required|string|max:255',
            'status'       => 'nullable|in:open,closed,draft',
            'deadline'     => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $request->user();

        // ✅ Automatically get the user's company_id if exists
        $companyId = $user->company ? $user->company->id : null;

        // 🧱 Create the job with automatic company assignment
        $job = Job::create([
            'company_id'  => $companyId,           // automatically filled
            'user_id'     => $user->id,
            'title'       => $request->title,
            'description' => $request->description,
            'requirements'=> $request->requirements,
            'salary_min'  => $request->salary_min,
            'salary_max'  => $request->salary_max,
            'job_type'    => $request->job_type,
            'location'    => $request->location,
            'status'      => $request->status ?? 'draft',
            'deadline'    => $request->deadline,
        ]);

        // Load the company relationship
        $job->load('company');

        return response()->json([
            'message' => 'Job created successfully.',
            'job' => $job,
        ], 201);
    }


    /**
     * Employer: Update their own job (including status)
     */
    public function update(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        // Ensure the authenticated user is the owner
        if ($request->user()->id !== $job->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|required|string|max:255',
            'description'  => 'sometimes|required|string',
            'requirements' => 'sometimes|nullable|string',
            'salary_min'   => 'nullable|numeric|min:0',
            'salary_max'   => 'nullable|numeric|min:0|gte:salary_min',
            'job_type'     => 'sometimes|required|in:full-time,part-time,contract,internship,remote',
            'location'     => 'sometimes|required|string|max:255',
            'status'       => 'sometimes|required|in:open,closed,draft',
            'deadline'     => 'sometimes|nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $job->update($request->only([
            'title', 'description',  'requirements' , 'salary_min', 'salary_max', 'job_type', 'location', 'status', 'deadline',
        ]));

         // Load the company relationship
        $job->load('company');

        return response()->json([
            'message' => 'Job Updated successfully.',
            'job' => $job,
        ], 200);
    }

    /**
     * Employer: Delete their own job
     */
    public function destroy(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        if ($request->user()->id !== $job->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }

    /**
     * Employer: List all jobs they posted
     */
    public function myJobs(Request $request)
    {
        $jobs = Job::with('company','user')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($jobs);
    }

    /**
     * Admin: View all jobs (open, closed, draft)
     */
    public function allJobs()
    {
        $jobs = Job::with('company', 'user')->latest()->get();
        return response()->json($jobs);
    }

    /**
     * Admin: Change job status (open, closed, draft)
     */
    public function changeStatus(Request $request, $id)
    {
        $job = Job::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:open,closed,draft',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $job->status = $request->status;
        $job->save();

        return response()->json(['message' => 'Job status updated', 'job' => $job ,  ]);
    }
}

// class JobController extends Controller
// {
//     public function index()
//     {
//         return response()->json(Job::with('company','user')->latest()->get());
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'company_id' => 'required|exists:companies,id',
//             'title' => 'required|string|max:255',
//             'description' => 'required|string',
//             'requirements' => 'nullable|string',
//             'location' => 'nullable|string|max:255',
//             'salary_min' => 'nullable|integer|min:0',
//             'salary_max' => 'nullable|integer|min:0|gte:salary_min',
//             'job_type' => 'required|in:full-time,part-time,contract,internship,remote',
//             'status' => 'required|in:open,closed,draft',
//             'deadline' => 'nullable|date|after:today',
//         ]);

//         $validated['user_id'] = Auth::id();

//         $job = Job::create($validated);

//         return response()->json($job, 201);
//     }

//     public function show($id)
//     {
//         return response()->json(Job::with('company','user')->findOrFail($id));
//     }

//     public function update(Request $request, $id)
//     {
//         $job = Job::findOrFail($id);

//         $validated = $request->validate([
//             'title' => 'sometimes|required|string|max:255',
//             'description' => 'sometimes|required|string',
//             'requirements' => 'nullable|string',
//             'location' => 'nullable|string|max:255',
//             'salary_min' => 'nullable|integer|min:0',
//             'salary_max' => 'nullable|integer|min:0|gte:salary_min',
//             'job_type' => 'sometimes|required|in:full-time,part-time,contract,internship,remote',
//             'status' => 'sometimes|required|in:open,closed,draft',
//             'deadline' => 'nullable|date|after:today',
//         ]);

//         $job->update($validated);

//         return response()->json(['message' => 'Job updated successfully', 'job' => $job]);
//     }

//     public function destroy($id)
//     {
//         $job = Job::findOrFail($id);
//         $job->delete();

//         return response()->json(['message' => 'Job deleted successfully']);
//     }
// }