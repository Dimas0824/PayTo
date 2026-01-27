<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncIdempotencyKey extends Model
{
    use HasFactory;

    protected $table = 'sync_idempotency_keys';

    protected $fillable = [
        'key',
        'used_at',
    ];

    protected function casts(): array
    {
        return [
            'used_at' => 'datetime',
        ];
    }
}
