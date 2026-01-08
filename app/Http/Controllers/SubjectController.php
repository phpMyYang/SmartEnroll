<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

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
        return response()->json(['message' => 'Subject updated successfully', 'subject' => $subject]);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);
        if ($subject) {
            $subject->delete();
            return response()->json(['message' => 'Subject deleted successfully']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}