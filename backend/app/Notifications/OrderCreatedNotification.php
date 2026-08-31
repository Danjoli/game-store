<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)->subject("Pedido #{$this->order->id} recebido")->greeting("Olá, {$notifiable->name}!")->line('Recebemos seu pedido na Game Store.')->line('Total: R$ '.number_format((float) $this->order->total, 2, ',', '.'));
        if ($this->order->payment_url) {
            $mail->action('Concluir pagamento', $this->order->payment_url);
        }

        return $mail->action('Acompanhar pedido', config('app.frontend_url'))->line('Avisaremos quando o status mudar.');
    }
}
