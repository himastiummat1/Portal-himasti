<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppChannel
{
    /**
     * Send the given notification.
     */
    public function send(object $notifiable, Notification $notification): void
    {
        if (!method_exists($notification, 'toWhatsApp')) {
            return;
        }

        $message = $notification->toWhatsApp($notifiable);
        $phone = $notifiable->dataKader->no_hp ?? null;

        if (!$phone) {
            return;
        }

        // Format phone number to start with 62 instead of 0
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        $token = env('FONNTE_TOKEN'); // Atau provider API WA lain (misal Fonnte)
        
        if (!$token) {
            Log::warning('WhatsApp Notification skipped: FONNTE_TOKEN is not set in .env');
            return;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $phone,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if (!$response->successful()) {
                Log::error('Failed to send WhatsApp message: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp API Exception: ' . $e->getMessage());
        }
    }
}
