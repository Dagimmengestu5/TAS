<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = \App\Models\User::where('email', 'admin@drogasms.com')->first();
        
        $jobs = [
            [
                'title' => 'Senior Laravel Developer',
                'description' => "We are looking for an expert Laravel developer to lead our backend team.\n\nRequirements:\n- 5+ years of experience with PHP and Laravel\n- Strong knowledge of MySQL and Redis\n- Experience with AWS and Docker",
                'department' => 'IT & Digital Transformation',
                'is_internal' => false,
                'is_external' => true,
            ],
            [
                'title' => 'Product Designer (UI/UX)',
                'description' => "Join our creative team to design world-class user interfaces for our health-tech products.",
                'department' => 'Product & Design',
                'is_internal' => true,
                'is_external' => true,
            ],
            [
                'title' => 'Medical Sales Representative',
                'description' => "Droga Pharma is looking for energetic sales professionals to expand our reach in the East African market.",
                'department' => 'Sales & Marketing',
                'is_internal' => false,
                'is_external' => true,
            ],
            [
                'title' => 'HR Operations Specialist',
                'description' => "Manage day-to-day HR operations and streamline our recruitment processes.",
                'department' => 'Human Resources',
                'is_internal' => true,
                'is_external' => false,
            ],
        ];

        foreach ($jobs as $jobData) {
            $req = \App\Models\JobRequisition::create([
                'title' => $jobData['title'],
                'description' => $jobData['description'],
                'department' => $jobData['department'],
                'user_id' => $admin->id,
                'status' => 'approved',
                'budget_status' => 'approved',
            ]);

            \App\Models\JobPosting::create([
                'job_requisition_id' => $req->id,
                'is_internal' => $jobData['is_internal'],
                'is_external' => $jobData['is_external'],
                'deadline' => now()->addDays(30),
                'status' => 'active',
            ]);
        }
    }
}
