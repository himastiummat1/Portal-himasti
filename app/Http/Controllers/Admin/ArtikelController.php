<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Artikel;

class ArtikelController extends Controller
{
    public function index()
    {
        $items = Artikel::latest()->get();
        return view('admin.artikel.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['judul' => 'required', 'penulis' => 'required', 'konten' => 'required', 'status' => 'required']);
        Artikel::create($request->only(['judul', 'penulis', 'konten', 'status']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Artikel::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
