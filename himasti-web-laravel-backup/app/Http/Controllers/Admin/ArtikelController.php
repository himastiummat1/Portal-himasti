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
        $request->validate(['judul' => 'required', 'penulis' => 'required', 'konten' => 'required', 'status' => 'required', 'link' => 'nullable|url']);
        Artikel::create($request->only(['judul', 'penulis', 'konten', 'status', 'link']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function update(Request $request, $id)
    {
        $request->validate(['judul' => 'required', 'penulis' => 'required', 'konten' => 'required', 'status' => 'required', 'link' => 'nullable|url']);
        Artikel::findOrFail($id)->update($request->only(['judul', 'penulis', 'konten', 'status', 'link']));
        return redirect()->route('admin.artikel.index')->with('success', 'Data berhasil diperbarui!');
    }

    public function destroy($id)
    {
        Artikel::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
