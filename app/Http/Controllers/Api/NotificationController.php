<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        // Return latest 20 notifications (read or unread)
        $notifications = $user->notifications()->latest()->limit(20)->get();
        $unreadCount = $user->unreadNotifications()->count();

        return response()->json([
            'notifications' => $notifications,
            'count' => $unreadCount
        ]);
    }

    /**
     * Mark the specified notification as read.
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        
        // Mark as read when viewing details
        if (!$notification->read_at) {
            $notification->markAsRead();
        }

        $unreadMessagesCount = 0;
        $appId = $notification->data['application_id'] ?? null;
        if ($appId) {
            $unreadMessagesCount = \App\Models\ApplicationMessage::where('application_id', $appId)
                ->where('user_id', '!=', Auth::id())
                ->where('is_read', false)
                ->count();
        }

        return response()->json([
            'notification' => $notification,
            'unread_messages_count' => $unreadMessagesCount
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
