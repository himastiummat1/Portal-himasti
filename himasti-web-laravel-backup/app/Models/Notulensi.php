<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Notulensi extends Model
{
    protected $fillable = ['agenda', 'tanggal', 'pemimpin_rapat', 'hasil_rapat', 'jumlah_hadir'];
}
