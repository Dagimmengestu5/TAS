<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionReadyForPosting extends Notification
{
    use Queueable;

    protected $requisition;

    /**
     * Create a new notification instance.
     */
    public function __construct($requisition)
    {
        $this->requisition = $requisition;
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
        return (new MailMessage)
            ->subject('Action Required: Requisition Ready for Posting - ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('The executive team has fully approved the hiring requisition for: ' . $this->requisition->title)
            ->line('This requisition is now assigned to the TA team for job post initialization.')
            ->action('Create Job Posting', config('app.frontend_url') . '/ta/jobs/create')
            ->line('Please prioritize this posting to maintain hiring velocity.')
            ->salutation('Best regards, Droga Group Management OS');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'requisition_id' => $this->requisition->id,
            'title' => $this->requisition->title,
            'status' => 'approved',
            'message' => 'New requisition approved and ready for posting.'
        ];
    }
}
