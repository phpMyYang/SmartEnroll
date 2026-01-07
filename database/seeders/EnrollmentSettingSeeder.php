<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EnrollmentSetting;
use Carbon\Carbon;

class EnrollmentSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EnrollmentSetting::create([
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonths(2),
            'school_year' => '2025-2026',
            'semester' => '1st',
            'maintenance_mode' => false,
        ]);
    }
}