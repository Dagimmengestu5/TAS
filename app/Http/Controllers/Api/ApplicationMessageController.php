<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationMessage;
use Illuminate\Http\Request;

class ApplicationMessageController extends Controller
{
    /**
     * Get all messages for an application.
     */
    public function index(Request $request, Application $application)
    {
        $user = $request->user();

        // Mark unread messages sent by others as read
        ApplicationMessage::where('application_id', $application->id)
            ->where('user_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(
            ApplicationMessage::with('user:id,name,role_id')
                ->where('application_id', $application->id)
                ->orderBy('created_at', 'asc')
                ->get()
        );
    }

    /**
     * Store a new message. Notifies the other party.
     */
    public function store(Request $request, Application $application)
    {
        $request->validate([
            'message' => 'required|string|max:3000',
        ]);

        $sender = $request->user();

        $msg = ApplicationMessage::create([
            'application_id' => $application->id,
            'user_id' => $sender->id,
            'message' => $request->message,
        ]);

        // Load application data for notifications
        $application->load(['candidate', 'jobPosting.requisition']);
        $jobTitle = $application->jobPosting?->requisition?->title ?? 'Position';
        $candidateName = $application->candidate->name;
        $senderRole = $sender->role?->name;

        // If sender is candidate → notify all TA/admin users
        if (in_array($senderRole, ['candidate']) || !in_array($senderRole, ['admin', 'ta_team', 'hiring_manager', 'hr_approver', 'ceo_approver'])) {
            $taUsers = \App\Models\User::whereHas('role', fn($q) => $q->whereIn('name', ['ta_team', 'admin']))->get();
            foreach ($taUsers as $taUser) {
                $taUser->notify(new \App\Notifications\OfferComment(
                    $request->message,
                    $candidateName,
                    $jobTitle,
                    $application->id
                ));
            }
        } else {
            // Sender is TA/admin → notify the candidate
            $candidateUser = $application->candidate->user ?? null;
            if ($candidateUser) {
                $candidateUser->notify(new \App\Notifications\GenericNotification(
                    'TA Team responded to your offer',
                    'The TA team replied regarding your offer for ' . $jobTitle . ': "' . $request->message . '"'
                ));
            }
        }

        return response()->json($msg->load('user:id,name,role_id'), 201);
    }
}
