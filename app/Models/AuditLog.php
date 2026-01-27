<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'actor_id',
        'event',
        'entity_type',
        'entity_id',
        'meta_json',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'meta_json' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    public function actor(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
