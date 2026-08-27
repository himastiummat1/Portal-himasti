<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Klub extends Model
{
    protected $fillable = ['nama_klub', 'ketua_klub', 'jadwal_latihan', 'deskripsi'];
}
