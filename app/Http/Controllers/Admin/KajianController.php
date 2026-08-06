<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kajian;

class KajianController extends Controller
{
    public function index()
    {
        $items = Kajian::latest()->get();
        return view('admin.kajian.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['tema' => 'required', 'pemateri' => 'required', 'tanggal' => 'required|date', 'lokasi' => 'required', 'status' => 'required', 'deskripsi' => 'required']);
        Kajian::create($request->only(['tema', 'pemateri', 'tanggal', 'lokasi', 'status', 'deskripsi']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Kajian::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
