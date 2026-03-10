<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    protected $application;
    protected $feedback;
    protected $documentPath;

    /**
     * Create a new notification instance.
     */
    public function __construct($application, $feedback = null, $documentPath = null)
    {
        $this->application = $application;
        $this->feedback = $feedback;
        $this->documentPath = $documentPath;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $jobTitle = $this->application->jobPosting?->requisition?->title ?? 'Position';
        $status = str_replace('_', ' ', strtoupper($this->application->status ?? 'UPDATED'));
        $candidateName = $notifiable->name ?? 'Candidate';

        // Use request feedback if provided, otherwise fall back to application's stored feedback
        $feedbackToDisplay = $this->feedback ?: $this->application->feedback;

        $message = (new MailMessage)
            ->subject('Application Status Update: ' . $jobTitle)
            ->greeting('Hello ' . $candidateName . ',')
            ->line('There has been a synchronization update in your application for the ' . $jobTitle . ' position.')
            ->line('Your current status is now: ' . $status);

        if ($feedbackToDisplay) {
            $message->line('Feedback from our Talent Acquisition Team:')
                    ->line('"' . $feedbackToDisplay . '"');
        }

        $isOffer = $this->application->status === 'offer';
        $profileUrl = config('app.frontend_url') . '/profile';

        $message->action(
            $isOffer ? 'Reply to Your Offer' : 'View My Application',
            $profileUrl
        );

        if ($isOffer) {
            $message->line('You can accept, negotiate, or ask questions about your offer directly from your profile.');
        } else {
            $message->line('You can monitor the full chronological history of your application nodes in your profile.');
        }

        if ($this->documentPath) {
            $message->attach(storage_path('app/public/' . $this->documentPath));
        }

        return $message->salutation('Best regards, The Droga Group Hub Talent Acquisition Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'title' => 'Application Status Updated',
            'message' => 'The status of your application for ' . ($this->application->jobPosting?->requisition?->title ?? 'Position') . ' has been updated to ' . str_replace('_', ' ', $this->application->status),
            'type' => 'status_update',
            'status' => $this->application->status,
            'feedback' => $this->feedback
        ];
    }
}
