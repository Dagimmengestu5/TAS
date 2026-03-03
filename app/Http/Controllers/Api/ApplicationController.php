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

        // Check for existing application
        $existingApplication = Application::where('job_posting_id', $job->id)
                                          ->where('candidate_id', $candidate->id)
                                          ->exists();

        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this position.',
            ], 422);
        }

        // Calculate Intersection Logic for Auto-Pooling
        $initialStatus = 'submitted';
        $initialFeedback = 'Initial application synchronization.';

        $profBgStr = strtolower($request->professional_background ?? '');
        $job->loadMissing('requisition.department');
        
        $jobTitleStr = strtolower($job->title ?? $job->requisition->title ?? '');
        $jobTagsStr = strtolower($job->tags ?? $job->requisition->category ?? '');
        $deptStr = strtolower($job->requisition->department->name ?? '');

        // Extract words longer than 2 characters from candidate background
        preg_match_all('/\b\w{2,}\b/', $profBgStr, $bgMatches);
        $candidateWords = array_unique($bgMatches[0]);

        // Define Category Keywords Dictionary
        $categoryKeywords = [
            'it' => ['computer', 'science', 'developer', 'software', 'engineering', 'programmer', 'coder', 'system', 'network', 'data', 'web', 'mobile', 'frontend', 'backend', 'fullstack', 'security', 'tech'],
            'tech' => ['computer', 'science', 'developer', 'software', 'engineering', 'programmer', 'coder', 'system', 'network', 'data', 'web', 'mobile', 'frontend', 'backend', 'fullstack', 'security', 'tech'],
            'health' => ['pharmacy', 'nursing', 'doctor', 'medical', 'healthcare', 'clinical', 'surgeon', 'dentist', 'physician', 'nurse', 'pharmacist', 'lab'],
            'medical' => ['pharmacy', 'nursing', 'doctor', 'medical', 'healthcare', 'clinical', 'surgeon', 'dentist', 'physician', 'nurse', 'pharmacist', 'lab'],
            'operations' => ['management', 'administration', 'hr', 'finance', 'business', 'logistics', 'supply', 'coordinator'],
            'admin' => ['management', 'administration', 'hr', 'finance', 'business', 'logistics', 'supply', 'coordinator'],
        ];

        // Combine all job-related text and extract words
        $allJobText = strtolower($jobTitleStr . ' ' . $jobTagsStr . ' ' . $deptStr);
        
        // Find relevant category from job context
        $matchedCategoryKeywords = [];
        foreach ($categoryKeywords as $cat => $keywords) {
            if (str_contains($allJobText, $cat)) {
                $matchedCategoryKeywords = array_merge($matchedCategoryKeywords, $keywords);
            }
        }

        preg_match_all('/\b\w{2,}\b/', $allJobText, $jobMatches);
        $jobWords = array_unique(array_merge($jobMatches[0], $matchedCategoryKeywords));

        // Check for any intersection
        $hasIntersection = false;
        if (count($candidateWords) > 0 && count($jobWords) > 0) {
            $intersection = array_intersect($candidateWords, $jobWords);
            if (count($intersection) > 0) {
                $hasIntersection = true;
            }
        }

        // If candidate provided background but it has zero overlap with job context, auto-pool them
        if (!empty($profBgStr) && !$hasIntersection) {
            $initialStatus = 'pooled';
            $initialFeedback = 'Auto-routed to Candidate Pool due to professional background mismatch.';
            \Illuminate\Support\Facades\Log::info('Candidate auto-pooled', ['candidate_id' => $candidate->id, 'job_id' => $job->id, 'bg' => $profBgStr, 'job_context' => $allJobText]);
        }


        $application = Application::create([
            'job_posting_id' => $job->id,
            'candidate_id' => $candidate->id,
            'status' => $initialStatus,
        ]);

        // Record initial status history
        $application->histories()->create([
            'status' => $initialStatus,
            'feedback' => $initialFeedback,
            'user_id' => $request->user()->id
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
        $scope = $request->query('scope');

        // If specific scope is 'self', only show user's own applications
        if ($scope === 'self' || ($user->role && $user->role->name === 'candidate')) {
            $candidate = Candidate::where('user_id', $user->id)->first();
            if (!$candidate) return response()->json([]);
            return response()->json(Application::with(['jobPosting.requisition', 'histories' => function($q) {
                $q->latest();
            }])->where('candidate_id', $candidate->id)->get());
        }

        // Otherwise (Admin/TA), show all applications
        return response()->json(Application::with(['jobPosting.requisition', 'candidate', 'histories' => function($q) {
            $q->with('user')->latest();
        }])->get());
    }

    public function updateStatus(Request $request, Application $application)
    {
        $request->validate([
            'status' => 'required|string|in:submitted,written_test,interview_1,interview_2,offer,rejected,hired,pooled',
            'feedback' => 'nullable|string',
            'offer_document' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
        ]);

        $application->update([
            'status' => $request->status,
            'feedback' => $request->feedback ?? $application->feedback,
        ]);

        $documentPath = null;
        if ($request->status === 'offer' && $request->hasFile('offer_document')) {
            $documentPath = $request->file('offer_document')->store('offers', 'public');
        }

        // Record status change history
        $application->histories()->create([
            'status' => $request->status,
            'feedback' => $request->feedback ?? 'Status synchronized to ' . $request->status,
            'user_id' => $request->user()->id,
            'document_path' => $documentPath,
        ]);

        // Ensure all data is eager loaded for the notification
        $application->load(['candidate', 'jobPosting.requisition']);

        \Illuminate\Support\Facades\Log::info('Dispatching ApplicationStatusUpdated notification', [
            'application_id' => $application->id,
            'candidate_email' => $application->candidate->email,
            'status' => $request->status
        ]);

        // Send notification for every status change
        $application->candidate->notify(new \App\Notifications\ApplicationStatusUpdated($application, $request->feedback, $documentPath));

        return response()->json($application->load(['histories' => function($q) {
            $q->with('user')->latest();
        }]));
    }
}
