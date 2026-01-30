<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Strand;
use App\Models\Section;
use App\Models\ActivityLog; // Import ActivityLog
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth; // Import Auth

class ReportController extends Controller
{
    // GENERATE PDF SUMMARY (Formal Report)
    public function generateSummary(Request $request)
    {
        $sy = $request->input('school_year');
        $type = $request->input('type'); 
        $registrarName = $request->input('registrar', 'N/A');

        // 1. Base Query
        $query = Student::where('school_year', $sy);

        // 2. Filter by Report Type (Existing Logic...)
        $title = "";
        $description = "";

        if ($type === 'enrollment') {
            $query->where('status', 'enrolled');
            $title = "OFFICIAL ENROLLMENT SUMMARY REPORT";
            $description = "This report summarizes the total number of officially enrolled students for the specified School Year.";
        } elseif ($type === 'pending') {
            $query->whereIn('status', ['pending', 'passed']);
            $title = "PENDING APPLICATIONS REPORT";
            $description = "This document lists the statistical summary of students with Pending or Passed status awaiting official enrollment.";
        } elseif ($type === 'dropouts') {
            $query->where('status', 'dropped');
            $title = "STUDENT DROPOUT REPORT";
            $description = "This report details the number of students who have dropped out or withdrawn from the institution.";
        } elseif ($type === 'graduates') { 
            $query->where('status', 'graduate');
            $title = "OFFICIAL LIST OF GRADUATES REPORT";
            $description = "This document certifies the summary count of students who have successfully graduated.";
        } elseif ($type === 'released') {
            $query->where('status', 'released');
            $title = "OFFICIAL LIST OF RELEASED STUDENTS";
            $description = "This document lists the students who have transferred out or were officially released from the institution.";
        }

        // 3. Gather Data
        $students = $query->get();

        // 4. CALCULATE GRADE LEVEL BREAKDOWN WITH MODALITY
        $gradeBreakdown = [
            '11' => [
                'total' => $students->where('grade_level', '11')->count(),
                'f2f' => $students->where('grade_level', '11')->where('learning_modality', 'Face-to-Face')->count(),
                'modular' => $students->where('grade_level', '11')->where('learning_modality', 'Modular')->count(),
            ],
            '12' => [
                'total' => $students->where('grade_level', '12')->count(),
                'f2f' => $students->where('grade_level', '12')->where('learning_modality', 'Face-to-Face')->count(),
                'modular' => $students->where('grade_level', '12')->where('learning_modality', 'Modular')->count(),
            ]
        ];

        // 5. Build Data Array
        $data = [
            'school_year' => $sy,
            'title' => $title,
            'description' => $description,
            'total' => $students->count(),
            
            // New Detailed Grade Breakdown
            'grade_breakdown' => $gradeBreakdown,

            // Updated Helpers (See Below)
            'by_strand' => $this->groupByStrand($students),
            'by_section' => $this->groupBySection($students),
            
            'date_generated' => now()->format('F d, Y h:i A'),
            'generated_by' => auth()->user()->name, 
            'registrar' => $registrarName, 
            'logo_path' => public_path('images/logo.png'),
        ];

        // 6. LOG ACTIVITY
        $this->logActivity("Generated Report: $title for SY $sy");

        // 7. Download PDF
        $pdf = Pdf::loadView('reports.summary', $data);
        return $pdf->download("Report_{$type}_{$sy}.pdf");
    }

    // --- UPDATED HELPERS (WITH MODALITY COUNT) ---

    private function groupByStrand($students) {
        $strands = Strand::all();
        $result = [];
        foreach($strands as $strand) {
            $subset = $students->where('strand_id', $strand->id);
            if($subset->count() > 0) {
                // Return Array instead of Count
                $result[$strand->code] = [
                    'total' => $subset->count(),
                    'f2f' => $subset->where('learning_modality', 'Face-to-Face')->count(),
                    'modular' => $subset->where('learning_modality', 'Modular')->count(),
                ];
            }
        }
        return $result;
    }

    private function groupBySection($students) {
        $sections = Section::all();
        $result = [];
        foreach($sections as $sec) {
            $subset = $students->where('section_id', $sec->id);
            if($subset->count() > 0) {
                // Return Array instead of Count
                $result[$sec->name] = [
                    'total' => $subset->count(),
                    'f2f' => $subset->where('learning_modality', 'Face-to-Face')->count(),
                    'modular' => $subset->where('learning_modality', 'Modular')->count(),
                ];
            }
        }
        return $result;
    }

