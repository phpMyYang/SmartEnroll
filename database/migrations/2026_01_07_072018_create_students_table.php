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
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // 🆔 System Identifiers
            $table->string('reference_number')->unique()->nullable(); // Generated upon submission
            $table->string('lrn')->nullable()->unique();
            
            // 👤 Personal Information
            $table->string('last_name');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('suffix')->nullable();
            $table->date('date_of_birth');
            $table->integer('age');
            $table->string('gender'); // Male/Female
            $table->string('place_of_birth');
            $table->string('citizenship');
            $table->string('civil_status'); // Single/Married
            $table->string('religion');
            
            // 🏠 Contact Information
            $table->text('home_address');
            $table->text('provincial_address')->nullable();
            $table->string('email')->unique(); // Student Email
            $table->string('contact_number');
            
            // 🏫 Academic Information
            $table->string('current_school_attended')->nullable();
            $table->foreignUuid('strand_id')->constrained()->onDelete('cascade'); // Relasyon sa Strand Table
            $table->foreignUuid('section_id')->nullable()->constrained()->onDelete('set null'); // Relasyon sa Section Table
            $table->string('grade_level'); // 11 or 12
            $table->string('semester'); // 1st or 2nd

            // 💼 Employment Info (Nullable kasi hindi naman lahat working)
            $table->string('employer_name')->nullable();
            $table->string('employer_contact')->nullable();

            // 👪 Family Background
            $table->string('father_name')->nullable();
            $table->string('father_occupation')->nullable();
            $table->string('father_contact')->nullable();

            $table->string('mother_name')->nullable();
            $table->string('mother_occupation')->nullable();
            $table->string('mother_contact')->nullable();

            $table->string('guardian_name')->nullable();
            $table->string('guardian_occupation')->nullable();
            $table->string('guardian_contact')->nullable();

            // 🚦 System Status
            // Options: pending, enrolled, graduate, dropped, released
            $table->string('status')->default('pending'); 

            $table->timestamps();
            $table->softDeletes(); // 🗑️ Recycle Bin Support
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
