<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // public function run()
    // {
    //     // Find the seeded employer
    //     $employer = User::where('role', 'employer')->first();

    //     if ($employer) {
    //         Job::create([
    //             'user_id' => $employer->id,
    //             'title' => 'Remote PHP Developer',
    //             'description' => 'Looking for a skilled PHP/Laravel developer.',
    //             'salary' => 1200.00,
    //         ]);

    //         Job::create([
    //             'user_id' => $employer->id,
    //             'title' => 'React Frontend Developer',
    //             'description' => 'Build modern frontends with React.',
    //             'salary' => 1000.00,
    //         ]);
    //     }
    // }

    public function run(): void
    {
        $company = Company::first(); // Attach to first company for demo
        $user = User::where('role', 'employer')->first(); // Assuming jobs are posted by employers

        Job::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'title' => 'Software Engineer',
            'description' => 'We are looking for a skilled software engineer to join our dynamic team.',
            'requirements' => 'PHP, Laravel, React, MySQL, Problem-solving skills',
            'location' => 'Kabul, Afghanistan',
            'salary_min' => 400,
            'salary_max' => 800,
            'job_type' => 'full-time',
            'status' => 'open',
            'deadline' => now()->addDays(30),
        ]);

        Job::create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'title' => 'Data Analyst',
            'description' => 'Analyze data and generate insights for business growth.',
            'requirements' => 'SQL, Excel, PowerBI, Communication skills',
            'location' => 'Remote',
            'salary_min' => 300,
            'salary_max' => 600,
            'job_type' => 'remote',
            'status' => 'open',
            'deadline' => now()->addDays(20),
        ]);

        Job::create([
            'company_id' => null,
            'user_id' => 3,
            'title' => 'system Analyst',
            'description' => 'Analyze system and generate insights for business growth.',
            'requirements' => 'SQL, Excel, PowerBI, Communication skills',
            'location' => 'Remote',
            'salary_min' => 400,
            'salary_max' => 700,
            'job_type' => 'remote',
            'status' => 'open',
            'deadline' => now()->addDays(20),
        ]);
        
    }
}
