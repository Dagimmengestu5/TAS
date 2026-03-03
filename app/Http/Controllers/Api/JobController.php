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
        JobPosting::closeStatusForExpiredJobs();
        $query = JobPosting::with(['requisition.company', 'requisition.department'])->where('status', 'posted');

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
        // Filter by education level (supports partial match if job has multiple)
        if ($request->has('education_level') && $request->education_level !== 'all') {
            $query->where('education_level', 'LIKE', '%' . $request->education_level . '%');
        }

        // Filter by experience level (supports partial match if job has multiple)
        if ($request->has('experience_level') && $request->experience_level !== 'all') {
            $query->where('experience_level', 'LIKE', '%' . $request->experience_level . '%');
        }

        if ($date) {
                $query->where('created_at', '>=', $date);
            }
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'job_requisition_id' => 'nullable|exists:job_requisitions,id',
            'title'              => 'required|string',
            'description'        => 'required|string',
            'is_internal'        => 'boolean',
            'is_external'        => 'boolean',
            'deadline'           => 'nullable|date',
            'tags'               => 'nullable|string',
            'location'           => 'nullable|string',
            'employment_type'    => 'nullable|string',
            'education_level'    => 'nullable', // Can be string or array
            'experience_level'    => 'nullable', // Can be string or array
            'core_requirements'   => 'nullable', // Can be string or array
            'status'             => 'nullable|string|in:created,posted,closed',
        ]);

        if ($request->job_requisition_id) {
            $requisition = \App\Models\JobRequisition::findOrFail($request->job_requisition_id);
            if (!in_array($requisition->status, ['approved', 'approved_hr', 'pending_ceo'])) {
                return response()->json(['message' => 'Cannot post job for unapproved requisition.'], 403);
            }
        }

        $data = [
            'job_requisition_id' => $request->job_requisition_id,
            'title'              => $request->title,
            'description'        => $request->description,
            'tags'               => $request->tags,
            'location'           => $request->location,
            'employment_type'    => $request->employment_type,
            'education_level'    => is_array($request->education_level) ? implode(', ', $request->education_level) : $request->education_level,
            'experience_level'   => is_array($request->experience_level) ? implode(', ', $request->experience_level) : $request->experience_level,
            'core_requirements'  => is_array($request->core_requirements) ? implode('|', $request->core_requirements) : $request->core_requirements,
            'is_internal'        => $request->is_internal ?? false,
            'is_external'        => $request->is_external ?? false,
            'deadline'           => $request->deadline,
            'status'             => $request->status ?? 'posted',
        ];

        $posting = JobPosting::create($data);

        return response()->json($posting->load(['requisition.company', 'requisition.department']), 201);
    }

    public function show(JobPosting $job)
    {
        JobPosting::closeStatusForExpiredJobs();
        return response()->json($job->load(['requisition.company', 'requisition.department']));
    }

    public function all(Request $request)
    {
        JobPosting::closeStatusForExpiredJobs();
        $user = $request->user();
        $query = JobPosting::with(['requisition.company', 'requisition.department']);

        // TA (5), HR (3), and Admin (1) can see all
        if (!in_array($user->role_id, [1, 3, 5])) {
            $query->where('status', 'posted');
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
            'education_level'    => 'nullable',
            'experience_level'    => 'nullable',
            'core_requirements'   => 'nullable',
            'status'             => 'required|string|in:created,posted,closed',
        ]);

        $data = $request->all();
        if (isset($data['education_level']) && is_array($data['education_level'])) {
            $data['education_level'] = implode(', ', $data['education_level']);
        }
        if (isset($data['experience_level']) && is_array($data['experience_level'])) {
            $data['experience_level'] = implode(', ', $data['experience_level']);
        }
        if (isset($data['core_requirements']) && is_array($data['core_requirements'])) {
            $data['core_requirements'] = implode('|', $data['core_requirements']);
        }

        $job->update($data);

        return response()->json($job->load(['requisition.company', 'requisition.department']));
    }

    public function destroy(JobPosting $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job posting deleted successfully']);
    }
}
