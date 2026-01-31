<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'barcode',
        'price',
        'discount',
        'cost',
        'uom',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'discount' => 'decimal:2',
            'cost' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function stockItem(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(StockItem::class);
    }

    public function saleItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}
