<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\Strand;
use App\Models\Section;
use App\Models\Subject;
use App\Models\ActivityLog; // IMPORT ACTIVITY LOG
use Illuminate\Support\Facades\Auth; // IMPORT AUTH

class RecycleBinController extends Controller
{
    // GET TRASHED ITEMS (Per Type)
    public function index(Request $request)
    {
        $type = $request->query('type', 'students'); // Default to students

        $data = match ($type) {
            'users' => User::onlyTrashed()->orderBy('deleted_at', 'desc')->get(),
            'students' => Student::onlyTrashed()->orderBy('deleted_at', 'desc')->get(),
            'strands' => Strand::onlyTrashed()->orderBy('deleted_at', 'desc')->get(),
            'sections' => Section::onlyTrashed()->with('strand')->orderBy('deleted_at', 'desc')->get(),
            'subjects' => Subject::onlyTrashed()->orderBy('deleted_at', 'desc')->get(),
            default => []
        };

        return response()->json($data);
    }

    // RESTORE (Bulk) - UPDATED WITH "SMART RESTORE" LOGIC
    public function restore(Request $request)
    {
        $type = $request->input('type');
        $ids = $request->input('ids'); // Array of IDs

        $model = $this->getModelByType($type);

        if ($model) {
            // A. SPECIAL LOGIC FOR STUDENTS (Smart Capacity Check)
            if ($type === 'students') {
                $restoredCount = 0;
                $demotedCount = 0;

                // Kunin ang mga students na nasa trash
                $students = Student::onlyTrashed()->whereIn('id', $ids)->get();

                foreach ($students as $student) {
                    // 1. Restore muna (Babalik sa original status niya, e.g., 'enrolled')
                    $student->restore();
                    $restoredCount++;

                    // 2. Check kung kailangan i-demote to Pending
                    // Logic: Kung 'enrolled' siya AT may section, check natin kung puno na.
                    if ($student->status === 'enrolled' && $student->section_id) {
                        
                        $section = Section::find($student->section_id);

                        if ($section) {
                            // Bilangin ang enrolled students (EXCLUDE ang sarili niya para fair ang checking)
                            $currentCount = $section->students()
                                ->where('status', 'enrolled')
                                ->where('id', '!=', $student->id) 
                                ->count();

                            // Kung PUNO NA (Current >= Capacity), gawing PENDING
                            if ($currentCount >= $section->capacity) {
                                $student->update([
                                    'status' => 'pending',
                                    // // Optional: Pwede mo rin alisin ang released info kung meron
                                    // 'released_by' => null, 
                                    // 'released_at' => null
                                ]);
                                $demotedCount++;
                            }
                            // ELSE: Kung may slot pa, hayaan lang na 'enrolled' siya.
                        }
                    }
                }

                // Custom Message
                $msg = "Restored {$restoredCount} student(s).";
                if ($demotedCount > 0) {
                    $msg .= " Note: {$demotedCount} student(s) set to PENDING because their sections were full.";
                }

                $this->logActivity($msg);
                return response()->json(['message' => $msg]);
            }
            
            // B. NORMAL LOGIC FOR OTHER TYPES (Users, Strands, etc.)
            else {
                $model::onlyTrashed()->whereIn('id', $ids)->restore();
                
                $count = count($ids);
                $this->logActivity("Restored $count item(s) from Recycle Bin ($type)");
                return response()->json(['message' => 'Selected items restored successfully!']);
            }
        }

        return response()->json(['message' => 'Invalid Type'], 400);
    }

    // PERMANENT DELETE (Bulk)
    public function forceDelete(Request $request)
    {
        $type = $request->input('type');
        $ids = $request->input('ids');

        $model = $this->getModelByType($type);

        if ($model) {
            // Force delete multiple IDs at once
            $model::onlyTrashed()->whereIn('id', $ids)->forceDelete();

            // LOG ACTIVITY
            $count = count($ids);
            $this->logActivity("Permanently deleted $count item(s) from Recycle Bin ($type)");

            return response()->json(['message' => 'Selected items permanently deleted!']);
        }

        return response()->json(['message' => 'Invalid Type'], 400);
    }

    // HELPER: Map string to Model Class
    private function getModelByType($type) {
        return match ($type) {
            'users' => User::class,
            'students' => Student::class,
            'strands' => Strand::class,
            'sections' => Section::class,
            'subjects' => Subject::class,
            default => null
        };
    }

    // HELPER FOR LOGGING
    private function logActivity($description) {
        try {
            ActivityLog::create([
                'user_id' => Auth::id(), // ID ng naka-login na user
                'action' => 'RECYCLE_BIN',
                'description' => $description,
                'ip_address' => request()->ip()
            ]);
        } catch (\Exception $e) {
            // Silently fail if logging has error
        }
    }
}