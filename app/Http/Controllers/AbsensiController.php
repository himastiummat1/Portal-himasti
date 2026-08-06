<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Absensi;
use App\Models\Event;
use App\Models\User;

class AbsensiController extends Controller
{
    public function index()
    {
        $absensis = Absensi::with(['event', 'user'])->latest()->get();
        $events = Event::all();
        $users = User::all();
        return view('admin.absensi.index', compact('absensis', 'events', 'users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'status_kehadiran' => 'required|in:hadir,izin,sakit,alfa',
            'catatan' => 'nullable|string'
        ]);

        Absensi::create([
            'event_id' => $request->event_id,
            'user_id' => $request->user_id,
            'status_kehadiran' => $request->status_kehadiran,
            'waktu_hadir' => now(),
            'catatan' => $request->catatan,
        ]);

        return back()->with('success', 'Absensi berhasil dicatat!');
    }
}
