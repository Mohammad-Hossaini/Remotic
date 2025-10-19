<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        // Employer user that has company
        User::create([
            'name' => 'Employer',
            'email' => 'employer@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'employer',
        ]);

        // employer that does not have company
        User::create([
            'name' => 'Employer2',
            'email' => 'employer2@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'employer',
        ]);

        // Job Seeker user
         User::create([
            'name' => 'Job Seeker ',
            'email' => 'jobseeker@gmail.com',
            'password' => Hash::make('12345678'),
            'role' => 'job_seeker',
        ]);
    }
}
