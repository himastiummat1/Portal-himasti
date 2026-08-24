<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ItModule;
use Illuminate\Support\Facades\Storage;

class ItModuleAdminController extends Controller
{
    public function index()
    {
        $modules = ItModule::orderBy('category')->latest()->paginate(20);
        return view('admin.modules.index', compact('modules'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'code_snippet' => 'nullable|string',
            'file_path' => 'nullable|file|mimes:pdf,zip,rar,doc,docx|max:10240',
        ]);

        $data = $request->except('file_path');

        if ($request->hasFile('file_path')) {
            $data['file_path'] = $request->file('file_path')->store('modules', 'public');
        }

        ItModule::create($data);

        return redirect()->route('admin.modules.index')->with('success', 'Modul / Snippet berhasil ditambahkan!');
    }

    public function update(Request $request, ItModule $module)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'code_snippet' => 'nullable|string',
            'file_path' => 'nullable|file|mimes:pdf,zip,rar,doc,docx|max:10240',
        ]);

        $data = $request->except('file_path');

        if ($request->hasFile('file_path')) {
            if ($module->file_path && Storage::disk('public')->exists($module->file_path)) {
                Storage::disk('public')->delete($module->file_path);
            }
            $data['file_path'] = $request->file('file_path')->store('modules', 'public');
        }

        $module->update($data);

        return redirect()->route('admin.modules.index')->with('success', 'Modul berhasil diupdate!');
    }

    public function destroy(ItModule $module)
    {
        if ($module->file_path && Storage::disk('public')->exists($module->file_path)) {
            Storage::disk('public')->delete($module->file_path);
        }
        $module->delete();
        return redirect()->route('admin.modules.index')->with('success', 'Modul berhasil dihapus!');
    }
}
