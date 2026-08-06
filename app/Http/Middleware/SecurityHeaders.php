<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (method_exists($response, 'header')) {
            $response->header('X-Content-Type-Options', 'nosniff');
            $response->header('X-Frame-Options', 'SAMEORIGIN'); 
            $response->header('X-XSS-Protection', '1; mode=block'); 
            $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload'); 
            
            // Lanjutan:
            // CSP (Hindari inline-script yang berlebihan, tapi butuh penyesuaian jika Alpine/Vite digunakan)
            // Karena ini Laravel Breeze + AlpineJS + Vite, kita pakai CSP yang cukup longgar di script-src (unsafe-inline)
            $response->header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.bunny.net; font-src 'self' https://fonts.bunny.net; img-src 'self' data: https:; connect-src 'self' ws: wss:;");
            
            $response->header('Referrer-Policy', 'strict-origin-when-cross-origin');
            $response->header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        }

        return $response;
    }
}
