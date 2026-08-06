<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataKader extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nim',
        'angkatan',
        'status_kaderisasi',
        'skills',
        'no_hp',
    ];

    /**
     * Get the user that owns the data kader.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
