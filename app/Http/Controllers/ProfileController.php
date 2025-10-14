<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
   /// List all profiles (Admin only maybe later)
    public function index()
    {
        return response()->json(Profile::with('user')->get());
    }

    // Show a single profile
    public function show($id)
    {
        $profile = Profile::with('user')->findOrFail($id);
        return response()->json($profile);
    }

    // Create profile (only for logged-in user who doesn’t already have one)
    public function store(Request $request)
    {
        $request->validate([
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'description'  => 'nullable|string',
            'resume'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'education'    => 'nullable|string|max:255',
            'skills'       => 'nullable|string|max:500',
            'profile_image' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'background_image' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = Auth::user();

        // Prevent duplicate profiles
        if ($user->profile) {
            return response()->json(['message' => 'Profile already exists'], 400);
        }

        // Handle resume upload
        // $resumePath = null;
        // if ($request->hasFile('resume')) {
        //     $resumePath = $request->file('resume')->store('resumes', 'public');
        // }
        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = time() . '_' . $file->getClientOriginalName();

            // Save directly in public/resumes
            $file->move(public_path('resumes'), $filename);

            $resumePath = 'resumes/' . $filename; // save relative path in DB
        }
        // Handle profile image upload
        $profileImagePath = null;
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('profile_images'), $filename);
            $profileImagePath = 'profile_images/' . $filename;
        }
        // Handle background image upload
        $backgroundImagePath = null;
        if ($request->hasFile('background_image')) {
            $file = $request->file('background_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('background_images'), $filename);
            $backgroundImagePath = 'background_images/' . $filename;
        }


        $profile = Profile::create([
            'user_id'     => $user->id,
            'first_name'  => $request->first_name,
            'last_name'   => $request->last_name,
            'phone'       => $request->phone,
            'description' => $request->description,
            'resume'      => $resumePath,
            'education'   => $request->education,
            'skills'      => $request->skills,
            'profile_image' => $profileImagePath,
            'background_image' => $backgroundImagePath,
        ]);

        return response()->json($profile, 201);
    }

    // Update profile (only by owner)
    public function update(Request $request, $id)
    {
        $profile = Profile::findOrFail($id);

        // Ensure logged-in user owns this profile
        if (Auth::id() !== $profile->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'first_name'   => 'sometimes|required|string|max:255',
            'last_name'    => 'sometimes|required|string|max:255',
            'phone'        => 'nullable|string|max:20',
            'description'  => 'nullable|string',
            'resume'       => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'education'    => 'nullable|string|max:255',
            'skills'       => 'nullable|string|max:500',
            'profile_image' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'background_image' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Inside ProfileController@update
        if ($request->hasFile('resume')) {
            // Delete old resume if exists
            if ($profile->resume && file_exists(public_path($profile->resume))) {
                unlink(public_path($profile->resume));
            }

            $file = $request->file('resume');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('resumes'), $filename);

            $profile->resume = 'resumes/' . $filename;
        }

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old profile image if exists
            if ($profile->profile_image && file_exists(public_path($profile->profile_image))) {
                unlink(public_path($profile->profile_image));
            }
            $file = $request->file('profile_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('profile_images'), $filename);
            $profile->profile_image = 'profile_images/' . $filename;
        }
        // Handle background image upload
        if ($request->hasFile('background_image')) {
            // Delete old background image if exists
            if ($profile->background_image && file_exists(public_path($profile->background_image))) {
                unlink(public_path($profile->background_image));
            }
            $file = $request->file('background_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('background_images'), $filename);
            $profile->background_image = 'background_images/' . $filename;
        }

        $profile->update($request->only([
            'first_name', 'last_name', 'phone', 'description', 'education', 'skills', 
        ]));

        return response()->json($profile);
    }

    // Delete profile (owner only)
    // app/Http/Controllers/ProfileController.php

    public function destroy($id)
    {
        $profile = Profile::findOrFail($id);

        // Ensure only the owner can delete
        if (Auth::id() !== $profile->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete resume file if it exists
        if ($profile->resume && file_exists(public_path($profile->resume))) {
            unlink(public_path($profile->resume));
        }
        // Delete profile image file if it exists
        if ($profile->profile_image && file_exists(public_path($profile->profile_image))) {
            unlink(public_path($profile->profile_image));
        }
        // Delete background image file if it exists
        if ($profile->background_image && file_exists(public_path($profile->background_image))) {
            unlink(public_path($profile->background_image));
        }

        // Delete profile
        $profile->delete();

        return response()->json(['message' => 'Profile and resume deleted successfully']);
    }

    public function deleteProfileImage($id)
    {
        $profile = Profile::findOrFail($id);

        // Ensure only the owner can delete the profile image
        if (Auth::id() !== $profile->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($profile->profile_image && file_exists(public_path($profile->profile_image))) {
            unlink(public_path($profile->profile_image));
            $profile->profile_image = null;
            $profile->save();
            return response()->json(['message' => 'Profile image deleted successfully']);
        }

        return response()->json(['message' => 'No profile image to delete'], 404);
    }
    public function deleteBackgroundImage($id)
    {
        $profile = Profile::findOrFail($id);

        // Ensure only the owner can delete the background image
        if (Auth::id() !== $profile->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($profile->background_image && file_exists(public_path($profile->background_image))) {
            unlink(public_path($profile->background_image));
            $profile->background_image = null;
            $profile->save();
            return response()->json(['message' => 'Background image deleted successfully']);
        }

        return response()->json(['message' => 'No background image to delete'], 404);
    }
}