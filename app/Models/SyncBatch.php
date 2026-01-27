<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncBatch extends Model
{
    use HasFactory;

    protected $table = 'sync_batches';

    protected $fillable = [
        'batch_key',
        'status',
        'payload_json',
    ];

    protected function casts(): array
    {
        return [
            'payload_json' => 'array',
        ];
    }
}
