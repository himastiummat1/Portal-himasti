<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\GaleriKaderisasi;
use Illuminate\Support\Facades\Storage;

class GaleriKaderisasiController extends Controller
{
    public function index()
    {
        $items = GaleriKaderisasi::latest()->get();
        return view('admin.kaderisasi.galeri.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string',
            'deskripsi' => 'nullable|string',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->only(['judul', 'deskripsi']);
        
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('galeri-kaderisasi', 'public');
        }

        GaleriKaderisasi::create($data);

        return back()->with('success', 'Foto kegiatan berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $item = GaleriKaderisasi::findOrFail($id);
        
        if ($item->gambar && Storage::disk('public')->exists($item->gambar)) {
            Storage::disk('public')->delete($item->gambar);
        }
        
        $item->delete();

        return back()->with('success', 'Foto kegiatan berhasil dihapus!');
    }
}
