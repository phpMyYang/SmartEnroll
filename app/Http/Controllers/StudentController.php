<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Section;
use App\Models\Strand;
use App\Models\EnrollmentSetting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

// Mailables
use App\Mail\ApplicationReceived;
use App\Mail\StudentUpdated;
use App\Mail\EnrollmentInstruction;

class StudentController extends Controller
{
    /**
     * GET ALL STUDENTS
     */
    public function index()
    {
        return Student::with(['strand', 'section'])->latest()->get();
    }

    /**
     * STORE (CREATE NEW STUDENT)
     */
    public function store(Request $request)
    {
        // 1. Get Active Settings
        $settings = EnrollmentSetting::first();
        $activeSem = $settings ? $settings->semester : '1st Semester';
        $activeSY = $settings ? $settings->school_year : date('Y').'-'.(date('Y')+1);

        // 2. Validate Input
        $request->validate([
            'lrn' => 'required|unique:students,lrn',
            'email' => 'required|email|unique:students,email',
            'last_name' => 'required',
            'first_name' => 'required',
            'strand_id' => 'required',
            'date_of_birth' => 'required|date',
            'age' => 'required|integer',
        ]);

        $data = $request->all();
        
        // 3. Inject System Fields
        $data['semester'] = $activeSem;
        $data['school_year'] = $activeSY;
        $data['status'] = 'pending'; 

        // 4. Handle Empty Section ID
        if (empty($data['section_id'])) {
            $data['section_id'] = null;
        }

        // 5. Fill "null" Logic (Excluded Dates & Sensitive Fields)
        foreach ($data as $key => $value) {
            if (empty($value) && !in_array($key, [
                'requirements', 
                'fees', 
                'section_id', 
                'date_of_birth', 
                'age',
                'released_at',
                'created_at',
                'updated_at'
            ])) {
                $data[$key] = null;
            }
        }

        // 6. Save to Database
        $student = Student::create($data);

        // LOG ACTIVITY: CREATE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create',
            'description' => "Enrolled new student: {$student->last_name}, {$student->first_name}",
            'ip_address' => $request->ip()
        ]);
        
        // 7. Send Welcome Email
        try {
            Mail::to($student->email)->send(new ApplicationReceived($student));
        } catch (\Exception $e) {
            Log::error("Email failed: " . $e->getMessage());
        }

        return response()->json(['message' => 'Application submitted successfully!']);
    }

    /**
     * SHOW SINGLE STUDENT
     */
    public function show($id)
    {
        return Student::with(['strand', 'section'])->findOrFail($id);
    }

    /**
     * UPDATE STUDENT RECORD (With Anti-Overbooking Lock)
     */
    public function update(Request $request, $id)
    {
        // GAMIT TAYO NG TRANSACTION PARA SAFE
        return DB::transaction(function () use ($request, $id) {
            
            $student = Student::findOrFail($id);

            $request->validate([
                'lrn' => 'required|unique:students,lrn,'.$id,
                'email' => 'required|email|unique:students,email,'.$id,
                'date_of_birth' => 'nullable|date',
                'age' => 'nullable|integer',
            ]);

            $data = $request->all();

            // CLEANUP DATA
            unset($data['id'], $data['created_at'], $data['updated_at'], $data['deleted_at'], $data['strand'], $data['section']);

            if (empty($data['section_id'])) {
                $data['section_id'] = null;
            }

            // NULLIFY EMPTY FIELDS
            foreach ($data as $key => $value) {
                if (empty($value) && !in_array($key, ['requirements', 'fees', 'section_id', 'date_of_birth', 'age', 'released_at'])) {
                    $data[$key] = null;
                }
            }

            // ---------------------------------------------------------
            // 🔒 CRITICAL: RACE CONDITION & CAPACITY CHECK
            // ---------------------------------------------------------
            // Check kung nagbago ang Section ID o naging 'enrolled' ang status
            $isAssigningSection = !empty($data['section_id']) && $data['section_id'] != $student->section_id;
            $isEnrolling = isset($data['status']) && $data['status'] === 'enrolled' && $student->status !== 'enrolled';

            if ($isAssigningSection || $isEnrolling) {
                $targetSectionId = $data['section_id'] ?? $student->section_id;

                if ($targetSectionId) {
                    // 1. LOCK THE SECTION ROW (Iba muna mag-aantay)
                    $section = Section::where('id', $targetSectionId)->lockForUpdate()->first();

                    if ($section) {
                        // 2. BILANGIN ANG CURRENT ENROLLED (Real-time count inside lock)
                        $currentEnrolled = $section->students()->where('status', 'enrolled')->count();

                        // 3. CHECK CAPACITY
                        // Kung puno na, ABORT TRANSACTION agad.
                        if ($currentEnrolled >= $section->capacity) {
                            return response()->json([
                                'message' => "FAILED: Section '{$section->name}' is FULL ({$currentEnrolled}/{$section->capacity}). Please choose another section."
                            ], 422);
                        }
                    }
                }
            }
            // ---------------------------------------------------------
            // END CRITICAL SECTION
            // ---------------------------------------------------------

            // PROCEED UPDATE
            $student->fill($data);

            if ($student->isDirty()) {
                $rawChanges = $student->getDirty();
                $student->save(); // Save inside transaction

                // LOG ACTIVITY
                ActivityLog::create([
                    'user_id' => Auth::id(),
                    'action' => 'update',
                    'description' => "Updated profile of student: {$student->last_name}, {$student->first_name}",
                    'ip_address' => $request->ip()
                ]);

                // EMAIL LOGIC (Copied from your existing code)
                $formattedChanges = [];
                foreach ($rawChanges as $key => $newValue) {
                    if (in_array($key, ['updated_at', 'created_at', 'id', 'previous_status', 'released_by', 'released_at'])) continue;

                    if ($key === 'strand_id') {
                        $strandName = 'Unknown Strand';
                        if ($newValue) {
                            $strand = Strand::find($newValue);
                            if ($strand) $strandName = $strand->code;
                        }
                        $formattedChanges['Strand'] = $strandName;
                        continue;
                    }

                    if ($key === 'section_id') {
                        $secName = 'No Section Assigned';
                        if ($newValue) {
                            $sec = Section::find($newValue);
                            if ($sec) $secName = $sec->name;
                        }
                        $formattedChanges['Assigned Section'] = $secName;
                        continue;
                    }

                    if ($key === 'requirements') {
                        $reqs = $student->requirements;
                        if (is_string($reqs)) $reqs = json_decode($reqs, true);
                        $missing = [];
                        $labels = [
                            'psa' => 'PSA Birth Certificate',
                            'form137' => 'Form 137 / SF10',
                            'good_moral' => 'Good Moral Certificate',
                            'diploma' => 'Grade 10 Diploma',
                            'card' => 'Report Card (Form 138)',
                            'picture' => '2x2 Picture (2pcs)'      
                        ];
                        foreach ($labels as $k => $label) {
                            if (empty($reqs[$k])) $missing[] = $label;
                        }
                        if (empty($missing)) {
                            $formattedChanges['Requirements Status'] = 'COMPLETED (Congratulations!)';
                        } else {
                            $formattedChanges['Pending Requirements'] = implode(', ', $missing);
                        }
                        continue;
                    }
                    $label = ucwords(str_replace('_', ' ', $key));
                    $formattedChanges[$label] = $newValue;
                }

                if (!empty($formattedChanges)) {
                    try {
                        Mail::to($student->email)->send(new StudentUpdated($student, $formattedChanges));
                    } catch (\Exception $e) {
                        Log::error("Update email failed: " . $e->getMessage());
                    }
                }
            }

            return response()->json(['message' => 'Student record updated successfully.']);
        });
    }

    /**
     * CHANGE STATUS
     */
    public function changeStatus(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $newStatus = $request->status;
        $oldStatus = $student->status; // Capture old status for log
        $user = Auth::user(); 

        if ($newStatus !== 'reset') {
            $student->update(['previous_status' => $student->status]);
        }

        // A. RESET LOGIC
        if ($newStatus === 'reset') {
            $prev = $student->previous_status ?? 'pending';
            $student->update([
                'status' => $prev,
                'released_by' => null,
                'released_at' => null
            ]);

            // LOG ACTIVITY: RESET
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'description' => "Reset status of {$student->last_name} from " . strtoupper($oldStatus) . " back to " . strtoupper($prev),
                'ip_address' => $request->ip()
            ]);

            return response()->json(['message' => 'Status reset to ' . $prev]);
        }

        // B. PASSED LOGIC  Sends Instruction Email)
        if ($newStatus === 'passed') {
            try {
                Mail::to($student->email)->send(new EnrollmentInstruction($student));
            } catch (\Exception $e) {
                Log::error("Instruction email failed: " . $e->getMessage());
            }
        }

        // C. RELEASED LOGIC
        if ($newStatus === 'released') {
            $student->update([
                'status' => 'released',
                'released_by' => $user ? $user->name : 'Administrator',
                'released_at' => now()
            ]);

            // LOG ACTIVITY: RELEASED
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'description' => "Released record of student: {$student->last_name}, {$student->first_name}",
                'ip_address' => $request->ip()
            ]);

            return response()->json(['message' => 'Record marked as Released.']);
        }

        // D. GENERIC UPDATE
        $student->update(['status' => $newStatus]);

        // LOG ACTIVITY: GENERIC STATUS CHANGE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update',
            'description' => "Changed status of {$student->last_name} from " . strtoupper($oldStatus) . " to " . strtoupper($newStatus),
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Status updated to ' . strtoupper($newStatus)]);
    }

    /**
     * DELETE STUDENT
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $name = "{$student->last_name}, {$student->first_name}";
        $student->delete();

        // LOG ACTIVITY: DELETE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete',
            'description' => "Deleted student record: {$name}",
            'ip_address' => request()->ip()
        ]);

        return response()->json(['message' => 'Student record deleted successfully.']);
    }
}