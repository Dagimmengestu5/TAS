<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Carbon\Carbon;

class InterviewScheduled extends Notification
{
    use Queueable;

    protected $interview;
    protected $isRequester;

    /**
     * Create a new notification instance.
     *
     * @param $interview
     * @param bool $isRequester Set to true if this notification is for the hiring manager
     */
    public function __construct($interview, $isRequester = false)
    {
        $this->interview = $interview;
        $this->isRequester = $isRequester;
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
        $application = $this->interview->application;
        $jobTitle = $application->jobPosting?->requisition?->title ?? 'Position';
        $scheduledAt = Carbon::parse($this->interview->scheduled_at)->format('F j, Y, g:i a');
        $candidateName = $application->candidate->name;
        $location = $this->interview->location ?? 'To be determined';

        if ($this->isRequester) {
            // Email to Hiring Manager (Requester)
            return (new MailMessage)
                ->subject('Action Required: Interview Scheduled — ' . $jobTitle)
                ->greeting('Hello ' . $notifiable->name . ',')
                ->line('A candidate from your job requisition has been scheduled for an interview. Please make sure you attend.')
                ->line('**Position:** ' . $jobTitle)
                ->line('**Candidate:** ' . $candidateName)
                ->line('**Scheduled Time:** ' . $scheduledAt)
                ->line('**Location:** ' . $location)
                ->when($this->interview->notes, fn($mail) => $mail->line('**Notes from TA Team:** ' . $this->interview->notes))
                ->action('View Dashboard', config('app.frontend_url') . '/manager/request')
                ->salutation('Best regards, The Droga Group Talent Acquisition Team');
        }

        // Email to Candidate
        $mail = (new MailMessage)
            ->subject('Interview Scheduled: ' . $jobTitle)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('We are pleased to inform you that an interview has been scheduled for the **' . $jobTitle . '** position.')
            ->line('**Date & Time:** ' . $scheduledAt)
            ->line('**Location:** ' . $location);

        if ($this->interview->notes) {
            $mail->line('**Notes:** ' . $this->interview->notes);
        }

        return $mail->action('View Application Status', config('app.frontend_url') . '/profile')
                    ->salutation('Best regards, The Droga Group Talent Acquisition Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $application = $this->interview->application;
        return [
            'interview_id' => $this->interview->id,
            'application_id' => $application->id,
            'job_title' => $application->jobPosting?->requisition?->title ?? 'Position',
            'scheduled_at' => $this->interview->scheduled_at,
            'location' => $this->interview->location,
            'message' => $this->isRequester 
                ? "Interview scheduled for {$application->candidate->name} on " . Carbon::parse($this->interview->scheduled_at)->format('M d, Y')
                : "Your interview for {$application->jobPosting?->requisition?->title} is scheduled for " . Carbon::parse($this->interview->scheduled_at)->format('M d, Y')
        ];
    }
}
