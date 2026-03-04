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
            'work_experience' => 'nullable|array',
            'qualifications' => 'nullable|array',
            'certifications' => 'nullable|array',
            'languages' => 'nullable|array',
            'skills' => 'nullable|array',
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
                'work_experience' => $request->work_experience,
                'qualifications' => $request->qualifications,
                'certifications' => $request->certifications,
                'languages' => $request->languages,
                'skills' => $request->skills,
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
        $eduStr = strtolower($request->institution_name ?? '');
        $candidateContext = $profBgStr . ' ' . $eduStr;

        $job->loadMissing('requisition.department');
        $jobTitleStr = strtolower($job->title ?? $job->requisition->title ?? '');
        $jobCategory = strtolower($job->requisition->category ?? '');
        $deptStr = strtolower($job->requisition->department->name ?? '');
        $jobContext = $jobTitleStr . ' ' . $jobCategory . ' ' . $deptStr;

        // Define Detailed Category Keywords Dictionary
        $categoryKeywords = [
            'information technology (it)' => ['computer', 'science', 'developer', 'software', 'engineering', 'programmer', 'coder', 'system', 'network', 'data', 'web', 'mobile', 'frontend', 'backend', 'fullstack', 'security', 'it', 'tech', 'computing'],
            'pharmaceutical & healthcare' => ['pharmacy', 'nursing', 'doctor', 'medical', 'healthcare', 'clinical', 'surgeon', 'dentist', 'physician', 'nurse', 'pharmacist', 'hospital'],
            'pharmacy & clinical operations' => ['pharmacy', 'clinical', 'drug', 'medicine', 'dispensing', 'healthcare', 'pharmacist', 'lab', 'laboratory'],
            'finance & accounting' => ['accounting', 'accountant', 'finance', 'financial', 'audit', 'auditor', 'tax', 'banking', 'economics', 'commerce', 'cpa', 'acca'],
            'human resources (hr)' => ['human resources', 'hr', 'recruitment', 'training', 'payroll', 'personnel', 'hiring', 'talent'],
            'logistics & supply chain' => ['logistics', 'supply chain', 'warehouse', 'distribution', 'inventory', 'transport', 'shipping', 'procurement', 'fleet'],
            'sales & marketing' => ['sales', 'marketing', 'branding', 'promotion', 'advertisement', 'customer relation', 'merchandising'],
            'engineering & maintenance' => ['engineering', 'mechanic', 'electrical', 'civil', 'maintenance', 'technician', 'industrial'],
            'quality assurance & control' => ['quality', 'qa', 'qc', 'standards', 'inspection', 'testing', 'compliance'],
            'administrative & management' => ['management', 'administration', 'admin', 'secretary', 'office', 'coordinator', 'executive'],
            'customer service & front office' => ['customer service', 'front office', 'reception', 'support', 'helpdesk', 'client'],
        ];

        // 1. Identify the target keywords for the job's category
        $targetKeywords = [];
        foreach ($categoryKeywords as $cat => $keywords) {
            if (str_contains($jobCategory, $cat) || str_contains(strtolower($cat), $jobCategory)) {
                $targetKeywords = array_merge($targetKeywords, $keywords);
            }
        }

        // If no category match, fall back to general job context words
        if (empty($targetKeywords)) {
            preg_match_all('/\b\w{2,}\b/', $jobContext, $jobMatches);
            $targetKeywords = array_unique($jobMatches[0]);
        }

        // 2. Check for intersection with candidate's context
        preg_match_all('/\b\w{2,}\b/', $candidateContext, $candMatches);
        $candidateWords = array_unique($candMatches[0]);

        $hasIntersection = false;
        if (count($candidateWords) > 0 && count($targetKeywords) > 0) {
            $intersection = array_intersect($candidateWords, $targetKeywords);
            if (count($intersection) > 0) {
                $hasIntersection = true;
            }
        }

        // 3. Routing Logic: If candidate provided info but zero overlap with category/job, auto-pool
        if (!empty(trim($candidateContext)) && !$hasIntersection) {
            $initialStatus = 'pooled';
            $initialFeedback = 'Auto-routed to Candidate Pool: Background/Education does not match job category (' . ($job->requisition->category ?? 'Unknown') . ').';
            \Illuminate\Support\Facades\Log::info('Candidate auto-pooled', [
                'candidate_id' => $candidate->id, 
                'job_id' => $job->id, 
                'candidate_context' => $candidateContext,
                'category' => $jobCategory
            ]);
        }


        $application = Application::create([
            'job_posting_id' => $job->id,
            'candidate_id' => $candidate->id,
            'status' => $initialStatus,
            'description' => $request->description,
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

    public function submitOfferComment(Request $request, Application $application)
    {
        $request->validate([
            'comment' => 'required|string|max:2000',
        ]);

        $candidate = $application->candidate;
        $jobTitle = $application->jobPosting?->requisition?->title ?? 'Position';

        // Notify all TA team users
        $taUsers = \App\Models\User::whereHas('role', fn($q) => $q->whereIn('name', ['ta_team', 'admin']))->get();
        foreach ($taUsers as $taUser) {
            $taUser->notify(new \App\Notifications\OfferComment(
                $request->comment,
                $candidate->name,
                $jobTitle,
                $application->id
            ));
        }

        return response()->json(['message' => 'Comment sent to TA team successfully.']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $scope = $request->query('scope');

        // If specific scope is 'self', only show user's own applications
        if ($scope === 'self' || ($user->role && $user->role->name === 'candidate')) {
            $candidate = Candidate::where('user_id', $user->id)
                ->orWhere('email', $user->email)
                ->first();

            if (!$candidate) return response()->json([]);

            // Auto-link if found by email but user_id is missing
            if (!$candidate->user_id) {
                $candidate->update(['user_id' => $user->id]);
            }
            return response()->json(Application::with(['jobPosting.requisition', 'histories' => function($q) {
                $q->latest();
            }])
            ->withCount(['messages as unread_messages_count' => function($q) use ($user) {
                $q->where('is_read', false)->where('user_id', '!=', $user->id);
            }])
            ->where('candidate_id', $candidate->id)->get());
        }

        // Admin and CEO approver can see all applications
        $globalRoles = ['admin', 'ceo_approver'];
        if ($user->role && in_array($user->role->name, $globalRoles)) {
            return response()->json(Application::with(['jobPosting.requisition', 'candidate', 'histories' => function($q) {
                $q->with('user')->latest();
            }])
            ->withCount(['messages as unread_messages_count' => function($q) use ($user) {
                $q->where('is_read', false)->where('user_id', '!=', $user->id);
            }])
            ->get());
        }

        // TA Team and others: scope by their own company's job postings
        $companyId = $user->company_id;
        if (!$companyId) {
            // If no company assigned, return empty to be safe
            return response()->json([]);
        }

        return response()->json(
            Application::with(['jobPosting.requisition', 'candidate', 'histories' => function($q) {
                $q->with('user')->latest();
            }])
            ->withCount(['messages as unread_messages_count' => function($q) use ($user) {
                $q->where('is_read', false)->where('user_id', '!=', $user->id);
            }])
            ->whereHas('jobPosting.requisition', function($q) use ($companyId) {
                $q->where('company_id', $companyId);
            })
            ->get()
        );
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
