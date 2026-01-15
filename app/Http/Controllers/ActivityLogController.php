<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ActivityLogController extends Controller
{
    public function index()
    {
        // 1. AUTO-DELETE: Burahin ang logs na mas matanda sa 6 months
        ActivityLog::where('created_at', '<', Carbon::now()->subMonths(6))->delete();

        // 2. FETCH: Kunin lahat ng natitirang logs (sorted newest first)
        // Tinanggal ko na ang take(100) para makuha lahat at gumana ang search sa frontend
        $logs = ActivityLog::with('user:id,name,role')
            ->latest()
            ->get();

        return response()->json($logs);
    }
}