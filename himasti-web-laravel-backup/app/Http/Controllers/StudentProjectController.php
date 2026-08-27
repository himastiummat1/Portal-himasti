<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\StudentProject;

class StudentProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentProject::query();
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('student_name', 'like', '%' . $request->search . '%');
        }
        $projects = $query->latest()->paginate(12);
        return view('projects.index', compact('projects'));
    }

    public function show(StudentProject $project)
    {
        return view('projects.show', compact('project'));
    }
}
