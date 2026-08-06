<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notulensi;

class NotulensiController extends Controller
{
    public function index()
    {
        $items = Notulensi::latest()->get();
        return view('admin.notulensi.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['agenda' => 'required', 'tanggal' => 'required|date', 'pemimpin_rapat' => 'required', 'hasil_rapat' => 'required', 'jumlah_hadir' => 'required|numeric']);
        Notulensi::create($request->only(['agenda', 'tanggal', 'pemimpin_rapat', 'hasil_rapat', 'jumlah_hadir']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Notulensi::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
