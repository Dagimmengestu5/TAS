<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionCreated extends Notification
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
            ->subject('New Requisition Submitted - ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new hiring requisition has been submitted for: ' . $this->requisition->title)
            ->line('It is currently pending HR and CEO approval.')
            ->action('View Requisition', config('app.frontend_url') . '/ta/dashboard')
            ->line('We will notify you once it is fully approved and ready for posting.')
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
            'title' => 'New Requisition Submitted',
            'type' => 'requisition',
            'status' => 'pending_hr',
            'message' => 'A new requisition for ' . $this->requisition->title . ' has been submitted and is awaiting approval.'
        ];
    }
}
