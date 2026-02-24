<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Candidate;
use App\Models\JobPosting;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function apply(Request $request, JobPosting $job)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'professional_background' => 'nullable|string',
            'years_of_experience' => 'integer',
        ]);

        // Find or create candidate
        $candidate = Candidate::firstOrCreate(
            ['email' => $request->email],
            [
                'user_id' => $request->user()->id,
                'name' => $request->name,
                'phone' => $request->phone,
                'professional_background' => $request->professional_background,
                'years_of_experience' => $request->years_of_experience,
            ]
        );

        $application = Application::create([
            'job_posting_id' => $job->id,
            'candidate_id' => $candidate->id,
            'status' => 'submitted',
        ]);

        return response()->json($application->load(['jobPosting.requisition', 'candidate']), 201);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        // If user is candidate, show only their applications
        if ($user->role && $user->role->name === 'candidate') {
            $candidate = Candidate::where('user_id', $user->id)->first();
            if (!$candidate) return response()->json([]);
            return response()->json(Application::with('jobPosting.requisition')->where('candidate_id', $candidate->id)->get());
        }

        // Otherwise (Admin/TA), show all applications
        return response()->json(Application::with(['jobPosting.requisition', 'candidate'])->get());
    }

    public function updateStatus(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|string|in:submitted,written_test,interview_1,interview_2,offer,rejected,hired',
            'feedback' => 'nullable|string',
        ]);

        $application->update([
            'status' => $request->status,
            'feedback' => $request->feedback ?? $application->feedback,
        ]);

        return response()->json($application);
    }
}
