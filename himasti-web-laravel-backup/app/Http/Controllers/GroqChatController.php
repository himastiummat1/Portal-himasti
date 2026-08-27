<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqChatController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('HIMASTI_GROQ_KEY'),
                'Content-Type' => 'application/json',
            ])->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'groq/compound', // Model Groq generasi terbaru (2026)
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Kamu adalah Asisten AI untuk website portal mahasiswa IT "HIMASTI" (Himpunan Mahasiswa Sistem Informasi dan Teknologi). Kamu ramah, pintar coding, dan selalu menjawab dalam bahasa Indonesia yang gaul tapi sopan. Jawablah secara ringkas dan informatif.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $request->message
                    ]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'reply' => $data['choices'][0]['message']['content']
                ]);
            }

            Log::error('Groq API Error: ' . $response->body());
            return response()->json(['reply' => 'Waduh, server AInya lagi pusing nih (Error dari Groq). Coba lagi nanti ya!'], 500);

        } catch (\Exception $e) {
            Log::error('Groq Exception: ' . $e->getMessage());
            return response()->json(['reply' => 'Maaf, sepertinya ada masalah koneksi ke otak AI-ku.'], 500);
        }
    }
}
