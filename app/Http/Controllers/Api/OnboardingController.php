<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OnboardingPlan;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(OnboardingPlan::with('user')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'checklist' => 'array',
            'orientation_date' => 'required|date',
        ]);

        $plan = OnboardingPlan::create([
            'user_id' => $request->user_id,
            'checklist' => $request->checklist ?? [
                ['task' => 'IT Equipment Setup', 'done' => false],
                ['task' => 'HR Documentation', 'done' => false],
                ['task' => 'Team Introduction', 'done' => false],
            ],
            'orientation_date' => $request->orientation_date,
            'status' => 'pending',
        ]);

        return response()->json($plan, 201);
    }

    public function update(Request $request, OnboardingPlan $onboarding)
    {
        $request->validate([
            'checklist' => 'array',
            'status' => 'string|in:pending,in_progress,completed',
        ]);

        $onboarding->update($request->only('checklist', 'status'));

        return response()->json($onboarding);
    }

    public function show(OnboardingPlan $onboarding)
    {
        return response()->json($onboarding->load('user'));
    }
}