    // EXPORT CSV MASTERLIST
    // EXPORT COMPLETE CSV MASTERLIST (GROUPED BY SECTION + COMPLETE DATA)
    public function exportMasterlist(Request $request)
    {
        $sy = $request->input('school_year');
        $filename = "MASTERLIST_COMPLETE_{$sy}_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        // 1. EXACT COLUMNS REQUESTED
        $columns = [
            'LRN', 
            'Last Name', 'First Name', 'Middle Name', 'Suffix',
            'Date of Birth', 'Age', 'Gender',
            'Place of Birth', 'Citizenship', 'Civil Status', 'Religion',
            'Home Address', 'Provincial Address',
            'Email', 'Contact Number',
            'Current School Attended', 
            'Strand',                   // Mapped
            'Learning Modality',
            'Section',                  // Mapped
            'Grade Level',
            'General Average',
            'Semester', 'School Year',
            'Employer Name', 'Employer Contact',
            'Father Name', 'Father Occupation', 'Father Contact',
            'Mother Name', 'Mother Occupation', 'Mother Contact',
            'Guardian Name', 'Guardian Occupation', 'Guardian Contact',
            'Status',
            'Released By', 'Released At'
        ];

        // 2. FETCH DATA & GROUP BY SECTION
        $students = Student::with(['strand', 'section'])
            ->where('school_year', $sy)
            ->get()
            // Group by Section Name (or 'NO SECTION' if null)
            ->groupBy(function($student) {
                return $student->section ? $student->section->name : 'NO SECTION ASSIGNED';
            })
            ->sortKeys(); // A-Z Section Sorting

        // LOG ACTIVITY
        $this->logActivity("Exported Complete Masterlist CSV for SY $sy");

        // 3. STREAM DOWNLOAD
        $callback = function() use ($students, $columns, $sy) {
            $file = fopen('php://output', 'w');
            
            // TITLE
            fputcsv($file, ['SMART ENROLL SYSTEM - COMPLETE MASTERLIST']);
            fputcsv($file, ["School Year: $sy"]);
            fputcsv($file, ["Generated On: " . now()->format('F d, Y h:i A')]);
            fputcsv($file, []); 

            // LOOP PER SECTION
            foreach ($students as $sectionName => $sectionStudents) {
                
                // SECTION HEADER
                fputcsv($file, []); 
                fputcsv($file, ["--- SECTION: " . strtoupper($sectionName) . " ---"]);
                
                // COLUMN HEADERS
                fputcsv($file, $columns);

                // SORT STUDENTS (Male First -> Alphabetical)
                $sortedStudents = $sectionStudents->sortBy([
                    ['gender', 'desc'],
                    ['last_name', 'asc']
                ]);

                // DATA MAPPING
                foreach ($sortedStudents as $student) {
                    fputcsv($file, [
                        // --- 1. PERSONAL ---
                        $student->lrn,
                        strtoupper($student->last_name),
                        strtoupper($student->first_name),
                        strtoupper($student->middle_name),
                        $student->suffix,
                        $student->date_of_birth,
                        $student->age,
                        strtoupper($student->gender),
                        strtoupper($student->place_of_birth),
                        strtoupper($student->citizenship),
                        strtoupper($student->civil_status),
                        strtoupper($student->religion),

                        // --- 2. ADDRESS & CONTACT ---
                        strtoupper($student->home_address),
                        strtoupper($student->provincial_address),
                        $student->email,
                        $student->contact_number,

                        // --- 3. ACADEMIC ---
                        strtoupper($student->current_school_attended),
                        $student->strand ? $student->strand->code : 'N/A', // Mapped Strand
                        strtoupper($student->learning_modality),
                        $student->section ? $student->section->name : 'N/A', // Mapped Section
                        $student->grade_level,
                        $student->general_average,
                        $student->semester,
                        $student->school_year,

                        // --- 4. EMPLOYMENT ---
                        strtoupper($student->employer_name),
                        $student->employer_contact,

                        // --- 5. PARENTS ---
                        strtoupper($student->father_name),
                        strtoupper($student->father_occupation),
                        $student->father_contact,
                        strtoupper($student->mother_name),
                        strtoupper($student->mother_occupation),
                        $student->mother_contact,

                        // --- 6. GUARDIAN ---
                        strtoupper($student->guardian_name),
                        strtoupper($student->guardian_occupation),
                        $student->guardian_contact,

                        // --- 7. STATUS ---
                        strtoupper($student->status),
                        strtoupper($student->released_by),
                        $student->released_at,
                    ]);
                }
                
                // FOOTER PER SECTION
                fputcsv($file, ["Total: " . $sortedStudents->count()]);
                fputcsv($file, []); 
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // HELPER FOR LOGGING
    private function logActivity($description) {
        try {
            ActivityLog::create([
                'user_id' => Auth::id(), // ID ng naka-login na user
                'action' => 'REPORT_GENERATION',
                'description' => $description,
                'ip_address' => request()->ip() // Optional: Capture IP
            ]);
        } catch (\Exception $e) {
            // Silently fail if logging has error (optional)
        }
    }
}