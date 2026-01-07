<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // ✅ UUID Support
use Illuminate\Database\Eloquent\SoftDeletes; // ✅ Recycle Bin Support

class Student extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    // Pinapayagan nating i-mass assign ang mga data na ito
    protected $fillable = [
        'reference_number',
        'lrn',
        'last_name',
        'first_name',
        'middle_name',
        'suffix',
        'date_of_birth',
        'age',
        'gender',
        'place_of_birth',
        'citizenship',
        'civil_status',
        'religion',
        'home_address',
        'provincial_address',
        'email',
        'contact_number',
        'current_school_attended',
        'strand_id',
        'section_id',
        'grade_level',
        'semester',
        'employer_name',
        'employer_contact',
        'father_name',
        'father_occupation',
        'father_contact',
        'mother_name',
        'mother_occupation',
        'mother_contact',
        'guardian_name',
        'guardian_occupation',
        'guardian_contact',
        'status',
    ];

    // ✅ Relationships (Para sa Analytics at Reports)
    
    // Ang student ay kabilang sa isang Strand
    public function strand()
    {
        return $this->belongsTo(Strand::class);
    }

    // Ang student ay kabilang sa isang Section
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
}