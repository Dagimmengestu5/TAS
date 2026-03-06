<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobPosting;
use App\Models\JobRequisition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getRecruitmentMetrics()
    {
        $totalApps = Application::count();
        $hiredCount = Application::where('status', 'hired')->count();
        $activePostings = JobPosting::where('status', 'posted')->count();

        // Source effectiveness
        $sourceStats = [
            'internal' => Application::whereHas('jobPosting', fn($q) => $q->where('is_internal', true))->count(),
            'external' => Application::whereHas('jobPosting', fn($q) => $q->where('is_external', true))->count(),
        ];

        // Status breakdown
        $statusBreakdown = Application::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        return response()->json([
            'total_applications' => $totalApps,
            'hired_count' => $hiredCount,
            'active_postings' => $activePostings,
            'source_stats' => $sourceStats,
            'status_breakdown' => $statusBreakdown,
        ]);
    }

    public function getTAReport(Request $request)
    {
        $user = auth()->user();

        $query = JobRequisition::with([
            'user', // Hiring Manager
            'jobPosting.applications.candidate',
            'jobPosting.applications.histories'
        ]);

        // Filter by company if not admin
        if ($user && $user->role && $user->role->name !== 'admin' && $user->company_id) {
            $query->where('company_id', $user->company_id);
        }

        // Filter by job title
        if ($request->has('job_title') && $request->job_title !== 'all') {
            $query->where('title', 'like', '%' . $request->job_title . '%');
        }

        // Filter by date range (submission date -> requisition created_at)
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $requisitions = $query->get();

        $reportData = $requisitions->flatMap(function ($req) {
            $jobPosting = $req->jobPosting;
            $applications = $jobPosting ? $jobPosting->applications : collect();
            
            $totalSubmitted = $applications->count();
            
            $hiredCandidates = $applications->filter(function ($app) {
                return $app->status === 'hired';
            });

            $ceoApprovalDate = ($req->status === 'approved' || $jobPosting) ? $req->updated_at : null;

            $baseData = [
                'id' => $req->id,
                'job_title' => $req->title,
                'hiring_manager' => $req->user->name ?? 'Unknown',
                'ceo_approval_date' => $ceoApprovalDate ? $ceoApprovalDate->toDateTimeString() : null,
                'posted_date' => $jobPosting ? $jobPosting->created_at->toDateTimeString() : null,
                'requisition_date' => $req->created_at->toDateTimeString(),
                'total_submitted' => $totalSubmitted,
                'status' => $req->status,
            ];

            if ($hiredCandidates->isEmpty()) {
                return [array_merge($baseData, [
                    'final_hired' => null,
                    'avg_tth' => null,
                ])];
            }

            return $hiredCandidates->map(function ($hiredApp) use ($baseData, $ceoApprovalDate) {
                $hiredHistory = $hiredApp->histories->where('status', 'hired')->first();
                $tth = null;
                
                if ($hiredHistory && $ceoApprovalDate) {
                    $tth = ceil($hiredHistory->created_at->diffInDays($ceoApprovalDate));
                } elseif ($hiredHistory) {
                    $tth = ceil($hiredHistory->created_at->diffInDays($hiredApp->created_at));
                }

                return array_merge($baseData, [
                    'id' => $baseData['id'] . '-' . $hiredApp->id,
                    'final_hired' => $hiredApp->candidate->name ?? 'Unknown',
                    'avg_tth' => $tth !== null ? abs($tth) : null,
                ]);
            });
        });

        return response()->json($reportData->values());
    }
}
