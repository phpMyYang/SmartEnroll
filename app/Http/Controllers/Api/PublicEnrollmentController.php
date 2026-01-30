<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Strand;
use App\Models\EnrollmentSetting; // Gamitin ang tamang Model name base sa migration mo
use Illuminate\Support\Facades\Mail;
use App\Mail\EnrollmentSubmitted;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class PublicEnrollmentController extends Controller
{
    // 1. GET SETTINGS (Para malaman ng frontend kung OPEN o CLOSED)
    public function getSettings()
    {
        // Kukunin ang pinakabagong settings
        // Base sa migration mo: enrollment_settings table
        $settings = \DB::table('enrollment_settings')->first(); 
        return response()->json($settings);
    }

    // 2. GET STRANDS
    public function getStrands()
    {
        return response()->json(Strand::all());
    }

    // 3. CHECK LRN (Gatekeeper)
    public function checkLrn(Request $request)
    {
        $validator = Validator::make($request->all(), ['lrn' => 'required|digits:12']);
        if ($validator->fails()) return response()->json(['message' => 'Invalid LRN format'], 422);

        $student = Student::where('lrn', $request->lrn)->first();

        if (!$student) {
            return response()->json(['message' => 'LRN not found'], 404); // 404 = New Student
        }

        return response()->json($student); // 200 = Old Student
    }

    // 4. CHECK STATUS (Search Bar)
    public function checkStatus(Request $request)
    {
        $request->validate(['lrn' => 'required|digits:12']);
        $student = Student::with(['strand', 'section'])
            ->where('lrn', $request->lrn)
            ->first();

        if (!$student) return response()->json(['message' => 'Student record not found.'], 404);

        return response()->json($student);
    }

    // 5. ENROLL NEW STUDENT
    public function enrollNew(Request $request)
    {
        $settings = \DB::table('enrollment_settings')->first();
        
        // CHECK IF OPEN
        if (!$this->isEnrollmentOpen($settings)) {
            return response()->json(['message' => 'Enrollment is currently closed.'], 403);
        }

        // VALIDATION
        // Tinanggal ko na ang 'is_employed' dito para hindi isama sa saving
        $validated = $request->validate([
            // --- PERSONAL ---
            'last_name'         => 'required|string',
            'first_name'        => 'required|string',
            'middle_name'       => 'nullable|string',
            'suffix'            => 'nullable|string',
            'date_of_birth'     => 'required|date',
            'age'               => 'required|integer',  
            'gender'            => 'required|string',
            'place_of_birth'    => 'required|string',
            'citizenship'       => 'required|string',
            'civil_status'      => 'required|string',
            'religion'          => 'required|string',
            
            // --- CONTACT ---
            'email'             => 'required|email|unique:students,email',
            'contact_number'    => 'required|string',
            'home_address'      => 'required|string',
            'provincial_address'=> 'nullable|string',

            // --- ACADEMIC ---
            'lrn'                       => 'required|digits:12|unique:students,lrn',
            'current_school_attended'   => 'required|string',
            'general_average'           => 'required|numeric|between:75,100',
            'strand_id'                 => 'required|string', // UUID String
            'learning_modality'         => 'required|string',
            
            // --- EMPLOYMENT ---
            // NOTE: Tinanggal natin ang 'is_employed' dito.
            // Ang 'employer_name' at 'contact' lang ang isa-save natin.
            'employer_name'     => 'nullable|string',
            'employer_contact'  => 'nullable|string',

            // --- FAMILY ---
            'father_name'           => 'nullable|string',
            'father_occupation'     => 'nullable|string',
            'father_contact'        => 'nullable|string',
            'mother_name'           => 'nullable|string',
            'mother_occupation'     => 'nullable|string',
            'mother_contact'        => 'nullable|string',
            'guardian_name'         => 'required|string',
            'guardian_occupation'   => 'required|string',
            'guardian_contact'      => 'required|string',
        ]);

        // AUTO-FILL SYSTEM FIELDS
        $validated['status'] = 'pending';
        $validated['grade_level'] = '11'; 
        $validated['section_id'] = null;
        $validated['school_year'] = $settings->school_year;
        $validated['semester'] = $settings->semester;
        
        // Requirements Checklist
        $validated['requirements'] = json_encode([
            'psa' => false, 
            'form137' => false, 
            'good_moral' => false, 
            'diploma' => false,
            'card' => false, 
            'picture' => false
        ]);

        // CREATE STUDENT
        // Dahil wala na sa $validated ang 'is_employed', 
        // hindi na magrereklamo ang database.
        $student = Student::create($validated);

        // SEND EMAIL
        Mail::to($student->email)->send(new EnrollmentSubmitted($student));

        return response()->json(['message' => 'Application submitted!', 'student' => $student], 201);
    }

    // 6. ENROLL OLD STUDENT (UPDATE)
    public function enrollOld(Request $request, $id)
    {
        $settings = \DB::table('enrollment_settings')->first();
        
        if (!$this->isEnrollmentOpen($settings)) {
            return response()->json(['message' => 'Enrollment is currently closed.'], 403);
        }

        $student = Student::findOrFail($id);

        // --- LOGIC: Grade Increment & Section Reset ---
        
        $prevGrade = $student->grade_level;
        $prevSem = $student->semester;
        
        $newGrade = $prevGrade;
        $newSection = $student->section_id;

        // SCENARIO 1: Grade 11 & 2nd Sem -> Promote to Grade 12, Reset Section
        if ($prevGrade == '11' && $prevSem == '2nd Semester') {
            $newGrade = '12';
            $newSection = null;
        }
        // SCENARIO 2: Grade 11/12 & 1st Sem -> Retain Grade, Retain Section
        elseif (($prevGrade == '11' || $prevGrade == '12') && $prevSem == '1st Semester') {
            $newGrade = $prevGrade;
            $newSection = $student->section_id; // Hindi magbabago
        }

        // UPDATE DATA
        // FIX: TANGGALIN ANG MGA FIELDS NA WALA SA DATABASE
        $data = $request->except(['lrn', 'section_name', 'is_employed']); 

        $data['grade_level'] = $newGrade;
        $data['section_id'] = $newSection;
        $data['status'] = 'pending'; // Always pending upon re-enrollment
        $data['school_year'] = $settings->school_year;
        $data['semester'] = $settings->semester;

        $student->update($data);

        // SEND EMAIL
        Mail::to($student->email)->send(new EnrollmentSubmitted($student));

        return response()->json(['message' => 'Enrollment updated successfully!']);
    }

    // HELPER: Check if Enrollment is Open
    private function isEnrollmentOpen($settings)
    {
        if (!$settings) return false;
        if ($settings->maintenance_mode) return false;
        
        $now = Carbon::now()->format('Y-m-d');
        return ($now >= $settings->start_date && $now <= $settings->end_date);
    }
}