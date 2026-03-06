<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Contracts\Queue\ShouldQueue;

class OfferComment extends Notification implements ShouldQueue
{
    use Queueable;

    protected $comment;
    protected $candidateName;
    protected $jobTitle;
    protected $applicationId;

    public function __construct(string $comment, string $candidateName, string $jobTitle, int $applicationId)
    {
        $this->comment = $comment;
        $this->candidateName = $candidateName;
        $this->jobTitle = $jobTitle;
        $this->applicationId = $applicationId;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Offer Response from Candidate: ' . $this->candidateName)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A candidate has responded to their job offer. Please review their comment below.')
            ->line('**Candidate:** ' . $this->candidateName)
            ->line('**Position:** ' . $this->jobTitle)
            ->line('**Comment:**')
            ->line('"' . $this->comment . '"')
            ->action('View in TA Dashboard', config('app.frontend_url') . '/ta/dashboard')
            ->salutation('Best regards, The Droga Group Hub Talent Acquisition System');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Offer Response: ' . $this->candidateName,
            'message' => $this->candidateName . ' responded to their offer for ' . $this->jobTitle . ': "' . $this->comment . '"',
            'application_id' => $this->applicationId,
            'candidate_name' => $this->candidateName,
            'type' => 'offer_message',
        ];
    }
}
