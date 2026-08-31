<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $labels = ['pending' => 'aguardando pagamento', 'paid' => 'pago', 'processing' => 'em processamento', 'completed' => 'concluído', 'cancelled' => 'cancelado', 'refunded' => 'reembolsado'];

        return (new MailMessage)->subject("Atualização do pedido #{$this->order->id}")->greeting("Olá, {$notifiable->name}!")->line('O status do seu pedido mudou para: '.($labels[$this->order->status] ?? $this->order->status).'.')->action('Ver meus pedidos', config('app.frontend_url'));
    }
}
