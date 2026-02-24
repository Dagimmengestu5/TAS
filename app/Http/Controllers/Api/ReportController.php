<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getRecruitmentMetrics()
    {
        $totalApps = Application::count();
        $hiredCount = Application::where('status', 'hired')->count();
        $activePostings = JobPosting::where('status', 'active')->count();

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
}
