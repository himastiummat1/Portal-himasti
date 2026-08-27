<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProject extends Model
{
    protected $fillable = ['title', 'student_name', 'category', 'description', 'screenshot', 'github_link', 'demo_link'];
}
