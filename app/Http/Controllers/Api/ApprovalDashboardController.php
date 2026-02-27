<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobRequisition;
use Illuminate\Http\Request;
use App\Notifications\RequisitionPendingCEO;
use App\Notifications\RequisitionHRApproved;
use App\Notifications\RequisitionApproved;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

class ApprovalDashboardController extends Controller
{
    // --- HR APPROVER ENDPOINTS ---

    public function getHrRequisitions(Request $request)
    {
        // Strictly return only requisitions pending HR approval
        $requisitions = JobRequisition::with(['user', 'company', 'department', 'jobPosting'])
            ->where('status', 'pending_hr')
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

        // Notify CEO(s)
        try {
            $ceos = User::where('role_id', 6)->get();
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

        return response()->json(['message' => 'Rejected successfully by HR', 'requisition' => $requisition]);
    }

    // --- CEO APPROVER ENDPOINTS ---

    public function getCeoRequisitions(Request $request)
    {
        // Strictly return only requisitions pending CEO approval
        $requisitions = JobRequisition::with(['user', 'company', 'department', 'jobPosting'])
            ->where('status', 'pending_ceo')
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

        return response()->json(['message' => 'Rejected successfully by CEO', 'requisition' => $requisition]);
    }
}
