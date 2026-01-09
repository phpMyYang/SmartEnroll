<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class SectionController extends Controller
{
    // 1. GET SECTIONS (May count ng enrolled students)
    public function index()
    {
        return Section::with('strand')
            ->withCount(['students as enrolled_count' => function ($query) {
                $query->where('status', 'enrolled'); // Bilangin lang ang enrolled
            }])
            ->latest()
            ->get();
    }

    // 2. MASTER LIST DATA (Para sa Modal Preview)
    public function masterList($id)
    {
        $section = Section::with('strand')->findOrFail($id);

        // Filter: Enrolled only & Sort Alphabetical
        $students = $section->students()
            ->where('status', 'enrolled')
            ->orderBy('last_name', 'asc')
            ->get();

        $males = $students->where('gender', 'Male')->values();
        $females = $students->where('gender', 'Female')->values();

        // ✅ FETCH DYNAMIC SETTINGS
        // Kukunin ang active School Year at Semester sa database
        $settings = \App\Models\EnrollmentSetting::first();
        
        // Fallback (kung sakaling walang laman ang settings table)
        $schoolYear = $settings ? $settings->school_year : date('Y') . '-' . (date('Y') + 1);
        $semester = $settings ? $settings->semester : '1st Semester';

        return response()->json([
            'section' => $section,
            'males' => $males,
            'females' => $females,
            'school_year' => $schoolYear, // ✅ DYNAMIC NA
            'semester' => $semester       // ✅ DYNAMIC NA
        ]);
    }

 // ✅ BAGONG FUNCTION: Taga-gawa ng Signed URL (Valid for 1 Minute)
    public function generatePrintUrl($id)
    {
        $section = Section::findOrFail($id);
        $user = auth()->user()->id; // Kunin ang ID ng user na nag-request

        // Gumawa ng URL na may "Signature"
        $url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'masterlist.print', // Route Name
            now()->addMinute(), // Expiration
            [
                'section' => $section->id, 
                'user' => $user
            ]
        );

        return response()->json(['url' => $url]);
    }

    // ✅ UPDATED PRINT FUNCTION (Dynamic School Year & Semester)
    public function printMasterList($sectionId, $userId)
    {
        if (ob_get_length()) ob_end_clean(); // Safety Clean

        try {
            // 1. Fetch Section Data
            $section = Section::with('strand')->findOrFail($sectionId);
            
            // 2. Fetch User (Printed By)
            $userObj = \App\Models\User::find($userId);
            $printedBy = $userObj ? $userObj->name : 'Administrator';

            // 3. Fetch Active Enrollment Settings (Dito tayo kukuha ng SY at Sem)
            // Assumed model name: EnrollmentSetting
            $settings = \App\Models\EnrollmentSetting::first(); 

            // Fallback values kung sakaling walang laman ang settings table
            $schoolYear = $settings ? $settings->school_year : date('Y') . '-' . (date('Y') + 1);
            $semester = $settings ? $settings->semester : '1st Semester';

            // 4. Fetch Students
            $students = $section->students()
                ->where('status', 'enrolled')
                ->orderBy('last_name', 'asc')
                ->get();

            $males = $students->where('gender', 'Male')->values();
            $females = $students->where('gender', 'Female')->values();

            $data = [
                'section' => $section,
                'males' => $males,
                'females' => $females,
                'schoolYear' => $schoolYear, // ✅ DYNAMIC NA
                'semester' => $semester,     // ✅ DYNAMIC NA
                'printedBy' => $printedBy
            ];

            // Load View
            $pdf = Pdf::loadView('pdf.masterlist', $data);
            $pdf->setPaper('a4', 'portrait');

            return $pdf->stream('MasterList-' . $section->name . '.pdf');

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // (RETAIN STORE, UPDATE, DESTROY METHODS HERE...)
    public function store(Request $request) 
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'strand_id' => 'required|exists:strands,id',
            'grade_level' => 'required|in:11,12',
            'capacity' => 'required|integer|min:1',
        ]);

        $section = Section::create($validated);

        return response()->json(['message' => 'Created', 'section' => $section]);
    }

    public function update(Request $request, $id) 
    {
        $section = Section::find($id);

        if(!$section) return response()->json(['message'=>'Not found'], 404);
        $section->update($request->all());

        return response()->json(['message' => 'Updated', 'section' => $section]);
    }

    public function destroy($id) 
    {
        $section = Section::find($id);

        if($section) { 
            $section->delete(); 
            return response()->json(['message'=>'Deleted']); 
        }
        
        return response()->json(['message'=>'Not found'], 404);
    }
}