<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentSetting;
use App\Models\ActivityLog; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 

class EnrollmentSettingController extends Controller
{
    // GET CURRENT SETTINGS
    public function index()
    {
        return response()->json(EnrollmentSetting::first());
    }

    // CREATE / UPDATE SETTINGS
    public function store(Request $request)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'school_year' => 'required|string',
            'semester' => 'required|string',
        ]);

        // Singleton approach: Update existing or Create new if empty
        $setting = EnrollmentSetting::first();

        if ($setting) {
            $setting->update($validated);
            $action = 'update';
            $desc = "Updated Enrollment Schedule for SY {$validated['school_year']} - {$validated['semester']}";
        } else {
            $setting = EnrollmentSetting::create($validated);
            $action = 'create';
            $desc = "Created new Enrollment Schedule for SY {$validated['school_year']} - {$validated['semester']}";
        }

        // LOG ACTIVITY: SETTINGS SAVED
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'description' => $desc,
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Settings saved successfully!', 'data' => $setting]);
    }

    // TOGGLE MAINTENANCE MODE
    public function toggleMaintenance(Request $request)
    {
        $setting = EnrollmentSetting::first();
        if (!$setting) return response()->json(['message' => 'No settings found.'], 404);

        $setting->update(['maintenance_mode' => $request->maintenance_mode]);

        $status = $request->maintenance_mode ? "ENABLED" : "DISABLED";

        // LOG ACTIVITY: MAINTENANCE TOGGLE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'maintenance',
            'description' => "System Maintenance Mode was $status",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Maintenance mode updated!', 'status' => $setting->maintenance_mode]);
    }

    // DELETE SETTINGS (Reset)
    public function destroy($id)
    {
        $setting = EnrollmentSetting::first();
        if ($setting) {
            $sy = $setting->school_year; // Save info before delete
            // Option 1: Delete row (EnrollmentSetting::truncate())
            // Option 2: Nullify fields. Gagamitin natin delete row for now based sa prompt.
            $setting->delete();

            // LOG ACTIVITY: RESET
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'description' => "Reset Enrollment Schedule (Previously: SY $sy)",
                'ip_address' => request()->ip()
            ]);

            return response()->json(['message' => 'Schedule removed.']);
        }
        return response()->json(['message' => 'Nothing to delete.'], 404);
    }
}