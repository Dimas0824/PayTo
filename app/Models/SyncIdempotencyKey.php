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
        'ref_type',
        'ref_id',
    ];
}
