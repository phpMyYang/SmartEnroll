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

class CORController extends Controller
{
    // 1. GET DATA FOR MODAL (Populate Dropdowns & Inputs)
    public function getCORData($studentId)
    {
        $student = Student::with(['strand', 'section'])->findOrFail($studentId);

        // Get Sections for Dropdown (Same Strand & Grade)
        $sections = Section::where('strand_id', $student->strand_id)
            ->where('grade_level', $student->grade_level)
            ->get();

        // FIX: CLEAN SEMESTER DATA
        $semKey = explode(' ', trim($student->semester))[0]; // "1st" or "2nd"

        // Get Subjects (Flexible Search)
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

    // 2. GENERATE SIGNED URL (AND SAVE SECTION)
    public function generateUrl(Request $request)
    {
        // --- START: AUTO-SAVE SECTION LOGIC ---
        // Kukunin natin ang LRN at Section ID galing sa COR Modal Form
        $lrn = $request->input('info.lrn');
        $sectionId = $request->input('info.section_id');

        if ($lrn && $sectionId) {
            // Hanapin ang student gamit ang LRN
            $student = Student::where('lrn', $lrn)->first();
            
            // Kung nahanap at magkaiba ang section, i-update natin
            if ($student && $student->section_id != $sectionId) {
                $student->update(['section_id' => $sectionId]);
                
                // (Optional) Pwede ring mag-log dito kung gusto mong ma-track ang pag-assign ng section via COR
            }
        }
        // --- END: AUTO-SAVE SECTION LOGIC ---

        $tempId = Str::random(40);
        Cache::put('cor_data_' . $tempId, $request->all(), now()->addMinutes(5));

        // LOG ACTIVITY: DOWNLOAD COR
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