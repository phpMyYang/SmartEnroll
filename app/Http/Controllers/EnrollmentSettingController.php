<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentSetting;
use Illuminate\Http\Request;

class EnrollmentSettingController extends Controller
{
    public function index()
    {
        // Kunin ang active settings (unang row)
        $settings = EnrollmentSetting::first();

        // Kung walang laman ang database, magbigay ng default
        if (!$settings) {
            return response()->json([
                'school_year' => date('Y') . '-' . (date('Y') + 1),
                'semester' => '1st Semester'
            ]);
        }

        return response()->json($settings);
    }
}