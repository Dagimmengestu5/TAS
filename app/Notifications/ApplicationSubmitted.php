<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationSubmitted extends Notification
{
    use Queueable;

    protected $application;

    /**
     * Create a new notification instance.
     */
    public function __construct($application)
    {
        $this->application = $application;
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
        $jobTitle = $this->application->jobPosting->requisition->title;
        $candidateName = $this->application->candidate->name;

        return (new MailMessage)
            ->subject('Application Confirmation - ' . $jobTitle)
            ->greeting('Hello ' . $candidateName . ',')
            ->line('Thank you for applying to the ' . $jobTitle . ' position at Droga Group.')
            ->line('We have successfully received your professional profile and attachments.')
            ->line('Our Talent Acquisition team will review your qualifications and synchronize with you shortly regarding the next steps.')
            ->action('View My Applications', url('/profile'))
            ->line('Thank you for your interest in joining our team!')
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
