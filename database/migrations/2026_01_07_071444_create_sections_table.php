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
        Schema::create('sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name'); // e.g., Newton, Euler
            $table->foreignUuid('strand_id')->constrained()->onDelete('cascade');
            $table->string('grade_level'); // 11 or 12
            $table->integer('capacity')->default(40);
            $table->timestamps();
            $table->softDeletes(); // 👈 RECYCLE BIN
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
