<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncBatch extends Model
{
    use HasFactory;

    protected $table = 'sync_batches';

    protected $fillable = [
        'device_id',
        'batch_uuid',
        'pushed_at',
        'status',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'pushed_at' => 'datetime',
        ];
    }
}
