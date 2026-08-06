<?php

namespace App\Http\Controllers\Admin\Kaderisasi;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DataKader;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class DataKaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kaders = DataKader::with('user')->latest()->get();
        return view('admin.kaderisasi.index', compact('kaders'));
    }

    public function duplicates()
    {
        $duplicates = User::select('name', \DB::raw('COUNT(*) as count'))
            ->whereHas('roles', function($q) {
                $q->where('name', 'kader');
            })
            ->groupBy('name')
            ->having('count', '>', 1)
            ->get();
            
        return view('admin.kaderisasi.duplicates', compact('duplicates'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'nim' => 'required|string|unique:data_kaders',
            'angkatan' => 'required|string',
            'status_kaderisasi' => 'required|string',
            'skills' => 'nullable|string',
            'no_hp' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->nim),
        ]);

        $user->assignRole('kader');

        DataKader::create([
            'user_id' => $user->id,
            'nim' => $request->nim,
            'angkatan' => $request->angkatan,
            'status_kaderisasi' => $request->status_kaderisasi,
            'skills' => $request->skills,
            'no_hp' => $request->no_hp,
        ]);

        return redirect()->route('admin.kaderisasi.index')->with('success', 'Data Kader berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DataKader $dataKader)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($dataKader->user_id)],
            'nim' => ['required', 'string', Rule::unique('data_kaders')->ignore($dataKader->id)],
            'angkatan' => 'required|string',
            'status_kaderisasi' => 'required|string',
            'skills' => 'nullable|string',
            'no_hp' => 'nullable|string',
        ]);

        $dataKader->user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $dataKader->update([
            'nim' => $request->nim,
            'angkatan' => $request->angkatan,
            'status_kaderisasi' => $request->status_kaderisasi,
            'skills' => $request->skills,
            'no_hp' => $request->no_hp,
        ]);

        return redirect()->route('admin.kaderisasi.index')->with('success', 'Data Kader berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage (Soft Delete).
     */
    public function destroy(DataKader $dataKader)
    {
        $dataKader->delete();

        return redirect()->route('admin.kaderisasi.index')->with('success', 'Data Kader berhasil dihapus (Soft Delete).');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file_csv' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file_csv');
        $csvData = file_get_contents($file);
        $rows = array_map('str_getcsv', explode("\n", $csvData));
        $header = array_shift($rows);

        $imported = 0;
        foreach ($rows as $row) {
            if (count($row) < 4) continue; // Pastikan kolom lengkap: Nama, Email, NIM, Angkatan
            
            $name = trim($row[0]);
            $email = trim($row[1]);
            $nim = trim($row[2]);
            $angkatan = trim($row[3]);

            if (empty($name) || empty($email) || empty($nim)) continue;

            // Lewati jika email/nim sudah ada
            if (User::where('email', $email)->exists() || DataKader::where('nim', $nim)->exists()) {
                continue;
            }

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($nim),
            ]);

            $user->assignRole('kader');

            DataKader::create([
                'user_id' => $user->id,
                'nim' => $nim,
                'angkatan' => $angkatan,
                'status_kaderisasi' => 'Aktif',
            ]);

            $imported++;
        }

        return redirect()->route('admin.kaderisasi.index')->with('success', "$imported Kader berhasil diimpor massal!");
    }
}
