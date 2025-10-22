<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
     // List all companies
    public function index()
    {
        return response()->json(Company::with('user')->latest()->get());
    }

    // Show a single company
    public function show($id)
    {
        $company = Company::with('user')->findOrFail($id);
        return response()->json($company);
    }

    // Create company (Employer only)
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name'        => 'required|string|max:255',
    //         'industry'    => 'nullable|string|max:255',
    //         'location'    => 'nullable|string|max:255',
    //         'description' => 'nullable|string',
    //         'website'     => 'nullable|url',
    //         'logo'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    //     ]);

    //     $logoPath = null;
    //     if ($request->hasFile('logo')) {
    //         $file = $request->file('logo');
    //         $filename = time() . '_' . $file->getClientOriginalName();
    //         $file->move(public_path('logos'), $filename);
    //         $logoPath = 'logos/' . $filename;
    //     }

    //     $company = Company::create([
    //         'user_id'     => Auth::id(),
    //         'name'        => $request->name,
    //         'industry'    => $request->industry,
    //         'location'    => $request->location,
    //         'description' => $request->description,
    //         'website'     => $request->website,
    //         'logo'        => $logoPath,
    //     ]);

    //     $company->load('user');
    //     return response()->json($company, 201);
    // }
    public function store(Request $request)
{
    $request->validate([
        'user_id'     => 'nullable|exists:users,id',
        'name'        => 'required|string|max:255',
        'industry'    => 'nullable|string|max:255',
        'location'    => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'website'     => 'nullable|url',
        'logo'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $logoPath = null;
    if ($request->hasFile('logo')) {
        $file = $request->file('logo');
        $filename = time() . '_' . $file->getClientOriginalName();
    $logoPath = $file->storeAs('logos', $filename, 'public');

    }

    $company = Company::create([
        'user_id'     => $request->user_id ?? Auth::id(), // ✅ حالا اگر user_id ارسال شده بود، استفاده می‌شود
        'name'        => $request->name,
        'industry'    => $request->industry,
        'location'    => $request->location,
        'description' => $request->description,
        'website'     => $request->website,
        'logo'        => $logoPath,
    ]);

    $company->load('user');
    return response()->json($company, 201);
}


    // Update company (owner only)
    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        if (Auth::id() !== $company->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'industry'    => 'nullable|string|max:255',
            'location'    => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'website'     => 'nullable|url',
            'logo'        => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Replace logo if new uploaded
        if ($request->hasFile('logo')) {
            if ($company->logo && file_exists(public_path($company->logo))) {
                unlink(public_path($company->logo));
            }

            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('logos'), $filename);
            $company->logo = 'logos/' . $filename;
        }

        $company->update($request->only([
            'name', 'industry', 'location', 'description', 'website'
        ]));

        return response()->json($company);
    }

    // Delete company (owner only)
    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        if (Auth::id() !== $company->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($company->logo && file_exists(public_path($company->logo))) {
            unlink(public_path($company->logo));
        }

        $company->delete();

        return response()->json(['message' => 'Company info with its logo deleted successfully']);
    }
}