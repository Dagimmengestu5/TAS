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

        // Filter by tags (searching in comma-separated string)
        if ($request->has('tag') && $request->tag !== 'all') {
            $query->where('tags', 'LIKE', '%' . $request->tag . '%');
        }

        // Filter by category (falling back to requisition)
        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('requisition', fn($q) => $q->where('category', $request->category));
        }

        // Filter by location (overriding requisition)
        if ($request->has('location') && $request->location !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('location', $request->location)
                  ->orWhere(function($sq) use ($request) {
                      $sq->whereNull('location')
                         ->whereHas('requisition', fn($rq) => $rq->where('location', $request->location));
                  });
            });
        }

        // Filter by employment type (overriding requisition)
        if ($request->has('employment_type') && $request->employment_type !== 'all') {
            $query->where(function($q) use ($request) {
                $q->where('employment_type', $request->employment_type)
                  ->orWhere(function($sq) use ($request) {
                      $sq->whereNull('employment_type')
                         ->whereHas('requisition', fn($rq) => $rq->where('employment_type', $request->employment_type));
                  });
            });
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
            'job_requisition_id' => 'required|exists:job_requisitions,id',
            'title'              => 'required|string',
            'description'        => 'required|string',
            'is_internal'        => 'boolean',
            'is_external'        => 'boolean',
            'deadline'           => 'nullable|date',
            'tags'               => 'nullable|string',
            'location'           => 'nullable|string',
            'employment_type'    => 'nullable|string',
        ]);

        $requisition = \App\Models\JobRequisition::findOrFail($request->job_requisition_id);

        if ($requisition->status !== 'approved') {
            return response()->json(['message' => 'Cannot post job for unapproved requisition.'], 403);
        }

        $posting = JobPosting::updateOrCreate(
            ['job_requisition_id' => $requisition->id],
            [
                'title'              => $request->title,
                'description'        => $request->description,
                'tags'               => $request->tags,
                'location'           => $request->location,
                'employment_type'    => $request->employment_type,
                'is_internal'        => $request->is_internal ?? false,
                'is_external'        => $request->is_external ?? false,
                'deadline'           => $request->deadline,
                'status'             => 'active',
            ]
        );

        return response()->json($posting->load('requisition'), 201);
    }

    public function approve(Request $request, JobPosting $job)
    {
        if ($request->user()->role_id != 3 && $request->user()->role_id != 1) { // HR Approver or Admin
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($job->status !== 'pending_hr') {
            return response()->json(['message' => 'Invalid job status for approval'], 400);
        }

        $job->update(['status' => 'active']);

        return response()->json($job->load('requisition'));
    }

    public function reject(Request $request, JobPosting $job)
    {
        if ($request->user()->role_id != 3 && $request->user()->role_id != 1) { // HR Approver or Admin
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($job->status !== 'pending_hr') {
            return response()->json(['message' => 'Invalid job status for rejection'], 400);
        }

        $job->update(['status' => 'rejected']);

        return response()->json($job->load('requisition'));
    }

    public function show(JobPosting $job)
    {
        return response()->json($job->load('requisition'));
    }

    public function all(Request $request)
    {
        $user = $request->user();
        $query = JobPosting::with('requisition');

        // TA (5), HR (3), and Admin (1) can see pending/rejected ones
        if (in_array($user->role_id, [1, 3, 5])) {
            // all statuses
        } else {
            // Others (including CEO/6) only see active
            $query->where('status', 'active');
        }

        return response()->json($query->latest()->get());
    }

    public function update(Request $request, JobPosting $job)
    {
        $request->validate([
            'title'              => 'required|string',
            'description'        => 'required|string',
            'is_internal'        => 'boolean',
            'is_external'        => 'boolean',
            'deadline'           => 'nullable|date',
            'tags'               => 'nullable|string',
            'location'           => 'nullable|string',
            'employment_type'    => 'nullable|string',
        ]);

        $job->update([
            'title'           => $request->title,
            'description'     => $request->description,
            'tags'            => $request->tags,
            'location'        => $request->location,
            'employment_type' => $request->employment_type,
            'is_internal'     => $request->is_internal,
            'is_external'     => $request->is_external,
            'deadline'        => $request->deadline,
        ]);

        return response()->json($job->load('requisition'));
    }

    public function destroy(JobPosting $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job posting deleted successfully']);
    }
}
