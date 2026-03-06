<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class OfferStageNotification extends Notification
{
    use Queueable;

    protected string $message;
    protected string $candidateName;
    protected string $jobTitle;
    protected string $senderName;
    protected int $applicationId;

    public function __construct(string $message, string $candidateName, string $jobTitle, string $senderName, int $applicationId)
    {
        $this->message       = $message;
        $this->candidateName = $candidateName;
        $this->jobTitle      = $jobTitle;
        $this->senderName    = $senderName;
        $this->applicationId = $applicationId;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Offer Stage Update — {$this->jobTitle}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A TA Team member has sent you an update regarding the offer stage for the following position:")
            ->line("**Position:** {$this->jobTitle}")
            ->line("**Candidate:** {$this->candidateName}")
            ->line("**Message from {$this->senderName}:**")
            ->line("\"{$this->message}\"")
            ->line("Please log in to the system to review and take any necessary action.")
            ->action('View Application', url("/ta/dashboard"))
            ->salutation('Regards, TAS Recruitment System');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'           => 'offer_stage_notification',
            'message'        => $this->message,
            'candidate_name' => $this->candidateName,
            'job_title'      => $this->jobTitle,
            'sender_name'    => $this->senderName,
            'application_id' => $this->applicationId,
        ];
    }
}
