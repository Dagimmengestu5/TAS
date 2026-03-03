<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRequisition;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Notifications\RequisitionApproved;
use App\Notifications\RequisitionPendingCEO;
use App\Notifications\RequisitionPendingHR;
use App\Notifications\RequisitionHRApproved;
use Illuminate\Support\Facades\Notification;
use App\Models\User;
use App\Notifications\RequisitionRejected;
use App\Notifications\RequisitionReadyForPosting;
use App\Notifications\RequisitionCreated;

class RequisitionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = JobRequisition::with(['user', 'company', 'department', 'jobPosting']);

        \Log::info('Requisition index call', [
            'user_id' => $user->id,
            'role_id' => $user->role_id,
        ]);

        if ($user->role_id == 2) { // Hiring Manager
            $query->where('user_id', $user->id);
        } elseif (in_array($user->role_id, [3, 5, 6])) { // HR, TA, CEO
            $query->where('company_id', $user->company_id);
        } elseif ($user->role_id == 1) { // Admin
            // Admin has global access
        } else {
            return response()->json([], 403);
        }

        $results = $query->latest()->get()->map(function ($requisition) {
            $totalApplications = 0;
            $interviewCount = 0;

            if ($requisition->jobPosting) {
                $totalApplications = $requisition->jobPosting->applications()->count();
                $interviewCount = $requisition->jobPosting->applications()
                    ->whereIn('status', ['interview_1', 'interview_2'])
                    ->count();
            }

            $requisition->total_applications = $totalApplications;
            $requisition->interview_count = $interviewCount;
            return $requisition;
        });

        return response()->json($results);
    }

    // NEW EXPLICIT ENDPOINTS FOR EXACT DATA
    public function hrRequisitions(Request $request)
    {
        $requisitions = JobRequisition::with(['user', 'company', 'department'])
                            ->whereIn('status', ['pending_hr', 'pending_ceo', 'approved', 'rejected'])
                            ->orderBy('created_at', 'desc')
                            ->get();
        return response()->json($requisitions);
    }

    public function ceoRequisitions(Request $request)
    {
        $requisitions = JobRequisition::with(['user', 'company', 'department'])
                            ->whereIn('status', ['pending_ceo', 'approved', 'rejected'])
                            ->orderBy('created_at', 'desc')
                            ->get();
        return response()->json($requisitions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'company_id' => 'required|exists:companies,id',
            'department_id' => 'required|exists:departments,id',
            'category' => 'nullable|string',
            'location' => 'nullable|string',
            'employment_type' => 'nullable|string',
            'jd' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // JD file
        ]);

        $jdPath = null;
        if ($request->hasFile('jd')) {
            $jdPath = $request->file('jd')->store('jds', 'public');
        }

        $requisition = JobRequisition::create([
            'title' => $request->title,
            'description' => $request->description,
            'company_id' => $request->company_id,
            'department_id' => $request->department_id,
            'category' => $request->category,
            'location' => $request->location,
            'employment_type' => $request->employment_type,
            'user_id' => $request->user()->id,
            'status' => 'pending_hr',
            'budget_status' => 'pending',
            'jd_path' => $jdPath,
        ]);

        // Notify HR Approver(s) within the SAME company
        try {
            $hrApprovers = User::where('role_id', 3)
                ->where('company_id', $requisition->company_id)
                ->get();
            if ($hrApprovers->count() > 0) {
                Notification::send($hrApprovers, new RequisitionPendingHR($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('HR notification failed (non-fatal): ' . $e->getMessage());
        }

        // Notify TA Team (role_id 5) within the SAME company about NEW requisition
        try {
            $taTeam = User::where('role_id', 5)
                ->where('company_id', $requisition->company_id)
                ->get();
            if ($taTeam->count() > 0) {
                Notification::send($taTeam, new RequisitionCreated($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('TA creation notification failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json($requisition, 201);
    }

    public function approve(Request $request, JobRequisition $requisition)
    {
        $user = $request->user();

        $isHR = $user->role_id == 3;
        $isCEO = $user->role_id == 6;

        if ($isHR && $requisition->status === 'pending_hr') { // HR Approves budget
            $requisition->update([
                'status' => 'pending_ceo',
                'budget_status' => 'approved'
            ]);

            // Notify CEO(s) within the SAME company
            try {
                $ceos = User::where('role_id', 6)
                    ->where('company_id', $requisition->company_id)
                    ->get();
                if ($ceos->count() > 0) {
                    Notification::send($ceos, new RequisitionPendingCEO($requisition));
                }
            } catch (\Exception $e) {
                \Log::warning('CEO notification failed (non-fatal): ' . $e->getMessage());
            }

            // Notify Hiring Manager
            try {
                if ($requisition->user) {
                    $requisition->user->notify(new RequisitionHRApproved($requisition));
                }
            } catch (\Exception $e) {
                \Log::warning('HM HR-approved notification failed (non-fatal): ' . $e->getMessage());
            }

        } elseif ($isCEO && $requisition->status === 'pending_ceo') { // CEO final authorization
            $requisition->update([
                'status' => 'approved'
            ]);

            // Notify Hiring Manager
            try {
                if ($requisition->user) {
                    $requisition->user->notify(new RequisitionApproved($requisition));
                }
            } catch (\Exception $e) {
                \Log::warning('Final approval notification failed (non-fatal): ' . $e->getMessage());
            }

            // Notify TA Team (role_id 5) within the SAME company
            try {
                $taTeam = User::where('role_id', 5)
                    ->where('company_id', $requisition->company_id)
                    ->get();
                if ($taTeam->count() > 0) {
                    \Illuminate\Support\Facades\Notification::send($taTeam, new RequisitionReadyForPosting($requisition));
                }
            } catch (\Exception $e) {
                \Log::warning('TA notification failed (non-fatal): ' . $e->getMessage());
            }
        } else {
            return response()->json(['message' => 'Unauthorized or invalid status transition'], 403);
        }

        return response()->json($requisition);
    }

    public function reject(Request $request, JobRequisition $requisition)
    {
        $user = $request->user();

        if (($user->role_id == 3 && $requisition->status === 'pending_hr') ||
            ($user->role_id == 6 && $requisition->status === 'pending_ceo')) {
            $requisition->update(['status' => 'rejected']);

            // Notify Hiring Manager about rejection
            try {
                if ($requisition->user) {
                    $requisition->user->notify(new RequisitionRejected($requisition));
                }
            } catch (\Exception $e) {
                \Log::warning('Rejection notification failed (non-fatal): ' . $e->getMessage());
            }
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($requisition);
    }

    public function update(Request $request, JobRequisition $requisition)
    {
        $user = $request->user();

        // Only the owning hiring manager can edit, and only before HR has acted
        if ($requisition->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($requisition->status !== 'pending_hr') {
            return response()->json(['message' => 'Requisition is locked — HR has already acted on it.'], 403);
        }

        $request->validate([
            'title'           => 'required|string',
            'description'     => 'required|string',
            'company_id'      => 'required|exists:companies,id',
            'department_id'   => 'required|exists:departments,id',
            'category'        => 'nullable|string',
            'location'        => 'nullable|string',
            'employment_type' => 'nullable|string',
            'jd'              => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $jdPath = $requisition->jd_path; // Keep existing file unless replaced
        if ($request->hasFile('jd')) {
            // Delete old file if it exists
            if ($jdPath) {
                Storage::disk('public')->delete($jdPath);
            }
            $jdPath = $request->file('jd')->store('jds', 'public');
        }

        $requisition->update([
            'title'           => $request->title,
            'description'     => $request->description,
            'company_id'      => $request->company_id,
            'department_id'   => $request->department_id,
            'category'        => $request->category,
            'location'        => $request->location,
            'employment_type' => $request->employment_type,
            'jd_path'         => $jdPath,
        ]);

        return response()->json($requisition->load(['user', 'company', 'department']));
    }

    public function destroy(Request $request, JobRequisition $requisition)
    {
        $user = $request->user();

        // Only the owning hiring manager can delete, and only before HR has acted
        if ($requisition->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($requisition->status !== 'pending_hr') {
            return response()->json(['message' => 'Requisition is locked — HR has already acted on it.'], 403);
        }

        // Delete JD file if present
        if ($requisition->jd_path) {
            Storage::disk('public')->delete($requisition->jd_path);
        }

        $requisition->delete();

        return response()->json(['message' => 'Requisition deleted.']);
    }
}
