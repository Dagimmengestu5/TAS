<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRequisition;
use Illuminate\Http\Request;
use App\Notifications\RequisitionPendingCEO;
use App\Notifications\RequisitionHRApproved;
use App\Notifications\RequisitionApproved;
use App\Notifications\RequisitionReadyForPosting;
use App\Models\User;
use App\Notifications\RequisitionRejected;
use Illuminate\Support\Facades\Notification;

class ApprovalDashboardController extends Controller
{
    // --- HR APPROVER ENDPOINTS ---

    public function getHrRequisitions(Request $request)
    {
        // Return requisitions pending HR approval AND those already processed
        // Prioritize 'pending_hr' status, then sort by newest first
        $user = $request->user();
        $query = JobRequisition::with(['user', 'company', 'department', 'jobPosting'])
            ->whereIn('status', ['pending_hr', 'pending_ceo', 'approved', 'rejected', 'closed']);

        if ($user->role_id !== 1) { // Not Admin
            $query->where('company_id', $user->company_id);
        }

        $requisitions = $query->orderByRaw("CASE WHEN status = 'pending_hr' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requisitions);
    }

    public function approveHrRequisition(Request $request, $id)
    {
        $requisition = JobRequisition::findOrFail($id);

        if ($requisition->status !== 'pending_hr') {
            return response()->json(['message' => 'Requisition is not pending HR approval'], 400);
        }

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
            \Log::warning('Hiring Manager notification failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Approved successfully by HR', 'requisition' => $requisition]);
    }

    public function rejectHrRequisition(Request $request, $id)
    {
        $requisition = JobRequisition::findOrFail($id);

        if ($requisition->status !== 'pending_hr') {
            return response()->json(['message' => 'Requisition is not pending HR approval'], 400);
        }

        $requisition->update([
            'status' => 'rejected',
            'budget_status' => 'rejected'
        ]);

        // Notify Hiring Manager about rejection
        try {
            if ($requisition->user) {
                $requisition->user->notify(new RequisitionRejected($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('Hiring Manager rejection notification failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Rejected successfully by HR', 'requisition' => $requisition]);
    }

    // --- CEO APPROVER ENDPOINTS ---

    public function getCeoRequisitions(Request $request)
    {
        // Return requisitions pending CEO approval AND those already processed
        // Prioritize 'pending_ceo' status, then sort by newest first
        $user = $request->user();
        $query = JobRequisition::with(['user', 'company', 'department', 'jobPosting'])
            ->whereIn('status', ['pending_ceo', 'approved', 'rejected', 'closed']);

        if ($user->role_id !== 1) { // Not Admin
            $query->where('company_id', $user->company_id);
        }

        $requisitions = $query->orderByRaw("CASE WHEN status = 'pending_ceo' THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requisitions);
    }

    public function approveCeoRequisition(Request $request, $id)
    {
        $requisition = JobRequisition::findOrFail($id);

        if ($requisition->status !== 'pending_ceo') {
            return response()->json(['message' => 'Requisition is not pending CEO approval'], 400);
        }

        $requisition->update([
            'status' => 'approved' // Fully approved
        ]);

        // Notify Hiring Manager
        try {
            if ($requisition->user) {
                $requisition->user->notify(new RequisitionApproved($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('Hiring Manager notification failed (non-fatal): ' . $e->getMessage());
        }

        // Notify TA Team (role_id 5) within the SAME company
        try {
            $taTeam = User::where('role_id', 5)
                ->where('company_id', $requisition->company_id)
                ->get();
            if ($taTeam->count() > 0) {
                Notification::send($taTeam, new RequisitionReadyForPosting($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('TA notification failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Approved successfully by CEO', 'requisition' => $requisition]);
    }

    public function rejectCeoRequisition(Request $request, $id)
    {
        $requisition = JobRequisition::findOrFail($id);

        if ($requisition->status !== 'pending_ceo') {
            return response()->json(['message' => 'Requisition is not pending CEO approval'], 400);
        }

        $requisition->update([
            'status' => 'rejected'
        ]);

        // Notify Hiring Manager about rejection
        try {
            if ($requisition->user) {
                $requisition->user->notify(new RequisitionRejected($requisition));
            }
        } catch (\Exception $e) {
            \Log::warning('Hiring Manager rejection notification failed (non-fatal): ' . $e->getMessage());
        }

        return response()->json(['message' => 'Rejected successfully by CEO', 'requisition' => $requisition]);
    }
}
