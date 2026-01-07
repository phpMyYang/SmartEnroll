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
        // 1. KUNIN ANG YEAR MULA SA FRONTEND (e.g., "2025-2026" -> nagiging "2025")
        $yearParam = $request->input('year'); 
        $filterYear = $yearParam ? substr($yearParam, 0, 4) : null; // Kukunin lang ang first 4 digits (Start Year)

        // Helper Function para hindi paulit-ulit ang code
        // Ito ang magdadagdag ng "WHERE created_at = 2025" kung may filter
        $applyFilter = function($query) use ($filterYear) {
            if ($filterYear) {
                $query->whereYear('created_at', $filterYear);
            }
        };

        // 2. BASIC STATS (With Filter)
        $totalEnrolled = Student::where('status', 'enrolled')->tap($applyFilter)->count();
        $totalPending = Student::where('status', 'pending')->tap($applyFilter)->count();
        
        $totalFreshmen = Student::where('grade_level', '11')->where('status', 'enrolled')->tap($applyFilter)->count();
        $totalOldStudents = Student::where('grade_level', '12')->where('status', 'enrolled')->tap($applyFilter)->count();
        
        $totalGrade11 = Student::where('grade_level', '11')->tap($applyFilter)->count();
        $totalGrade12 = Student::where('grade_level', '12')->tap($applyFilter)->count();

        $totalMale = Student::where('gender', 'Male')->tap($applyFilter)->count();
        $totalFemale = Student::where('gender', 'Female')->tap($applyFilter)->count();

        // 3. CHARTS (With Relationship Filter)
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

        // 4. DEMOGRAPHICS
        $studentDemographics = [
            ['label' => 'Freshmen (G11)', 'value' => $totalFreshmen],
            ['label' => 'Old Students (G12)', 'value' => $totalOldStudents]
        ];

        // 5. TREND LINE (Filtered by Year)
        $trendQuery = Student::select(
                DB::raw('COUNT(id) as count'), 
                DB::raw('MONTHNAME(created_at) as month_name'), 
                DB::raw('MONTH(created_at) as month_num')
            )
            ->where('status', 'enrolled')
            ->groupByRaw('MONTHNAME(created_at), MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)');

        if ($filterYear) {
            $trendQuery->whereYear('created_at', $filterYear);
        } else {
            $trendQuery->whereYear('created_at', date('Y')); // Default to Current Year pag walang filter
        }

        $enrolleesTrend = $trendQuery->get();

        // Empty data handler
        if ($enrolleesTrend->isEmpty()) {
            $enrolleesTrend = [['month_name' => 'No Data', 'count' => 0, 'month_num' => 0]];
        }

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
                'enrollment_trend' => $enrolleesTrend
            ]
        ]);
    }
}