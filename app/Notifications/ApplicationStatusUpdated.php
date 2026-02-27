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

    /**
     * Create a new notification instance.
     */
    public function __construct($application, $feedback = null)
    {
        $this->application = $application;
        $this->feedback = $feedback;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
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

        return $message
            ->action('View My Application Flow', config('app.frontend_url') . '/profile')
            ->line('You can monitor the full chronological history of your application nodes in your profile.')
            ->salutation('Best regards, The Droga Group Talent Acquisition Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
