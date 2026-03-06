<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionHRApproved extends Notification
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
            ->subject('Budget Authorized: ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your hiring requisition for "' . $this->requisition->title . '" has been cleared by HR.')
            ->line('The requisition has now moved to the CEO for final operational authorization.')
            ->line('Current Status: Pending CEO Approval')
            ->action('View Requisition Progress', config('app.frontend_url') . '/manager/request')
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
            'message' => 'HR has authorized your requisition. Awaiting CEO sign-off.'
        ];
    }
}
