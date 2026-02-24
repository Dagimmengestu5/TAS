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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'age' => 'nullable|integer|min:18',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'phone' => 'nullable|string|max:20',
            'professional_background' => 'nullable|string',
            'years_of_experience' => 'nullable|integer',
            'institution_name' => 'nullable|string|max:255',
            'cgpa' => 'nullable|numeric|min:0|max:4',
            'current_address' => 'nullable|string|max:255',
            'cv' => 'nullable|file|mimes:pdf|max:10240', // PDF up to 10MB
        ]);

        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('cvs', 'public');
        }

        // Find or update candidate based on email or authenticated user
        $candidate = Candidate::updateOrCreate(
            ['email' => $request->email],
            [
                'user_id' => $request->user()->id,
                'name' => $request->name,
                'age' => $request->age,
                'gender' => $request->gender,
                'phone' => $request->phone,
                'professional_background' => $request->professional_background,
                'years_of_experience' => $request->years_of_experience,
                'institution_name' => $request->institution_name,
                'cgpa' => $request->cgpa,
                'current_address' => $request->current_address,
                'cv_path' => $cvPath ?? Candidate::where('email', $request->email)->value('cv_path'),
            ]
        );

        $application = Application::create([
            'job_posting_id' => $job->id,
            'candidate_id' => $candidate->id,
            'status' => 'submitted',
        ]);

        // Send confirmation email
        $candidate->notify(new \App\Notifications\ApplicationSubmitted($application));

        return response()->json([
            'message' => 'Application submitted successfully.',
            'application' => $application->load(['jobPosting.requisition', 'candidate'])
        ], 201);
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

        if ($request->status === 'rejected') {
            $application->candidate->notify(new \App\Notifications\ApplicationRejected($application));
        }

        return response()->json($application);
    }
}
