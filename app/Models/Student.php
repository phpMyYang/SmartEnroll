<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'requirements' => 'array',
        'fees' => 'array',
        'date_of_birth' => 'date',
        'released_at' => 'datetime',
    ];

    // Relations
    public function strand() 
    { 
        return $this->belongsTo(Strand::class); 
    }
    
    public function section() 
    { 
        return $this->belongsTo(Section::class); 
    }
}