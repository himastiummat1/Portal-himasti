<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    
    protected $fillable = ['nama_event', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'status'];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
