<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index()
    {
        // Eager load 'strand' para makuha ang strand code (e.g. STEM)
        return Section::with('strand')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'strand_id' => 'required|exists:strands,id',
            'grade_level' => 'required|in:11,12',
            'capacity' => 'required|integer|min:1',
        ]);

        $section = Section::create($validated);
        return response()->json(['message' => 'Section created successfully', 'section' => $section]);
    }

    public function update(Request $request, $id)
    {
        $section = Section::find($id);
        if (!$section) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'strand_id' => 'required|exists:strands,id',
            'grade_level' => 'required|in:11,12',
            'capacity' => 'required|integer|min:1',
        ]);

        $section->update($validated);
        return response()->json(['message' => 'Section updated successfully', 'section' => $section]);
    }

    public function destroy($id)
    {
        $section = Section::find($id);
        if ($section) {
            $section->delete();
            return response()->json(['message' => 'Section deleted successfully']);
        }
        return response()->json(['message' => 'Not found'], 404);
    }
}