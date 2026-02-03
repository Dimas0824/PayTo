<?php

/**
 * Migration to store refund headers for sales transactions.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');
            $table->foreignId('requested_by')->constrained('users');
            $table->foreignId('approved_by')->constrained('users');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('reason');
            $table->timestamp('occurred_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
