<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionPendingHR extends Notification
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
            ->subject('Action Required: HR Authorization for ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new hiring requisition for "' . $this->requisition->title . '" has been submitted by ' . $this->requisition->user->name . ' and requires your budget authorization.')
            ->line('Current Status: Pending HR Approval')
            ->action('View Approvals Hub', config('app.frontend_url') . '/hr/approvals')
            ->line('Please review the requisition and JD to proceed with authorization.')
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
            'status' => 'pending_hr',
            'message' => 'New requisition submitted for your review.'
        ];
    }
}
