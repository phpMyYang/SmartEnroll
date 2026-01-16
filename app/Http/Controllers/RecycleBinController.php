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

    // RESTORE (Bulk)
    public function restore(Request $request)
    {
        $type = $request->input('type');
        $ids = $request->input('ids'); // Array of IDs

        $model = $this->getModelByType($type);

        if ($model) {
            // Restore multiple IDs at once
            $model::onlyTrashed()->whereIn('id', $ids)->restore();
            
            // LOG ACTIVITY
            $count = count($ids);
            $this->logActivity("Restored $count item(s) from Recycle Bin ($type)");

            return response()->json(['message' => 'Selected items restored successfully!']);
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