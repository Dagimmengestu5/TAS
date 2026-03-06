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
            'work_experience' => 'nullable|string', // JSON string from FormData
            'qualifications' => 'nullable|string',
            'certifications' => 'nullable|string',
            'languages' => 'nullable|string',
            'skills' => 'nullable|string',
            'experience_certificates' => 'nullable|string',
            'experience_certificates_files.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:5120',
            'certifications_files.*' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:5120',
        ]);

        $data = $request->only([
            'name', 'phone', 'gender', 'age', 
            'professional_background', 'years_of_experience',
            'institution_name', 'cgpa', 'current_address'
        ]);

        // Decode JSON fields since they come as strings in FormData
        $jsonFields = ['work_experience', 'qualifications', 'certifications', 'languages', 'skills', 'experience_certificates'];
        foreach ($jsonFields as $field) {
            if ($request->has($field)) {
                $data[$field] = json_decode($request->input($field), true);
            }
        }

        // Handle experience_certificates file uploads
        if ($request->hasFile('experience_certificates_files')) {
            $certs = $data['experience_certificates'] ?? [];
            foreach ($request->file('experience_certificates_files') as $index => $file) {
                if (isset($certs[$index])) {
                    $path = $file->store('certificates', 'public');
                    $certs[$index]['file_path'] = $path;
                }
            }
            $data['experience_certificates'] = $certs;
        }

        // Handle certifications file uploads
        if ($request->hasFile('certifications_files')) {
            $certs = $data['certifications'] ?? [];
            foreach ($request->file('certifications_files') as $index => $file) {
                if (isset($certs[$index])) {
                    $path = $file->store('certifications', 'public');
                    $certs[$index]['file_path'] = $path;
                }
            }
            $data['certifications'] = $certs;
        }

        $candidate = Candidate::updateOrCreate(
            ['email' => $user->email],
            array_merge($data, ['user_id' => $user->id])
        );

        return response()->json([
            'message' => 'Profile updated successfully.',
            'candidate' => $candidate
        ]);
    }
}
