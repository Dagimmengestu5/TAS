<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;

class OrgController extends Controller
{
    public function companies()
    {
        return response()->json(Company::with('departments')->get());
    }

    public function storeCompany(Request $request)
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:companies']);
        $company = Company::create($validated);
        return response()->json($company, 201);
    }

    public function updateCompany(Request $request, Company $company)
    {
        $validated = $request->validate(['name' => 'required|string|max:255|unique:companies,name,' . $company->id]);
        $company->update($validated);
        return response()->json($company);
    }

    public function destroyCompany(Company $company)
    {
        $company->delete();
        return response()->json(['message' => 'Company deleted successfully']);
    }

    public function departments($companyId = null)
    {
        $query = Department::with('company');
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        return response()->json($query->get());
    }

    public function storeDepartment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id'
        ]);
        $department = Department::create($validated);
        return response()->json($department->load('company'), 201);
    }

    public function updateDepartment(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id'
        ]);
        $department->update($validated);
        return response()->json($department->load('company'));
    }

    public function destroyDepartment(Department $department)
    {
        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }
}
