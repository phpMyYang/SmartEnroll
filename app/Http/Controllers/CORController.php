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
        // Kukunin lang natin ang "1st" o "2nd" mula sa "1st Semester" para tumugma sa database
        $semKey = explode(' ', trim($student->semester))[0]; // "1st" or "2nd"

        // Get Subjects (Flexible Search)
        $subjects = Subject::where(function($q) use ($student) {
                $q->where('strand_id', $student->strand_id) // Specific Strand
                  ->orWhereNull('strand_id');               // OR Core Subject (Null)
            })
            ->where('grade_level', $student->grade_level)   // Match Grade Level
            ->where('semester', 'LIKE', "%{$semKey}%")     // Match "1st" kahit "1st Semester" ang nasa DB
            ->get();

        return response()->json([
            'student' => $student,
            'available_sections' => $sections,
            'suggested_subjects' => $subjects
        ]);
    }

    // 2. GENERATE SIGNED URL
    public function generateUrl(Request $request)
    {
        $tempId = Str::random(40);
        Cache::put('cor_data_' . $tempId, $request->all(), now()->addMinutes(5));

        // LOG ACTIVITY: DOWNLOAD COR
        // Kukunin natin ang pangalan ng student mula sa request data
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

        // Buuin ang grade_section para sa PDF View
        $grade = $data['info']['grade_level'] ?? 'N/A';
        $section = $data['info']['section_name'] ?? 'TBA';
        $data['info']['grade_section'] = "$grade / $section"; 

        $pdf = Pdf::loadView('pdf.cor', $data);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->stream('COR-' . ($data['info']['lrn'] ?? 'Student') . '.pdf');
    }
}