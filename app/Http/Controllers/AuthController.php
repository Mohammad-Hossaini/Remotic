<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
   // Register new user
   public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,employer,job_seeker',
            'profile' => 'nullable|array',   // optional profile data
            'company' => 'nullable|array',   // optional company data
        ]);

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // If user is a job seeker
        if ($request->role === 'job_seeker') {
            if ($request->filled('profile')) {
                // Create profile with provided data
                $user->profile()->create($request->profile);
        }}

        // If user is an employer
        if ($request->role === 'employer') {
            if ($request->filled('company')) {
                // Create company with provided data
                $user->company()->create($request->company);
        }
    }
        // Generate token
        $token = $user->createToken('api_token')->plainTextToken;

        // Return user + related models
        return response()->json([
            'user' => $user->load('profile', 'company'), // eager load relations
            'token' => $token
        ]);
    }


    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find user
        $user = User::where('email', $request->email)->first();

        // Check credentials
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        // Generate token
        $token = $user->createToken('api_token')->plainTextToken;

        // Return user + related models
        return response()->json([
            'user' => $user->load('profile', 'company'),
            'token' => $token
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // Get logged in user
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // Admin: get all users
    public function allUsers()
    {
        return response()->json(User::all());
    }
}
