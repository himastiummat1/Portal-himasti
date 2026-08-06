<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Survey;

class SurveyController extends Controller
{
    public function index()
    {
        $items = Survey::latest()->get();
        return view('admin.survey.index', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate(['judul' => 'required', 'link_gform' => 'required|url', 'target_responden' => 'required|numeric', 'status' => 'required']);
        Survey::create($request->only(['judul', 'link_gform', 'target_responden', 'status', 'deskripsi']));
        return back()->with('success', 'Data berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        Survey::findOrFail($id)->delete();
        return back()->with('success', 'Data berhasil dihapus!');
    }
}
