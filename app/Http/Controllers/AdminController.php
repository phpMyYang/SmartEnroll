<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Strand;
use App\Models\EnrollmentSetting; 
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getAnalytics(Request $request)
    {
        // 1. SMART FILTER LOGIC
        $search = $request->input('year');
        $activeSetting = EnrollmentSetting::first();
        $defaultSY = $activeSetting ? $activeSetting->school_year : date('Y').'-'.(date('Y')+1);
        $filterValue = $search ?: $defaultSY;

        // QUERY HELPER
        $applyFilter = function($query) use ($filterValue) {
            if (preg_match('/^\d{4}-\d{4}$/', $filterValue)) {
                $query->where('school_year', $filterValue);
            } elseif (is_numeric($filterValue) && strlen($filterValue) == 4) {
                $query->where(function($q) use ($filterValue) {
                    $q->whereYear('created_at', $filterValue)
                      ->orWhereYear('updated_at', $filterValue)
                      ->orWhereYear('released_at', $filterValue)
                      ->orWhere('school_year', 'LIKE', "%$filterValue%");
                });
            } else {
                $query->where('school_year', $filterValue);
            }
        };

        // 2. STATS CARDS (All Filtered now)
        $totalEnrolled = Student::where('status', 'enrolled')->tap($applyFilter)->count();
        $totalPending = Student::whereIn('status', ['pending', 'passed'])->tap($applyFilter)->count();
        $totalFreshmen = Student::where('grade_level', '11')->where('status', 'enrolled')->tap($applyFilter)->count();
        $totalOldStudents = Student::where('grade_level', '12')->where('status', 'enrolled')->tap($applyFilter)->count();
        $totalMale = Student::where('gender', 'Male')->where('status', 'enrolled')->tap($applyFilter)->count();
        $totalFemale = Student::where('gender', 'Female')->where('status', 'enrolled')->tap($applyFilter)->count();
        
        // CHANGED: Replaced Graduates & Dropouts with Modality Stats
        // Kinukuha lang natin ang mga 'enrolled' na students para sa stats na ito
        $totalFaceToFace = Student::where('status', 'enrolled')
            ->where('learning_modality', 'Face-to-Face')
            ->tap($applyFilter)
            ->count();

        $totalModular = Student::where('status', 'enrolled')
            ->where('learning_modality', 'Modular')
            ->tap($applyFilter)
            ->count();

        // 3. CHARTS DATA
        $strands = Strand::withCount([
            'students' => function ($query) use ($applyFilter) {
                $query->where('status', 'enrolled'); 
                $applyFilter($query);
            }
        ])->get();

        $studentsPerStrand = $strands->map(fn($s) => ['label' => $s->code, 'value' => $s->students_count]);
        $sectionsPerStrand = $strands->map(fn($s) => ['label' => $s->code, 'value' => $s->sections()->count()]);

        $studentDemographics = [
            ['label' => 'Freshmen (G11)', 'value' => $totalFreshmen],
            ['label' => 'Old Students (G12)', 'value' => $totalOldStudents]
        ];

        // 4. TREND DATA
        $getMonthlyStats = function($status) use ($applyFilter) {
            $query = Student::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->where('status', $status);
            $applyFilter($query);
            $data = $query->groupBy('month')->pluck('count', 'month')->toArray();
            
            $filledData = [];
            for ($m = 1; $m <= 12; $m++) $filledData[] = $data[$m] ?? 0;
            return $filledData;
        };

        $trendData = [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'enrolled' => $getMonthlyStats('enrolled'),
            'pending'  => $getMonthlyStats('pending'),
            'released' => $getMonthlyStats('released'),
            'dropped'  => $getMonthlyStats('dropped'),
            'graduate' => $getMonthlyStats('graduate'),
        ];

        return response()->json([
            'filter_used' => $filterValue,
            'cards' => [
                'total_enrolled' => $totalEnrolled,
                'total_pending' => $totalPending,
                'total_g11' => $totalFreshmen,
                'total_g12' => $totalOldStudents,
                'total_male' => $totalMale,
                'total_female' => $totalFemale,
                // UPDATED KEYS
                'total_f2f' => $totalFaceToFace,    
                'total_modular' => $totalModular,    
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