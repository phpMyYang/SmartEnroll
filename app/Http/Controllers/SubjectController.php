<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\ActivityLog; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 

class SubjectController extends Controller
{
    public function index()
    {
        // Isama ang strand details sa pag-fetch
        return Subject::with('strand')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:subjects,code',
            'description' => 'required|string',
            'strand_id' => 'nullable|exists:strands,id', // Pwedeng null kung Core Subject
            'grade_level' => 'required|in:11,12',
            'semester' => 'required|in:1st,2nd',
        ]);

        $subject = Subject::create($validated);

        // LOG ACTIVITY: CREATE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create',
            'description' => "Created new subject: {$subject->code}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Subject created successfully', 'subject' => $subject]);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);
        if (!$subject) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'code' => 'required|string|max:20|unique:subjects,code,' . $id,
            'description' => 'required|string',
            'strand_id' => 'nullable|exists:strands,id',
            'grade_level' => 'required|in:11,12',
            'semester' => 'required|in:1st,2nd',
        ]);

        $subject->update($validated);

        // LOG ACTIVITY: UPDATE
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update',
            'description' => "Updated subject details: {$subject->code}",
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Subject updated successfully', 'subject' => $subject]);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);
        if ($subject) {
            $code = $subject->code; // Save code before delete
            $subject->delete();

            // LOG ACTIVITY: DELETE
            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'delete',
                'description' => "Deleted subject: {$code}",
                'ip_address' => request()->ip()
            ]);

            return response()->json(['message' => 'Subject deleted successfully']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}