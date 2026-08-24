<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompetitionInfo extends Model
{
    protected $fillable = ['title', 'type', 'organizer', 'description', 'link', 'deadline', 'poster'];
}
