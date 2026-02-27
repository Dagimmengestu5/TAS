<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RequisitionApproved extends Notification
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
            ->subject('Executive Authorization Complete: ' . $this->requisition->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your hiring requisition for the ' . $this->requisition->title . ' position has been fully approved by the executive layer.')
            ->line('The requisition is now transitioning to the Talent Acquisition phase.')
            ->action('View Requisition Status', config('app.frontend_url') . '/manager/request')
            ->line('You can monitor candidate flow and interview status in your Manager Hub.')
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
            'message' => 'Hiring requisition approved by executive layer.'
        ];
    }
}
