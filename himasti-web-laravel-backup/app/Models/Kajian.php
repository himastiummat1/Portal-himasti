<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Kajian extends Model
{
    protected $fillable = ['tema', 'pemateri', 'tanggal', 'lokasi', 'status', 'deskripsi'];
}
