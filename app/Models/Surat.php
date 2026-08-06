<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Surat extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nomor_surat',
        'jenis_surat',
        'perihal',
        'status',
        'file_pdf',
    ];

    /**
     * Get the user that owns the surat.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
