<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // UUID
use Illuminate\Database\Eloquent\SoftDeletes; // Recycle Bin

class Strand extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'code',         // e.g., STEM
        'description'   // e.g., Science, Technology...
    ];

    // Relationships

    // Ang isang Strand ay may maraming Sections
    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    // Ang isang Strand ay may maraming Subjects
    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    // Ang isang Strand ay may maraming Students (Para sa Analytics)
    public function students()
    {
        return $this->hasMany(Student::class);
    }
}