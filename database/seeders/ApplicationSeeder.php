<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jobs = \App\Models\JobPosting::all();
        
        if ($jobs->isEmpty()) return;

        $candidates = [
            ['name' => 'Abebe Bikila', 'email' => 'abebe@example.com', 'bg' => 'Experienced runner with a passion for software engineering.'],
            ['name' => 'Hanan Mohammed', 'email' => 'hanan@example.com', 'bg' => 'Medical professional with 3 years of clinical experience.'],
            ['name' => 'Daniel Tsegaye', 'email' => 'daniel@example.com', 'bg' => 'Senior designer specialized in mobile app ecosystems.'],
        ];

        foreach ($candidates as $cData) {
            $candidate = \App\Models\Candidate::create([
                'name' => $cData['name'],
                'email' => $cData['email'],
                'professional_background' => $cData['bg'],
                'years_of_experience' => rand(1, 10),
            ]);

            // Randomly apply to a job
            \App\Models\Application::create([
                'job_posting_id' => $jobs->random()->id,
                'candidate_id' => $candidate->id,
                'status' => 'submitted',
            ]);
        }
    }
}
