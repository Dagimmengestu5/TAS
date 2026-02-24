<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobRequisition;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index(Request $request)
    {
        $query = JobPosting::with('requisition')->where('status', 'active');

        if ($request->has('type') && $request->type !== 'all') {
            if ($request->type === 'internal') {
                $query->where('is_internal', true);
            } elseif ($request->type === 'external') {
                $query->where('is_external', true);
            }
        }

        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('requisition', fn($q) => $q->where('category', $request->category));
        }

        // Filter by location
        if ($request->has('location') && $request->location !== 'all') {
            $query->whereHas('requisition', fn($q) => $q->where('location', $request->location));
        }

        // Filter by employment type
        if ($request->has('employment_type') && $request->employment_type !== 'all') {
            $query->whereHas('requisition', fn($q) => $q->where('employment_type', $request->employment_type));
        }

        // Filter by time posted
        if ($request->has('posted_time') && $request->posted_time !== 'all') {
            $date = match($request->posted_time) {
                'today'     => now()->subDay(),
                'last_week' => now()->subWeek(),
                'last_month'=> now()->subMonth(),
                default     => null,
            };
            if ($date) {
                $query->where('created_at', '>=', $date);
            }
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'           => 'required|string',
            'description'     => 'required|string',
            'department'      => 'required|string',
            'category'        => 'nullable|string',
            'location'        => 'nullable|string',
            'employment_type' => 'nullable|string',
            'is_internal'     => 'boolean',
            'is_external'     => 'boolean',
            'deadline'        => 'nullable|date',
        ]);

        $requisition = JobRequisition::create([
            'title'           => $request->title,
            'description'     => $request->description,
            'department'      => $request->department,
            'category'        => $request->category,
            'location'        => $request->location,
            'employment_type' => $request->employment_type,
            'user_id'         => $request->user()->id,
            'status'          => 'approved',
        ]);

        $posting = JobPosting::create([
            'job_requisition_id' => $requisition->id,
            'is_internal'        => $request->is_internal ?? false,
            'is_external'        => $request->is_external ?? false,
            'deadline'           => $request->deadline,
            'status'             => 'active',
        ]);

        return response()->json($posting->load('requisition'), 201);
    }

    public function show(JobPosting $job)
    {
        return response()->json($job->load('requisition'));
    }
}
