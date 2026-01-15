<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'code',         // e.g., MATH101
        'description',  // e.g., General Mathematics
        'grade_level',  // 11 or 12
        'strand_id',    // Kung NULL, ibig sabihin "Core Subject" (Pang lahat)
        'semester'      // 1st or 2nd
    ];

    // Relationships

    public function strand()
    {
        return $this->belongsTo(Strand::class);
    }
}