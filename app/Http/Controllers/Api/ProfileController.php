<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $candidate = Candidate::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->first();

        if (!$candidate) {
            return response()->json(['message' => 'Candidate profile not found.'], 404);
        }

        return response()->json($candidate);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'age' => 'nullable|integer|min:18',
            'professional_background' => 'nullable|string',
            'years_of_experience' => 'nullable|integer',
            'institution_name' => 'nullable|string|max:255',
            'cgpa' => 'nullable|numeric|min:0|max:4',
            'current_address' => 'nullable|string|max:255',
            'work_experience' => 'nullable|array',
            'qualifications' => 'nullable|array',
            'certifications' => 'nullable|array',
            'languages' => 'nullable|array',
            'skills' => 'nullable|array',
        ]);

        $candidate = Candidate::updateOrCreate(
            ['email' => $user->email],
            array_merge(
                $request->only([
                    'name', 'phone', 'gender', 'age', 
                    'professional_background', 'years_of_experience',
                    'institution_name', 'cgpa', 'current_address',
                    'work_experience', 'qualifications', 'certifications', 'languages', 'skills'
                ]),
                ['user_id' => $user->id]
            )
        );

        return response()->json([
            'message' => 'Profile updated successfully.',
            'candidate' => $candidate
        ]);
    }
}
