<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryRecommendation extends Model
{
    use HasFactory;

    protected $table = 'inventory_recommendations';

    protected $fillable = [
        'product_id',
        'avg_daily_sales_7d',
        'avg_daily_sales_30d',
        'lead_time_days',
        'safety_stock',
        'reorder_point',
        'suggested_reorder_qty',
        'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'avg_daily_sales_7d' => 'decimal:3',
            'avg_daily_sales_30d' => 'decimal:3',
            'safety_stock' => 'decimal:3',
            'reorder_point' => 'decimal:3',
            'suggested_reorder_qty' => 'decimal:3',
            'computed_at' => 'datetime',
        ];
    }

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
