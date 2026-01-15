<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();

            // Identifiers
            $table->string('lrn')->unique(); // Main ID
            
            // Personal Info
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->date('date_of_birth');
            $table->integer('age');
            $table->string('gender');
            $table->string('place_of_birth');
            $table->string('citizenship');
            $table->string('civil_status');
            $table->string('religion');
            
            // Contact Info
            $table->text('home_address');
            $table->text('provincial_address')->nullable();
            $table->string('email')->unique();
            $table->string('contact_number');
            
            // Academic Info
            $table->string('current_school_attended')->nullable();
            $table->foreignUuid('strand_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('section_id')->nullable()->constrained()->onDelete('set null');
            $table->string('grade_level');
            $table->string('semester'); 
            $table->string('school_year'); // New Field

            // Employment & Family
            $table->string('employer_name')->nullable();
            $table->string('employer_contact')->nullable();
            $table->string('father_name')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('father_contact')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->string('mother_contact')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_occupation')->nullable();
            $table->string('guardian_contact')->nullable();

            // Data Fields
            $table->json('requirements')->nullable();
            $table->json('fees')->nullable(); // Para sa COR Editing

            // Status & Logs
            $table->string('status')->default('pending');
            $table->string('previous_status')->nullable(); // Para sa Reset
            
            // Release Info
            $table->string('released_by')->nullable();
            $table->timestamp('released_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};