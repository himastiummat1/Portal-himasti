<?php

namespace App\Http\Controllers\Admin\Sekretariat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Surat;

class SuratMasukController extends Controller
{
    /**
     * Menampilkan daftar surat masuk yang perlu diverifikasi
     */
    public function index()
    {
        $surats = Surat::with('user')->latest()->get();
        return view('admin.sekretariat.surat.index', compact('surats'));
    }

    /**
     * Approve dan berikan nomor surat
     */
    public function approve(Request $request, Surat $surat)
    {
        $request->validate([
            'nomor_surat' => 'required|string|unique:surats,nomor_surat,' . $surat->id,
        ]);

        $surat->update([
            'status' => 'approved',
            'nomor_surat' => $request->nomor_surat,
        ]);

        return redirect()->route('admin.sekretariat.surat.index')->with('success', 'Surat berhasil diapprove dan diberikan nomor.');
    }

    /**
     * Reject surat
     */
    public function reject(Request $request, Surat $surat)
    {
        $surat->update([
            'status' => 'rejected',
        ]);

        return redirect()->route('admin.sekretariat.surat.index')->with('success', 'Surat berhasil ditolak.');
    }
}
