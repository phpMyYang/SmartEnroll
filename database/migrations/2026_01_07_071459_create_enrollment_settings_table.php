<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollment_settings', function (Blueprint $table) {
            $table->id(); // Single row lang usually ito
            $table->date('start_date');
            $table->date('end_date');
            $table->string('school_year'); // e.g., 2025-2026
            $table->string('semester'); // 1st or 2nd
            $table->boolean('maintenance_mode')->default(false); // 👈 MAINTENANCE MODE TOGGLE
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_settings');
    }
};
