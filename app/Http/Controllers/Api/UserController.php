<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['role', 'company', 'department'])->get();
        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
            'company_id' => 'nullable|exists:companies,id',
            'company_ids' => 'nullable|array',
            'company_ids.*' => 'exists:companies,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'company_id' => $validated['company_id'] ?? null,
            'department_id' => $validated['department_id'] ?? null,
        ]);

        if (isset($validated['company_ids'])) {
            $user->companies()->sync($validated['company_ids']);
        }

        return response()->json($user->load(['role', 'company', 'department']), 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => [
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8',
            'role_id' => 'exists:roles,id',
            'company_id' => 'nullable|exists:companies,id',
            'company_ids' => 'nullable|array',
            'company_ids.*' => 'exists:companies,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        if (isset($validated['company_ids'])) {
            $user->companies()->sync($validated['company_ids']);
            unset($validated['company_ids']);
        }

        $user->update($validated);

        return response()->json($user->load(['role', 'company', 'department']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting self
        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Get all roles for dropdowns.
     */
    public function roles()
    {
        $roles = Role::all();
        return response()->json($roles);
    }
}
