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

        $reportData = $requisitions->map(function ($req) {
            $jobPosting = $req->jobPosting;
            $applications = $jobPosting ? $jobPosting->applications : collect();
            
            $totalSubmitted = $applications->count();
            
            $hiredCandidates = $applications->filter(function ($app) {
                return $app->status === 'hired';
            });
            
            $hiredNames = $hiredCandidates->map(function ($app) {
                return $app->candidate->name ?? 'Unknown';
            })->implode(', ');

            // Calculate average time to hire for this position if there are hires
            $avgTth = null;
            if ($hiredCandidates->isNotEmpty()) {
                $totalDays = 0;
                foreach ($hiredCandidates as $hiredApp) {
                    $hiredHistory = $hiredApp->histories->where('status', 'hired')->first();
                    if ($hiredHistory) {
                        $diff = $hiredHistory->created_at->diffInDays($hiredApp->created_at);
                        $totalDays += abs($diff);
                    }
                }
                $avgTth = ceil($totalDays / $hiredCandidates->count());
            }

            return [
                'id' => $req->id,
                'job_title' => $req->title,
                'hiring_manager' => $req->user->name ?? 'Unknown',
                'ceo_approval_date' => $req->status === 'approved' ? $req->updated_at->toDateTimeString() : null,
                'posted_date' => $jobPosting ? $jobPosting->created_at->toDateTimeString() : null,
                'requisition_date' => $req->created_at->toDateTimeString(),
                'total_submitted' => $totalSubmitted,
                'final_hired' => $hiredNames ?: null,
                'status' => $req->status,
                'avg_tth' => $avgTth,
            ];
        });

        return response()->json($reportData);
    }
}
