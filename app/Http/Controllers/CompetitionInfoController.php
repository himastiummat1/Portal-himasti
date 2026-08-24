<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\CompetitionInfo;

class CompetitionInfoController extends Controller
{
    public function index(Request $request)
    {
        $query = CompetitionInfo::query();
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('type', 'like', '%' . $request->search . '%');
        }
        $competitions = $query->orderBy('deadline', 'asc')->paginate(10);
        return view('competitions.index', compact('competitions'));
    }

    public function show(CompetitionInfo $competition)
    {
        return view('competitions.show', compact('competition'));
    }
}
