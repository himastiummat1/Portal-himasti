<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ItModule;

class ItModuleController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        
        if ($search) {
            $categories = ItModule::where('category', 'like', '%' . $search . '%')
                            ->orWhere('title', 'like', '%' . $search . '%')
                            ->select('category')
                            ->distinct()
                            ->pluck('category');
        } else {
            $categories = ItModule::select('category')->distinct()->pluck('category');
        }
        
        // Count items per category
        $categoryData = [];
        foreach ($categories as $cat) {
            $categoryData[] = [
                'name' => $cat,
                'count' => ItModule::where('category', $cat)->count()
            ];
        }

        return view('modules.index', compact('categoryData', 'search'));
    }

    public function showCategory($category)
    {
        $modules = ItModule::where('category', $category)->latest()->get();
        
        if ($modules->isEmpty()) {
            abort(404);
        }
        
        return view('modules.show', compact('modules', 'category'));
    }

    public function download(ItModule $module)
    {
        $content = $module->code_snippet;
        $filename = \Str::slug($module->title) . '.txt';
        return response($content)
            ->header('Content-Type', 'text/plain')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }
}
