<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE `payments` MODIFY `status` ENUM('RECORDED','CONFIRMED') NOT NULL DEFAULT 'RECORDED'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `payments` MODIFY `status` ENUM('RECORDED') NOT NULL DEFAULT 'RECORDED'");
    }
};
