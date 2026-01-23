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
     * UPDATE STUDENT RECORD
     */
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        
        $request->validate([
            'lrn' => 'required|unique:students,lrn,'.$id,
            'email' => 'required|email|unique:students,email,'.$id,
            'date_of_birth' => 'nullable|date',
            'age' => 'nullable|integer',
        ]);

        $data = $request->all();

        // REMOVE SYSTEM FIELDS & RELATIONSHIPS (Fixes "Unknown Column" Error)
        unset($data['id']);
        unset($data['created_at']);
        unset($data['updated_at']);
        unset($data['deleted_at']);
        unset($data['strand']);   // Prevent saving strand object
        unset($data['section']);  // Prevent saving section object

        // 1. Handle Empty Section ID
        if (empty($data['section_id'])) {
            $data['section_id'] = null;
        }

        // 2. Fill "null" Logic (Excluded Dates)
        foreach ($data as $key => $value) {
            if (empty($value) && !in_array($key, [
                'requirements', 
                'fees', 
                'section_id', 
                'date_of_birth', 
                'age', 
                'released_at'
            ])) {
                $data[$key] = null;
            }
        }

        // 3. Update & Track Changes
        $student->fill($data);
        
        if ($student->isDirty()) {
            // Get raw changes before saving
            $rawChanges = $student->getDirty();
            $student->save();

            // LOG ACTIVITY: UPDATE
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'update',
                'description' => "Updated profile of student: {$student->last_name}, {$student->first_name}",
                'ip_address' => $request->ip()
            ]);

            // --- FORMAT DATA FOR EMAIL ---
            $formattedChanges = [];

            foreach ($rawChanges as $key => $newValue) {
                // SKIP Internal Fields
                if (in_array($key, ['updated_at', 'created_at', 'id', 'previous_status', 'released_by', 'released_at'])) {
                    continue;
                }

                // A. STRAND ID -> STRAND CODE
                if ($key === 'strand_id') {
                    $strandName = 'Unknown Strand';
                    if ($newValue) {
                        $strand = Strand::find($newValue);
                        if ($strand) $strandName = $strand->code;
                    }
                    $formattedChanges['Strand'] = $strandName;
                    continue;
                }

                // B. SECTION ID -> SECTION NAME
                if ($key === 'section_id') {
                    $secName = 'No Section Assigned';
                    if ($newValue) {
                        $sec = Section::find($newValue);
                        if ($sec) $secName = $sec->name;
                    }
                    $formattedChanges['Assigned Section'] = $secName;
                    continue;
                }

                // C. REQUIREMENTS -> READABLE LIST
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
                        if (empty($reqs[$k])) {
                            $missing[] = $label;
                        }
                    }

                    if (empty($missing)) {
                        $formattedChanges['Requirements Status'] = 'COMPLETED (Congratulations!)';
                    } else {
                        $formattedChanges['Pending Requirements'] = implode(', ', $missing);
                    }
                    continue;
                }

                // D. DEFAULT FORMATTING
                $label = ucwords(str_replace('_', ' ', $key));
                $formattedChanges[$label] = $newValue;
            }

            // 4. Send Email (Only if there are valid changes)
            if (!empty($formattedChanges)) {
                try {
                    Mail::to($student->email)->send(new StudentUpdated($student, $formattedChanges));
                } catch (\Exception $e) {
                    Log::error("Update email failed: " . $e->getMessage());
                }
            }
        }

        return response()->json(['message' => 'Student record updated successfully.']);
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