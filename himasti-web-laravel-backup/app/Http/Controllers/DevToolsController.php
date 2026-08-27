<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DevToolsController extends Controller
{
    public function index()
    {
        return view('devtools.index');
    }

    public function json()
    {
        return view('devtools.json');
    }

    public function regex()
    {
        return view('devtools.regex');
    }

    public function subnet()
    {
        return view('devtools.subnet');
    }

    public function markdown()
    {
        return view('devtools.markdown');
    }
}
