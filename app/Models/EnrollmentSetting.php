<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentSetting extends Model
{
    use HasFactory;

    // Walang UUID o SoftDeletes kasi settings lang to
    protected $fillable = [
        'start_date',
        'end_date',
        'school_year',      // e.g., 2025-2026
        'semester',         // 1st Semester
        'maintenance_mode'  // true or false
    ];

    // ✅ Casting (Para automatic na Date object ang makuha natin, hindi string)
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'maintenance_mode' => 'boolean',
    ];
}