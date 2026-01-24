<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Section;
use App\Models\Subject;
use App\Models\ActivityLog; 
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CORController extends Controller
{
    // 1. GET DATA FOR MODAL (Populate Dropdowns & Inputs)
    public function getCORData($studentId)
    {
        $student = Student::with(['strand', 'section'])->findOrFail($studentId);

        // FIX: ADD 'withCount' PARA MAKUHA ANG ENROLLED COUNT
        $sections = Section::where('strand_id', $student->strand_id)
            ->where('grade_level', $student->grade_level)
            ->withCount(['students as enrolled_count' => function ($query) {
                $query->where('status', 'enrolled'); // Bilangin lang ang 'Enrolled' status
            }])
            ->get();

        // FIX: CLEAN SEMESTER DATA
        $semKey = explode(' ', trim($student->semester))[0]; 

        // Get Subjects...
        $subjects = Subject::where(function($q) use ($student) {
                $q->where('strand_id', $student->strand_id)
                  ->orWhereNull('strand_id');
            })
            ->where('grade_level', $student->grade_level)
            ->where('semester', 'LIKE', "%{$semKey}%")
            ->get();

        return response()->json([
            'student' => $student,
            'available_sections' => $sections,
            'suggested_subjects' => $subjects
        ]);
    }

    // 2. GENERATE SIGNED URL (WITH SAFETY CHECK)
    public function generateUrl(Request $request)
    {
        // WRAP SA TRANSACTION PARA SAFE
        return DB::transaction(function () use ($request) {
            
            $lrn = $request->input('info.lrn');
            $sectionId = $request->input('info.section_id');
            $student = Student::where('lrn', $lrn)->first();

            // --- START: CRITICAL SAFETY CHECK ---
            if ($student && $sectionId && $student->section_id != $sectionId) {
                
                // 1. LOCK THE TARGET SECTION
                $section = Section::where('id', $sectionId)->lockForUpdate()->first();

                if ($section) {
                    // 2. COUNT REAL-TIME ENROLLED
                    $currentEnrolled = $section->students()->where('status', 'enrolled')->count();

                    // 3. CHECK CAPACITY
                    if ($currentEnrolled >= $section->capacity) {
                        // STOP PROCESS & RETURN ERROR
                        return response()->json([
                            'message' => "FAILED: Section '{$section->name}' is FULL ({$currentEnrolled}/{$section->capacity}). Cannot update section via COR."
                        ], 422);
                    }

                    // 4. UPDATE IF SAFE
                    $student->update(['section_id' => $sectionId]);

                    // Optional: Log this specific action
                    ActivityLog::create([
                        'user_id' => Auth::id(),
                        'action' => 'update',
                        'description' => "Updated section to {$section->name} via COR for: {$student->last_name}",
                        'ip_address' => $request->ip()
                    ]);
                }
            }
            // --- END: CRITICAL SAFETY CHECK ---

            // PROCEED TO GENERATE URL (Existing Code)
            $tempId = Str::random(40);
            Cache::put('cor_data_' . $tempId, $request->all(), now()->addMinutes(5));

            $studentName = $request->input('info.name') ?? 'Student';
            
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'download',
                'description' => "Downloaded COR for student: {$studentName}",
                'ip_address' => $request->ip()
            ]);

            $url = URL::temporarySignedRoute(
                'cor.print', 
                now()->addMinutes(5), 
                ['id' => $tempId]
            );

            return response()->json(['url' => $url]);
        });
    }

    // 3. PRINT PDF
    public function printCOR($tempId)
    {
        $data = Cache::get('cor_data_' . $tempId);

        if (!$data) {
            abort(404, 'Link expired or invalid.');
        }

        // Logo Logic
        $logoData = null;
        try {
            $path = public_path('images/logo.png');
            if (file_exists($path)) {
                $img = file_get_contents($path);
                $logoData = 'data:image/png;base64,' . base64_encode($img);
            }
        } catch (\Exception $e) {}

        $data['logo'] = $logoData;
        $data['printed_at'] = now()->format('F d, Y h:i A');

        // Grade & Section Display
        $grade = $data['info']['grade_level'] ?? 'N/A';
        $section = $data['info']['section_name'] ?? 'TBA';
        $data['info']['grade_section'] = "$grade / $section"; 

        $pdf = Pdf::loadView('pdf.cor', $data);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('COR-' . ($data['info']['lrn'] ?? 'Student') . '.pdf');
    }
}