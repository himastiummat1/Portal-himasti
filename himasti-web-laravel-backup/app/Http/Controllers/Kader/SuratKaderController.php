<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Surat;
use Illuminate\Support\Facades\Auth;

class SuratKaderController extends Controller
{
    /**
     * Menampilkan riwayat surat kader
     */
    public function index()
    {
        $surats = Surat::where('user_id', Auth::id())->latest()->get();
        return view('kader.surat.index', compact('surats'));
    }

    /**
     * Pengajuan surat baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'jenis_surat' => 'required|string',
            'perihal' => 'required|string',
            'file_pdf' => 'required|mimes:pdf|max:2048', // max 2MB
        ]);

        $path = $request->file('file_pdf')->store('surats', 'public');

        Surat::create([
            'user_id' => Auth::id(),
            'jenis_surat' => $request->jenis_surat,
            'perihal' => $request->perihal,
            'status' => 'pending',
            'file_pdf' => $path,
        ]);

        return redirect()->route('kader.surat.index')->with('success', 'Pengajuan surat berhasil dikirim.');
    }
}
