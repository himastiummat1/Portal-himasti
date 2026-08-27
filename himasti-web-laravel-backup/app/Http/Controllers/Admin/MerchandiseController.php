<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Merchandise;

class MerchandiseController extends Controller
{
    public function index()
    {
        $items = Merchandise::latest()->get();
        return view('admin.merchandise.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['nama_barang' => 'required', 'harga' => 'required|numeric', 'stok' => 'required|numeric', 'deskripsi' => 'required', 'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048']);
        $data = $request->only(['nama_barang', 'harga', 'stok', 'deskripsi']);
        
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('merchandise', 'public');
        }
        
        Merchandise::create($data);
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $item = Merchandise::findOrFail($id);
        if ($item->gambar && \Storage::disk('public')->exists($item->gambar)) {
            \Storage::disk('public')->delete($item->gambar);
        }
        $item->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
