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

        return response()->json($interview->load('application.candidate'), 201);
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
