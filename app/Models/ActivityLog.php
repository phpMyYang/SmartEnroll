<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',      // Sinong gumawa?
        'action',       // Created, Updated, Deleted, Logged In
        'description',  // Detalye (e.g., "Deleted student Juan Dela Cruz")
        'ip_address'
    ];

    // Relationships

    // Gusto nating malaman kung sinong User ang gumawa ng action
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}