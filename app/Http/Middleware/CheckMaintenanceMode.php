<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\EnrollmentSetting;
use Illuminate\Support\Facades\Auth;

class CheckMaintenanceMode
{
    public function handle(Request $request, Closure $next): Response
    {
        $settings = EnrollmentSetting::first();

        // Kung NAKA-ON ang Maintenance at HINDI Admin ang user
        if ($settings && $settings->maintenance_mode) {
            $user = Auth::guard('sanctum')->user(); // Check API user

            // Kung hindi naka-login o hindi Admin
            if (!$user || !in_array($user->role, ['admin'])) {
                return response()->json([
                    'message' => 'System is under maintenance.',
                    'maintenance' => true,
                    'retry_after' => 3600 // 1 hour
                ], 503);
            }
        }

        return $next($request);
    }
}