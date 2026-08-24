<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudentProject;
use Illuminate\Support\Facades\Storage;

class StudentProjectAdminController extends Controller
{
    public function index()
    {
        $projects = StudentProject::latest()->paginate(20);
        return view('admin.projects.index', compact('projects'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'student_name' => 'required|string|max:255',
            'nim' => 'required|string|max:20',
            'batch' => 'required|string|max:10',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'github_link' => 'nullable|url',
            'demo_link' => 'nullable|url',
        ]);

        $data = $request->except('thumbnail');

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('projects', 'public');
        }

        StudentProject::create($data);

        return redirect()->route('admin.projects.index')->with('success', 'Karya berhasil ditambahkan!');
    }

    public function update(Request $request, StudentProject $project)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'student_name' => 'required|string|max:255',
            'nim' => 'required|string|max:20',
            'batch' => 'required|string|max:10',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'github_link' => 'nullable|url',
            'demo_link' => 'nullable|url',
        ]);

        $data = $request->except('thumbnail');

        if ($request->hasFile('thumbnail')) {
            if ($project->thumbnail && Storage::disk('public')->exists($project->thumbnail)) {
                Storage::disk('public')->delete($project->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('projects', 'public');
        }

        $project->update($data);

        return redirect()->route('admin.projects.index')->with('success', 'Karya berhasil diupdate!');
    }

    public function destroy(StudentProject $project)
    {
        if ($project->thumbnail && Storage::disk('public')->exists($project->thumbnail)) {
            Storage::disk('public')->delete($project->thumbnail);
        }
        $project->delete();
        return redirect()->route('admin.projects.index')->with('success', 'Karya berhasil dihapus!');
    }
}
