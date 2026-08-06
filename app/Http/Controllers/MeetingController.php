<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $meetings = Meeting::with('creator')->latest()->get();
        return view('admin.meetings.index', compact('meetings'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:rapat_pengurus,rapat_panitia',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
        ]);

        $type = $request->type;
        $user = auth()->user();
        
        // Prevent ketua panitia sementara from creating rapat pengurus
        if ($type === 'rapat_pengurus' && !$user->hasAnyRole(['super_admin', 'ketua_himpunan', 'wakil_ketua_himpunan', 'admin_sekretariat', 'bendahara', 'kabid_kemuhammadiyahan', 'kabid_keorganisasian', 'kabid_metkom', 'kabid_litbang', 'kabid_kewirausahaan', 'kabid_mikat'])) {
            return back()->withErrors(['message' => 'Anda hanya diizinkan untuk membuat Pesan Rapat Sementara.']);
        }

        $meeting = Meeting::create([
            'title' => $request->title,
            'description' => $request->description,
            'type' => $type,
            'event_date' => $request->event_date,
            'location' => $request->location,
            'created_by' => auth()->id(),
        ]);

        // Ambil semua user yang memiliki role kader
        $kaders = \App\Models\User::role('kader')->get();
        
        // Kirim Notifikasi Massal (via Email dan WhatsApp)
        // Karena ShouldQueue digunakan, proses ini akan berjalan di background
        \Illuminate\Support\Facades\Notification::send($kaders, new \App\Notifications\MeetingNotification($meeting));

        return redirect()->route('admin.meetings.index')->with('success', 'Undangan rapat berhasil dikirim/dibuat.');
    }

    public function destroy(Meeting $meeting)
    {
        // Only allow creator or super admin to delete
        if ($meeting->created_by !== auth()->id() && !auth()->user()->hasRole('super_admin')) {
            return back()->withErrors(['message' => 'Anda tidak memiliki akses untuk menghapus rapat ini.']);
        }
        
        $meeting->delete();
        return back()->with('success', 'Rapat berhasil dihapus.');
    }

    /**
     * Resend/Bump the meeting so it appears at the top.
     */
    public function resend(Meeting $meeting)
    {
        // Only allow creator or super admin to resend
        if ($meeting->created_by !== auth()->id() && !auth()->user()->hasRole('super_admin')) {
            return back()->withErrors(['message' => 'Anda tidak memiliki akses untuk mengirim ulang rapat ini.']);
        }

        // Just update the created_at timestamp to bump it
        $meeting->created_at = now();
        $meeting->save();

        return back()->with('success', 'Undangan rapat berhasil dikirim ulang (dinaikkan ke atas).');
    }
}
