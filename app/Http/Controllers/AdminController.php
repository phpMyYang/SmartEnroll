<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Strand;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getAnalytics(Request $request)
    {
        // 1. FILTER LOGIC
        // Kunin ang year mula sa request (e.g., "2025-2026" -> "2025")
        // Kung walang input, gamitin ang current year
        $yearParam = $request->input('year'); 
        $filterYear = $yearParam ? substr($yearParam, 0, 4) : date('Y');

        // Helper para sa basic stats queries
        $applyFilter = function($query) use ($filterYear) {
            if ($filterYear) {
                $query->whereYear('created_at', $filterYear);
            }
        };

        // 2. STATS CARDS DATA
        $totalEnrolled = Student::where('status', 'enrolled')->tap($applyFilter)->count();
        $totalPending = Student::where('status', 'pending')->tap($applyFilter)->count();
        
        $totalFreshmen = Student::where('grade_level', '11')->where('status', 'enrolled')->tap($applyFilter)->count();
        $totalOldStudents = Student::where('grade_level', '12')->where('status', 'enrolled')->tap($applyFilter)->count();
        
        $totalGrade11 = Student::where('grade_level', '11')->tap($applyFilter)->count();
        $totalGrade12 = Student::where('grade_level', '12')->tap($applyFilter)->count();

        $totalMale = Student::where('gender', 'Male')->tap($applyFilter)->count();
        $totalFemale = Student::where('gender', 'Female')->tap($applyFilter)->count();

        // 3. PIE & DOUGHNUT CHARTS (Strands & Sections)
        $strands = Strand::withCount([
            'students' => function ($query) use ($filterYear) {
                if ($filterYear) $query->whereYear('created_at', $filterYear);
            },
            'sections' => function ($query) use ($filterYear) {
                if ($filterYear) $query->whereYear('created_at', $filterYear);
            }
        ])->get();

        $studentsPerStrand = $strands->map(fn($s) => ['label' => $s->code, 'value' => $s->students_count]);
        $sectionsPerStrand = $strands->map(fn($s) => ['label' => $s->code, 'value' => $s->sections_count]);

        // 4. BAR CHART (Demographics)
        $studentDemographics = [
            ['label' => 'Freshmen (G11)', 'value' => $totalFreshmen],
            ['label' => 'Old Students (G12)', 'value' => $totalOldStudents]
        ];

        // 5. MULTI-LINE GRAPH (Monthly Trends per Status)
        
        // Helper function: Kukuha ng count per month (1-12) at maglalagay ng 0 pag walang data
        $getMonthlyStats = function($status) use ($filterYear) {
            $data = Student::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->where('status', $status)
                ->whereYear('created_at', $filterYear)
                ->groupBy('month')
                ->pluck('count', 'month')
                ->toArray();

            $filledData = [];
            for ($m = 1; $m <= 12; $m++) {
                $filledData[] = $data[$m] ?? 0;
            }
            return $filledData;
        };

        $trendData = [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'enrolled' => $getMonthlyStats('enrolled'),
            'graduate' => $getMonthlyStats('graduate'),
            'dropped'  => $getMonthlyStats('dropped'), // 'dropped' ang nasa seeder
            'released' => $getMonthlyStats('released'),
        ];

        // 6. RETURN DATA
        return response()->json([
            'cards' => [
                'total_enrolled' => $totalEnrolled,
                'total_pending' => $totalPending,
                'total_freshmen' => $totalFreshmen,
                'total_old' => $totalOldStudents,
                'total_g11' => $totalGrade11,
                'total_g12' => $totalGrade12,
                'total_male' => $totalMale,
                'total_female' => $totalFemale,
            ],
            'charts' => [
                'students_per_strand' => $studentsPerStrand,
                'sections_per_strand' => $sectionsPerStrand,
                'demographics' => $studentDemographics,
                'enrollment_trend' => $trendData
            ]
        ]);
    }
}