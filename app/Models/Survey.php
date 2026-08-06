<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Survey extends Model
{
    protected $fillable = ['judul', 'link_gform', 'target_responden', 'status', 'deskripsi'];
}
