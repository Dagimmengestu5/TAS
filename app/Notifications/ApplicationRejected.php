<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationRejected extends Notification
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
            ->subject('Update on Your Application - ' . $jobTitle)
            ->greeting('Hello ' . $candidateName . ',')
            ->line('Thank you for the time and effort you invested in applying for the ' . $jobTitle . ' position at Droga Group.')
            ->line('Following a thorough review of your professional profile, we have decided not to move forward with your application at this time.')
            ->line('However, we were impressed with your background and have added your profile to our Talent Pool for future opportunities that align with your skills.')
            ->line('We wish you the very best in your professional journey and thank you again for your interest in Droga Group.')
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
