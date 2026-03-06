<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionPendingCEO extends Notification
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
            ->subject('Action Required: CEO Approval for ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A job requisition for "' . $this->requisition->title . '" has been approved by HR and is now awaiting your final authorization.')
            ->line('Current Status: Pending CEO Approval')
            ->action('View Approvals Hub', config('app.frontend_url') . '/ceo/approvals')
            ->line('Please review and authorize this requisition to proceed with the recruitment process.')
            ->salutation('Best regards, Droga Group Hub');
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
            'status' => 'pending_ceo',
            'message' => 'New requisition awaiting your approval.'
        ];
    }
}
