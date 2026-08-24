<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItModule extends Model
{
    protected $fillable = ['title', 'category', 'description', 'code_snippet'];
}
