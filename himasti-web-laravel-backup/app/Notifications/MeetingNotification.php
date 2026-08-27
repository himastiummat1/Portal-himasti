<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Meeting;
use App\Channels\WhatsAppChannel;
use Carbon\Carbon;

class MeetingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $meeting;

    /**
     * Create a new notification instance.
     */
    public function __construct(Meeting $meeting)
    {
        $this->meeting = $meeting;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Kirim via Email (WhatsApp dimatikan sementara karena API berbayar)
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $date = Carbon::parse($this->meeting->event_date)->translatedFormat('l, d F Y - H:i');
        
        return (new MailMessage)
            ->subject('Undangan Rapat HIMASTI: ' . $this->meeting->title)
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Kamu diundang untuk menghadiri rapat/agenda HIMASTI terbaru.')
            ->line('**Agenda:** ' . $this->meeting->title)
            ->line('**Waktu:** ' . $date . ' WITA')
            ->line('**Lokasi/Link:** ' . $this->meeting->location)
            ->line('**Deskripsi:** ' . $this->meeting->description)
            ->action('Lihat Detail di Dashboard', url('/dashboard'))
            ->line('Harap hadir tepat waktu. Terima kasih!');
    }

    /**
     * Get the WhatsApp representation of the notification.
     */
    public function toWhatsApp(object $notifiable): string
    {
        $date = Carbon::parse($this->meeting->event_date)->translatedFormat('l, d F Y - H:i');
        
        return "*UNDANGAN RAPAT HIMASTI*\n\n"
             . "Halo {$notifiable->name},\n"
             . "Kamu diundang untuk menghadiri agenda berikut:\n\n"
             . "📌 *Agenda:* {$this->meeting->title}\n"
             . "🕒 *Waktu:* {$date} WITA\n"
             . "📍 *Lokasi:* {$this->meeting->location}\n\n"
             . "📝 *Detail:*\n{$this->meeting->description}\n\n"
             . "Cek selengkapnya di sistem: " . url('/dashboard') . "\n"
             . "Harap hadir tepat waktu ya!";
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'meeting_id' => $this->meeting->id,
            'title' => $this->meeting->title,
        ];
    }
}
