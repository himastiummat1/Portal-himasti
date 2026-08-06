<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Klub;

class KlubController extends Controller
{
    public function index()
    {
        $items = Klub::latest()->get();
        return view('admin.klub.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['nama_klub' => 'required', 'ketua_klub' => 'required', 'jadwal_latihan' => 'required', 'deskripsi' => 'required']);
        Klub::create($request->only(['nama_klub', 'ketua_klub', 'jadwal_latihan', 'deskripsi']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Klub::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
