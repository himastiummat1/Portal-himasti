<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Keuangan;
use App\Models\User;

class KeuanganController extends Controller
{
    public function index()
    {
        $keuangans = Keuangan::with('user')->latest()->get();
        $totalPemasukan = Keuangan::where('tipe', 'pemasukan')->sum('nominal');
        $totalPengeluaran = Keuangan::where('tipe', 'pengeluaran')->sum('nominal');
        $saldo = $totalPemasukan - $totalPengeluaran;
        $users = User::all();
        
        return view('admin.keuangan.index', compact('keuangans', 'totalPemasukan', 'totalPengeluaran', 'saldo', 'users'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'nominal' => 'required|numeric|min:1',
            'keterangan' => 'required|string',
            'tanggal' => 'required|date',
            'user_id' => 'nullable|exists:users,id'
        ]);

        Keuangan::create($request->all());

        return back()->with('success', 'Data keuangan berhasil dicatat!');
    }
}
