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
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code'); // e.g., MATH101
            $table->string('description');
            $table->string('grade_level');
            $table->foreignUuid('strand_id')->nullable()->constrained(); // Nullable kasi baka Core subject (pang lahat)
            $table->string('semester'); // 1st or 2nd
            $table->timestamps();
            $table->softDeletes(); // RECYCLE BIN
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
