<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Application;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Offer::with('application.candidate', 'application.jobPosting.requisition')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:applications,id',
            'salary' => 'required|numeric',
            'start_date' => 'required|date',
        ]);

        $offer = Offer::create([
            'application_id' => $request->application_id,
            'salary' => $request->salary,
            'start_date' => $request->start_date,
            'status' => 'sent',
        ]);

        return response()->json($offer->load('application.candidate'), 201);
    }

    public function update(Request $request, Offer $offer)
    {
        $request->validate([
            'status' => 'required|string|in:accepted,declined',
        ]);

        $offer->update(['status' => $request->status]);

        if ($request->status === 'accepted') {
            $offer->application->update(['status' => 'hired']);
        }

        return response()->json($offer);
    }
}
