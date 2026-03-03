<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Application;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Interview::with('application.candidate', 'application.jobPosting.requisition')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'type' => 'required|string',
            'scheduled_at' => 'required|date',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $interview = Interview::create($request->all());
        
        // Eager load everything needed for notifications
        $interview->load(['application.candidate', 'application.jobPosting.requisition.user']);
        
        $application = $interview->application;
        $scheduledAtStr = \Carbon\Carbon::parse($interview->scheduled_at)->format('F j, Y, g:i a');
        $feedback = "Interview scheduled for {$scheduledAtStr} at {$request->location}. Notes: {$request->notes}";

        // Update application status to match the interview node
        $newStatus = str_contains(strtolower($request->type), '2') ? 'interview_2' : 'interview_1';
        $application->update(['status' => $newStatus, 'feedback' => $feedback]);

        // Record history
        $application->histories()->create([
            'status' => $newStatus,
            'feedback' => $feedback,
            'user_id' => $request->user()->id,
        ]);

        // Notify Candidate
        $application->candidate->notify(new \App\Notifications\InterviewScheduled($interview));

        // Notify Requester (Hiring Manager)
        $requester = $application->jobPosting?->requisition?->user;
        if ($requester) {
            $requester->notify(new \App\Notifications\InterviewScheduled($interview, true));
        }

        return response()->json($application->load(['candidate', 'jobPosting.requisition', 'histories.user']), 201);
    }

    public function update(Request $request, Interview $interview)
    {
        $request->validate([
            'status' => 'required|string|in:scheduled,completed,cancelled,absent',
            'notes' => 'nullable|string',
        ]);

        $interview->update($request->only('status', 'notes'));

        return response()->json($interview);
    }
}
